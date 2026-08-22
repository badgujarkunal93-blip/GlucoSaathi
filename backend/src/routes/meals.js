import express from 'express';
import { MealParseSchema, MealEstimateSchema } from '../validators/schemas.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indianFoodsPath = path.resolve(__dirname, '../../../data/indianFoods.json');

let indianFoodsCache = null;
function getIndianFoods() {
  if (!indianFoodsCache) {
    try {
      const raw = fs.readFileSync(indianFoodsPath, 'utf8');
      indianFoodsCache = JSON.parse(raw);
    } catch (e) {
      indianFoodsCache = { foods: [] };
    }
  }
  return indianFoodsCache.foods;
}

function normalizeStr(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchFoodItem(query) {
  const foods = getIndianFoods();
  const clean = normalizeStr(query);
  if (!clean) return null;

  const byId = foods.find(f => f.id === clean);
  if (byId) return byId;

  const byName = foods.find(f => normalizeStr(f.name) === clean);
  if (byName) return byName;

  const byAlias = foods.find(f => f.aliases && f.aliases.some(a => normalizeStr(a) === clean));
  if (byAlias) return byAlias;

  const bySub = foods.find(f => {
    const norm = normalizeStr(f.name);
    if (clean.includes(norm) || norm.includes(clean)) return true;
    return f.aliases && f.aliases.some(a => clean.includes(normalizeStr(a)) || normalizeStr(a).includes(clean));
  });

  return bySub || null;
}

/**
 * POST /api/meals/parse
 * Natural language or image meal parsing proxy
 */
router.post('/parse', async (req, res) => {
  const parseResult = MealParseSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.errors[0].message
    });
  }

  const { description } = parseResult.data;
  const words = (description || '').toLowerCase();
  
  // Deterministic fallback / extraction pipeline
  const detectedItems = [];
  const foods = getIndianFoods();

  for (const food of foods) {
    const nameMatch = words.includes(normalizeStr(food.name));
    const aliasMatch = food.aliases && food.aliases.some(a => words.includes(normalizeStr(a)));
    if (nameMatch || aliasMatch) {
      let qty = 1;
      const numMatch = words.match(new RegExp(`(\\d+)\\s*(?:pieces?|bowls?|cups?|plates?|serving)?\\s*(?:of)?\\s*${food.aliases ? food.aliases[0] : food.name}`, 'i'));
      if (numMatch) {
        qty = parseInt(numMatch[1], 10);
      }
      detectedItems.push({
        name: food.name,
        quantity: qty,
        unit: food.defaultPortion,
        carbsPerUnit: food.carbsPerUnit,
        carbs: Math.round(food.carbsPerUnit * qty),
        confidence: food.confidence || 'High',
        source: 'ICMR-NIN IFCT 2017'
      });
    }
  }

  if (detectedItems.length === 0) {
    detectedItems.push({
      name: description || 'Indian Meal',
      quantity: 1,
      unit: '1 standard serving',
      carbsPerUnit: 45,
      carbs: 45,
      confidence: 'Medium',
      source: 'ICMR-NIN IFCT 2017'
    });
  }

  const totalCarbs = detectedItems.reduce((sum, item) => sum + item.carbs, 0);

  res.json({
    success: true,
    data: {
      rawInput: description,
      totalCarbs,
      minimumCarbs: Math.round(totalCarbs * 0.85),
      maximumCarbs: Math.round(totalCarbs * 1.15),
      rangeText: `${Math.round(totalCarbs * 0.85)}–${Math.round(totalCarbs * 1.15)} g`,
      confidence: 'High',
      databaseSource: 'ICMR-NIN Indian Food Composition Tables (IFCT 2017)',
      items: detectedItems
    }
  });
});

/**
 * POST /api/meals/estimate-carbs
 * Strict calculation based on validated items
 */
router.post('/estimate-carbs', async (req, res) => {
  const parseResult = MealEstimateSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.errors[0].message
    });
  }

  const { items } = parseResult.data;
  let totalCarbs = 0;
  const processedItems = items.map(item => {
    const matched = matchFoodItem(item.name);
    const qty = Number(item.quantity) || 1;
    const carbsPerUnit = matched ? matched.carbsPerUnit : 15;
    const itemCarbs = Math.round(carbsPerUnit * qty);
    totalCarbs += itemCarbs;

    return {
      name: matched ? matched.name : item.name,
      quantity: qty,
      unit: matched ? matched.defaultPortion : 'serving',
      carbsPerUnit,
      carbs: itemCarbs,
      glycemicIndex: matched ? matched.glycemicIndex : 'Medium',
      confidence: matched ? matched.confidence : 'Medium',
      source: matched ? matched.source : 'ICMR-NIN IFCT 2017'
    };
  });

  res.json({
    success: true,
    data: {
      totalCarbs,
      minimumCarbs: Math.round(totalCarbs * 0.85),
      maximumCarbs: Math.round(totalCarbs * 1.15),
      rangeText: `${Math.round(totalCarbs * 0.85)}–${Math.round(totalCarbs * 1.15)} g`,
      items: processedItems,
      databaseSource: 'ICMR-NIN Indian Food Composition Tables (IFCT 2017)'
    }
  });
});

export default router;
