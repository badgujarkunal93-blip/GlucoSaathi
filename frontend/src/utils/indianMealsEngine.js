/**
 * GlucoSaathi — Indian Meal Carbohydrate Engine
 * Calibrated for typical Indian dietary portions for Type 1 Diabetes management.
 * Powered by ICMR-NIN (2020) validated database.
 */
import indianFoodsData from '../data/indianFoods.json';
import { 
  findFoodItem, 
  estimateCarbohydrates, 
  parseIndianMealText,
  parseQuantity 
} from '../lib/carb/carbEstimator';

export const INDIAN_FOOD_DATABASE = indianFoodsData.foods;

export const DEMO_MEAL_PRESETS = [
  {
    label: 'North Indian Thali',
    description: '2 rotis, 1 bowl dal tadka and 1 bowl steamed rice',
    icon: '🍛',
    calories: 420
  },
  {
    label: 'South Indian Breakfast',
    description: '2 dosas with sambar and coconut chutney',
    icon: '🥞',
    calories: 360
  },
  {
    label: 'Protein Rich Lunch',
    description: '1 plate rajma chawal with curd and salad',
    icon: '🥘',
    calories: 450
  },
  {
    label: 'Light Evening Snack',
    description: '1 cup masala chai & roasted chana',
    icon: '☕',
    calories: 140
  },
  {
    label: 'Gujarati Breakfast',
    description: '2 pieces dhokla with green chutney',
    icon: '🟨',
    calories: 220
  }
];

export const SAMPLE_PHOTO_PRESETS = [
  {
    id: 'thali_1',
    name: 'Home North Indian Thali',
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    detectedMeal: '2 rotis, dal, rice and sabzi'
  },
  {
    id: 'dosa_sambar',
    name: 'Crispy Dosa with Sambar',
    url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
    detectedMeal: '1 masala dosa and 1 bowl sambar'
  },
  {
    id: 'idli_sambar',
    name: 'Steamed Idli Sambar Plate',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    detectedMeal: '2 idlis and 1 bowl sambar'
  }
];

/**
 * Main parser function used by UI components
 */
export function parseIndianMeal(mealString) {
  if (!mealString || !mealString.trim()) {
    return {
      items: [],
      totalCarbs: 0,
      minCarbs: 0,
      maxCarbs: 0,
      rangeText: '0 g',
      confidence: 'High',
      notes: 'No meal description provided'
    };
  }

  const parsed = parseIndianMealText(mealString);
  const estimation = estimateCarbohydrates(parsed.items);

  return {
    items: estimation.items,
    totalCarbs: estimation.totalCarbs,
    minCarbs: estimation.minimumCarbs,
    maxCarbs: estimation.maximumCarbs,
    rangeText: estimation.rangeText,
    confidence: estimation.confidence,
    notes: estimation.notes,
    rawInput: mealString
  };
}

export { findFoodItem, estimateCarbohydrates, parseIndianMealText, parseQuantity };
