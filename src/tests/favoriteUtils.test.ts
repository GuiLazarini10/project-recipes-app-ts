import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getFavoriteRecipes, saveFavoriteRecipes, checkIfRecipeIsFavorited, createFavoriteRecipe } from '../services/favoriteUtils';
import { Recipe, FavoriteRecipe } from '../services/types';

const MOCK_FAVORITE_ID = '1';
const MOCK_FAVORITE_TYPE_MEAL = 'meal';
const MOCK_NATIONALITY = 'Italian';
const MOCK_CATEGORY_PASTA = 'Pasta';
const MOCK_NAME_SPAGHETTI = 'Spaghetti';
const MOCK_IMAGE_SPAGHETTI = 'spaghetti.jpg';
const MOCK_RECIPE_ID = '1';

const MOCK_FAVORITES: FavoriteRecipe[] = [
  {
    id: MOCK_FAVORITE_ID,
    type: MOCK_FAVORITE_TYPE_MEAL,
    nationality: MOCK_NATIONALITY,
    category: MOCK_CATEGORY_PASTA,
    alcoholicOrNot: '',
    name: MOCK_NAME_SPAGHETTI,
    image: MOCK_IMAGE_SPAGHETTI,
  },
];

const MOCK_RECIPE_MEAL: Recipe = {
  id: MOCK_RECIPE_ID,
  strMeal: MOCK_NAME_SPAGHETTI,
  strDrink: '',
  strCategory: MOCK_CATEGORY_PASTA,
  strAlcoholic: '',
  strMealThumb: MOCK_IMAGE_SPAGHETTI,
  strDrinkThumb: '',
  strInstructions: '',
  strYoutube: '',
  strArea: MOCK_NATIONALITY,
  strIngredient1: 'Ingredient 1',
  strMeasure1: '1 cup',
};

const MOCK_RECIPE_DRINK: Recipe = {
  id: MOCK_RECIPE_ID,
  strMeal: '',
  strDrink: 'Margarita',
  strCategory: 'Cocktail',
  strAlcoholic: 'Alcoholic',
  strMealThumb: '',
  strDrinkThumb: 'margarita.jpg',
  strInstructions: '',
  strYoutube: '',
  strArea: '',
  strIngredient1: 'Ingredient 1',
  strMeasure1: '1 cup',
};

const setupLocalStorageMock = (mockData: any) => {
  localStorage.setItem('favoriteRecipes', JSON.stringify(mockData));
};
describe('createFavoriteRecipe', () => {
  it('should create a favorite recipe with meal type', () => {
    const favoriteRecipe = createFavoriteRecipe(MOCK_RECIPE_ID, MOCK_RECIPE_MEAL, true);
    expect(favoriteRecipe).toEqual({
      id: MOCK_RECIPE_ID,
      type: MOCK_FAVORITE_TYPE_MEAL,
      nationality: MOCK_NATIONALITY,
      category: MOCK_CATEGORY_PASTA,
      alcoholicOrNot: '',
      name: MOCK_NAME_SPAGHETTI,
      image: MOCK_IMAGE_SPAGHETTI,
    });
  });
  it('should create a favorite recipe with drink type', () => {
    const favoriteRecipe = createFavoriteRecipe(MOCK_RECIPE_ID, MOCK_RECIPE_DRINK, false);
    expect(favoriteRecipe).toEqual({
      id: MOCK_RECIPE_ID,
      type: 'drink',
      nationality: '',
      category: 'Cocktail',
      alcoholicOrNot: 'Alcoholic',
      name: 'Margarita',
      image: 'margarita.jpg',
    });
  });
  it('should create a favorite recipe with empty fields if data is missing (meal type)', () => {
    const incompleteRecipeMeal: Recipe = { id: MOCK_RECIPE_ID };
    const favoriteRecipe = createFavoriteRecipe(MOCK_RECIPE_ID, incompleteRecipeMeal, true);
    expect(favoriteRecipe).toEqual({
      id: MOCK_RECIPE_ID,
      type: 'meal',
      nationality: '',
      category: '',
      alcoholicOrNot: '',
      name: '',
      image: '',
    });
  });
  it('should create a favorite recipe with empty fields if data is missing (drink type)', () => {
    const incompleteRecipeDrink: Recipe = { id: MOCK_RECIPE_ID };
    const favoriteRecipe = createFavoriteRecipe(MOCK_RECIPE_ID, incompleteRecipeDrink, false);
    expect(favoriteRecipe).toEqual({
      id: MOCK_RECIPE_ID,
      type: 'drink',
      nationality: '',
      category: '',
      alcoholicOrNot: '',
      name: '',
      image: '',
    });
  });
});

describe('favoriteUtils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getFavoriteRecipes', () => {
    it('should return an empty array when there are no favorite recipes in localStorage', () => {
      const favorites = getFavoriteRecipes();
      expect(favorites).toEqual([]);
    });

    it('should return favorite recipes from localStorage', () => {
      setupLocalStorageMock(MOCK_FAVORITES);
      const favorites = getFavoriteRecipes();
      expect(favorites).toEqual(MOCK_FAVORITES);
    });
  });

  describe('saveFavoriteRecipes', () => {
    it('should save favorite recipes to localStorage', () => {
      saveFavoriteRecipes(MOCK_FAVORITES);
      expect(localStorage.getItem('favoriteRecipes')).toEqual(JSON.stringify(MOCK_FAVORITES));
    });
  });

  describe('checkIfRecipeIsFavorited', () => {
    it('should return true if the recipe is favorited', () => {
      const isFavorited = checkIfRecipeIsFavorited(MOCK_FAVORITES, MOCK_FAVORITE_ID);
      expect(isFavorited).toBe(true);
    });

    it('should return false if the recipe is not favorited', () => {
      const isFavorited = checkIfRecipeIsFavorited(MOCK_FAVORITES, '2');
      expect(isFavorited).toBe(false);
    });
  });
});
