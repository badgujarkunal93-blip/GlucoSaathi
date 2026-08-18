import indianFoodsData from '../../data/indianFoods.json';

const FOODS_LIST = indianFoodsData.foods;

/**
 * Normalizes text for alias and name matching
 */
function normalizeStr(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Searches the Indian Foods database by name or alias
 */
export function findFoodItem(query) {
  const cleanQuery = normalizeStr(query);
  if (!cleanQuery) return null;

  // 1. Direct ID match
  const byId = FOODS_LIST.find(f => f.id === cleanQuery);
  if (byId) return byId;

  // 2. Exact name match
  const byName = FOODS_LIST.find(f => normalizeStr(f.name) === cleanQuery);
  if (byName) return byName;

  // 3. Exact alias match
  const byAlias = FOODS_LIST.find(f => 
    f.aliases && f.aliases.some(alias => normalizeStr(alias) === cleanQuery)
  );
  if (byAlias) return byAlias;

  // 4. Substring / Includes match
  const bySubstring = FOODS_LIST.find(f => {
    const normName = normalizeStr(f.name);
    if (cleanQuery.includes(normName) || normName.includes(cleanQuery)) return true;
    return f.aliases && f.aliases.some(a => {
      const normA = normalizeStr(a);
      return cleanQuery.includes(normA) || normA.includes(cleanQuery);
    });
  });

  return bySubstring || null;
}

/**
 * Parses word numbers (e.g. 'two', 'one') or digits into integers/floats
 */
export function parseQuantity(raw) {
  if (!raw) return 1;
  const wordMap = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'half': 0.5, 'quarter': 0.25, 'a': 1, 'an': 1, 'single': 1, 'double': 2, 'pair': 2
  };

  const str = String(raw).toLowerCase().trim();
  if (wordMap[str] !== undefined) return wordMap[str];

  const match = str.match(/(\d+(\.\d+)?)/);
  if (match) return parseFloat(match[0]);

  return 1;
}

/**
 * Estimates carbohydrates, range and confidence for parsed meal items
 */
export function estimateCarbohydrates(parsedItems = []) {
  if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
    return {
      totalCarbs: 0,
      minimumCarbs: 0,
      maximumCarbs: 0,
      rangeText: '0 g',
      confidence: 'High',
      items: [],
      notes: 'No food items specified.'
    };
  }

  let totalCarbs = 0;
  let hasLowConfidence = false;
  let hasMediumConfidence = false;

  const items = parsedItems.map(item => {
    const rawName = item.name || '';
    const qty = typeof item.quantity === 'number' ? item.quantity : parseQuantity(item.quantity);
    const matched = findFoodItem(rawName);

    if (matched) {
      const itemCarbs = Math.round(matched.carbsPerUnit * qty);
      totalCarbs += itemCarbs;

      return {
        name: matched.name,
        originalName: rawName,
        quantity: qty,
        unit: matched.defaultPortion,
        matchedFoodId: matched.id,
        carbsPerUnit: matched.carbsPerUnit,
        carbs: itemCarbs,
        glycemicIndex: matched.glycemicIndex || 'Medium',
        confidence: matched.confidence || 'High',
        icon: matched.icon || '🍽️',
        source: matched.source || 'ICMR-NIN, 2020'
      };
    }

    // Fallback for unknown food
    hasLowConfidence = true;
    const estimatedFallbackCarbs = Math.round(15 * qty);
    totalCarbs += estimatedFallbackCarbs;

    return {
      name: rawName,
      originalName: rawName,
      quantity: qty,
      unit: item.unit || '1 serving',
      carbsPerUnit: 15,
      carbs: estimatedFallbackCarbs,
      glycemicIndex: 'Medium',
      confidence: 'Low',
      icon: '🍲',
      source: 'Estimated standard portion'
    };
  });

  // Calculate Range & Confidence
  let overallConfidence = 'High';
  let varianceFactor = 0.10; // ±10% for High

  if (hasLowConfidence) {
    overallConfidence = 'Low';
    varianceFactor = 0.22; // ±22% for Low
  } else if (hasMediumConfidence || items.length >= 4) {
    overallConfidence = 'Medium';
    varianceFactor = 0.15; // ±15% for Medium
  }

  const roundedTotal = Math.round(totalCarbs);
  const minCarbs = Math.max(0, Math.round(roundedTotal * (1 - varianceFactor)));
  const maxCarbs = Math.round(roundedTotal * (1 + varianceFactor));

  return {
    totalCarbs: roundedTotal,
    minimumCarbs: minCarbs,
    maximumCarbs: maxCarbs,
    rangeText: `${minCarbs}–${maxCarbs} g`,
    confidence: overallConfidence,
    items,
    notes: overallConfidence === 'High' 
      ? 'Matched authoritative ICMR-NIN portion tables.'
      : 'Contains estimated portions. Range reflects typical Indian culinary variability.'
  };
}

/**
 * Deterministic text parser for Indian meals (Offline / Fallback parser)
 */
export function parseIndianMealText(text) {
  if (!text || !text.trim()) {
    return {
      items: [],
      confidence: 'High',
      rawInput: text
    };
  }

  const rawTokens = text.split(/,|\band\b|\bwith\b|\bplus\b|\+/i);
  const identified = [];

  for (const token of rawTokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    // Extract leading quantity if present: "2 rotis", "1 bowl dal", "half cup chai"
    const match = trimmed.match(/^(\d+(\.\d+)?|one|two|three|four|five|six|half|a|an)\s+(katori\s+of\s+|bowl\s+of\s+|cup\s+of\s+|plate\s+of\s+|pieces?\s+of\s+|pieces?|bowls?|katoris?|cups?|plates?)?\s*(.*)$/i);

    let qty = 1;
    let foodQuery = trimmed;

    if (match) {
      qty = parseQuantity(match[1]);
      foodQuery = (match[3] || '').trim() || trimmed;
    }

    const matched = findFoodItem(foodQuery) || findFoodItem(trimmed);

    if (matched) {
      // Check if it's a composite meal with multiple items
      if (matched.isComposite && Array.isArray(matched.items)) {
        for (const subId of matched.items) {
          const subFood = FOODS_LIST.find(f => f.id === subId);
          if (subFood) {
            identified.push({
              name: subFood.name,
              quantity: qty,
              unit: subFood.defaultPortion,
              matchedFoodId: subFood.id,
              carbsPerUnit: subFood.carbsPerUnit,
              carbs: Math.round(subFood.carbsPerUnit * qty),
              glycemicIndex: subFood.glycemicIndex,
              confidence: 'High',
              icon: subFood.icon
            });
          }
        }
      } else {
        identified.push({
          name: matched.name,
          quantity: qty,
          unit: matched.defaultPortion,
          matchedFoodId: matched.id,
          carbsPerUnit: matched.carbsPerUnit,
          carbs: Math.round(matched.carbsPerUnit * qty),
          glycemicIndex: matched.glycemicIndex,
          confidence: matched.confidence,
          icon: matched.icon
        });
      }
    } else {
      identified.push({
        name: trimmed,
        quantity: qty,
        unit: '1 serving',
        carbsPerUnit: 15,
        carbs: Math.round(15 * qty),
        glycemicIndex: 'Medium',
        confidence: 'Low',
        icon: '🍲'
      });
    }
  }

  return {
    items: identified,
    confidence: identified.some(i => i.confidence === 'Low') ? 'Medium' : 'High',
    rawInput: text
  };
}
