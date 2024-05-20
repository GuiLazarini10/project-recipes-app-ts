import { describe, it, expect, vi } from 'vitest';
import { fetchById, fetchRecommendation } from '../services/api';

global.fetch = vi.fn();

describe('fetchById', () => {
  it('fetches meal by id successfully', async () => {
    const mockMeal = { meals: [{ idMeal: '123', strMeal: 'Test Meal' }] };
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockMeal),
    });

    const result = await fetchById('meals', '123');
    expect(result).toEqual(mockMeal.meals);
  });

  it('fetches drink by id successfully', async () => {
    const mockDrink = { drinks: [{ idDrink: '456', strDrink: 'Test Drink' }] };
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockDrink),
    });

    const result = await fetchById('drinks', '456');
    expect(result).toEqual(mockDrink.drinks);
  });

  it('handles fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Fetch error'));

    await expect(fetchById('meals', '123')).rejects.toThrow('Failed to fetch recipe details');
  });
});

describe('fetchRecommendation', () => {
  it('fetches meal recommendation successfully', async () => {
    const mockMeal = { meals: [{ idMeal: '123', strMeal: 'Test Meal' }] };
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockMeal),
    });

    const result = await fetchRecommendation(false);
    expect(result).toEqual(mockMeal.meals);
  });

  it('fetches drink recommendation successfully', async () => {
    const mockDrink = { drinks: [{ idDrink: '456', strDrink: 'Test Drink' }] };
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockDrink),
    });

    const result = await fetchRecommendation(true);
    expect(result).toEqual(mockDrink.drinks);
  });

  it('handles fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Fetch error'));

    await expect(fetchRecommendation(true)).rejects.toThrow('Failed to fetch recommendation');
  });
});
