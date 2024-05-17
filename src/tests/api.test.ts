import { fetchById, fetchRecommendation } from '../services/api';

// Mock global fetch function
global.fetch = jest.fn();

describe('API Services', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('fetchById', () => {
    it('fetches recipe by ID', async () => {
      const mockMealData = { meals: [{ idMeal: '1', strMeal: 'Mock Meal' }] };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockMealData),
      });

      const result = await fetchById('meals', '1');
      expect(fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/lookup.php?i=1');
      expect(result).toEqual(mockMealData.meals);
    });

    it('handles fetch error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('API is down'));

      await expect(fetchById('meals', '1')).rejects.toThrow('Failed to fetch recipe details');
    });
  });

  describe('fetchRecommendation', () => {
    it('fetches recommendations', async () => {
      const mockDrinkData = { drinks: [{ idDrink: '1', strDrink: 'Mock Drink' }] };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockDrinkData),
      });

      const result = await fetchRecommendation(true);
      expect(fetch).toHaveBeenCalledWith('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
      expect(result).toEqual(mockDrinkData.drinks);
    });

    it('handles fetch error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('API is down'));

      await expect(fetchRecommendation(true)).rejects.toThrow('Failed to fetch recommendation');
    });
  });
});
