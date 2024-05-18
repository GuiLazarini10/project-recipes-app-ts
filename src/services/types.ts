export interface Recipe {
  id: string;
  strMeal?: string;
  strDrink?: string;
  strCategory?: string;
  strAlcoholic?: string;
  strMealThumb?: string;
  strDrinkThumb?: string;
  strInstructions?: string;
  strYoutube?: string;
  strArea?: string;
  [key: string]: string | undefined;
}

export interface FavoriteRecipe {
  id: string;
  type: 'meal' | 'drink';
  nationality: string;
  category: string;
  alcoholicOrNot: string;
  name: string;
  image: string;
}
