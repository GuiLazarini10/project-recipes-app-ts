import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Recipe {
  idMeal?: string;
  idDrink?: string;
  strMeal?: string;
  strDrink?: string;
  strCategory?: string;
  strAlcoholic?: string;
  strInstructions?: string;
  strMealThumb?: string;
  strDrinkThumb?: string;
  [key: string]: any;
}

function RecipeInProgress() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isMeal, setIsMeal] = useState<boolean>(true);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      const type = window.location.pathname.includes('meals') ? 'meals' : 'drinks';
      const baseUrl = type === 'meals'
        ? 'https://www.themealdb.com/api/json/v1/1/lookup.php?i='
        : 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';

      const response = await fetch(`${baseUrl}${id}`);
      const data = await response.json();
      setRecipe(type === 'meals' ? data.meals[0] : data.drinks[0]);
      setIsMeal(type === 'meals');

      // Load checked ingredients from localStorage
      const inProgressRecipes = JSON.parse(localStorage
        .getItem('inProgressRecipes') || '{}');
      const savedCheckedIngredients = inProgressRecipes[type]?.[id || ''] || [];
      setCheckedIngredients(savedCheckedIngredients);
    };

    fetchRecipe();
  }, [id]);

  const handleCheck = (ingredient: string) => {
    const updatedCheckedIngredients = checkedIngredients.includes(ingredient)
      ? checkedIngredients.filter((item) => item !== ingredient)
      : [...checkedIngredients, ingredient];

    setCheckedIngredients(updatedCheckedIngredients);

    // Save checked ingredients to localStorage
    const type = isMeal ? 'meals' : 'drinks';
    const inProgressRecipes = JSON.parse(localStorage
      .getItem('inProgressRecipes') || '{}');
    if (id) {
      localStorage.setItem(
        'inProgressRecipes',
        JSON.stringify({
          ...inProgressRecipes,
          [type]: {
            ...inProgressRecipes[type],
            [id]: updatedCheckedIngredients,
          },
        }),
      );
    } else {
      throw new Error('ID is undefined');
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <img
        src={ isMeal ? recipe.strMealThumb : recipe.strDrinkThumb }
        alt="Recipe"
        data-testid="recipe-photo"
      />
      <h1 data-testid="recipe-title">{isMeal ? recipe.strMeal : recipe.strDrink}</h1>
      <button data-testid="share-btn">Share</button>
      <button data-testid="favorite-btn">Favorite</button>
      <p data-testid="recipe-category">
        {isMeal ? recipe.strCategory : recipe.strAlcoholic}
      </p>
      <h3>Ingredients:</h3>
      <ul>
        {Object.keys(recipe)
          .filter((key) => key.includes('strIngredient') && recipe[key])
          .map((key, index) => (
            <li
              key={ index }
              data-testid={ `${index}-ingredient-step` }
              style={ {
                textDecoration: checkedIngredients.includes(recipe[key])
                  ? 'line-through solid rgb(0, 0, 0)'
                  : 'none',
              } }
            >
              <label>
                <input
                  type="checkbox"
                  checked={ checkedIngredients.includes(recipe[key]) }
                  onChange={ () => handleCheck(recipe[key]) }
                />
                {recipe[key]}
                {' '}
                -
                {recipe[`strMeasure${index + 1}`]}
              </label>
            </li>
          ))}
      </ul>
      <p data-testid="instructions">{recipe.strInstructions}</p>
      <button data-testid="finish-recipe-btn">Finish Recipe</button>
    </div>
  );
}

export default RecipeInProgress;
