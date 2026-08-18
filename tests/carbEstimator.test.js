import { describe, it, expect } from 'vitest';
import { findFoodItem, estimateCarbohydrates, parseIndianMealText } from '../frontend/src/lib/carb/carbEstimator';

describe('Indian Food Carbohydrate Engine', () => {
  it('correctly resolves aliases to standard Indian foods', () => {
    const chapatiMatch = findFoodItem('chapati');
    expect(chapatiMatch).toBeDefined();
    expect(chapatiMatch.id).toBe('roti');

    const phulkaMatch = findFoodItem('phulka');
    expect(phulkaMatch).toBeDefined();
    expect(phulkaMatch.id).toBe('roti');

    const dahiMatch = findFoodItem('dahi');
    expect(dahiMatch).toBeDefined();
    expect(dahiMatch.id).toBe('curd');

    const chawalMatch = findFoodItem('chawal');
    expect(chawalMatch).toBeDefined();
    expect(chawalMatch.id).toBe('rice');
  });

  it('calculates carbohydrate total and range for multi-item Indian meal', () => {
    const items = [
      { name: 'roti', quantity: 2 },
      { name: 'dal tadka', quantity: 1 },
      { name: 'rice', quantity: 1 }
    ];

    const result = estimateCarbohydrates(items);
    // 2 rotis (30g) + 1 dal (18g) + 1 rice (28g) = 76g
    expect(result.totalCarbs).toBeGreaterThan(60);
    expect(result.totalCarbs).toBeLessThan(90);
    expect(result.confidence).toBe('High');
    expect(result.minimumCarbs).toBeLessThan(result.totalCarbs);
    expect(result.maximumCarbs).toBeGreaterThan(result.totalCarbs);
    expect(result.items.length).toBe(3);
  });

  it('parses natural language text with portions', () => {
    const parsed = parseIndianMealText('2 rotis and 1 bowl dal tadka with steamed rice');
    expect(parsed.items.length).toBeGreaterThanOrEqual(3);
    const roti = parsed.items.find(i => i.matchedFoodId === 'roti');
    expect(roti).toBeDefined();
    expect(roti.quantity).toBe(2);
  });

  it('handles unknown food with low confidence fallback', () => {
    const items = [{ name: 'exotic mysterious dessert', quantity: 1 }];
    const result = estimateCarbohydrates(items);
    expect(result.confidence).toBe('Low');
    expect(result.totalCarbs).toBe(15);
  });
});
