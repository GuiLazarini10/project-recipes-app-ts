import { Recipe, FavoriteRecipe } from './types';

export const getFavoriteRecipes = (): FavoriteRecipe[] => {
  return JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
};

export const saveFavoriteRecipes = (favorites: FavoriteRecipe[]) => {
  localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
};

export const checkIfRecipeIsFavorited = (favorites:
FavoriteRecipe[], recipeId: string): boolean => {
  return favorites.some((favorite) => favorite.id === recipeId);
};

export const createFavoriteRecipe = (
  recipeId: string,
  recipeData: Recipe,
  mealType: boolean,
): FavoriteRecipe => {
  return {
    id: recipeId,
    type: mealType ? 'meal' : 'drink',
    nationality: mealType ? recipeData.strArea || '' : '',
    category: recipeData.strCategory || '',
    alcoholicOrNot: mealType ? '' : recipeData.strAlcoholic || '',
    name: mealType ? recipeData.strMeal || '' : recipeData.strDrink || '',
    image: mealType ? recipeData.strMealThumb || '' : recipeData.strDrinkThumb || '',
  };
};
