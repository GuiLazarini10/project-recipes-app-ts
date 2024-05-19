// src/Pages/RecipeInProgress.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';

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
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [copyMessage, setCopyMessage] = useState<string>('');

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

      // Load favorite state from localStorage
      const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
      const isFavoriteRecipe = favoriteRecipes.some((fav: any) => fav.id === id);
      setIsFavorite(isFavoriteRecipe);
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

  const handleShare = () => {
    const url = window.location.href.replace('/in-progress', '');
    navigator.clipboard.writeText(url);
    setCopyMessage('Link copied!');
    setTimeout(() => setCopyMessage(''), 3000); // Clear message after 3 seconds
  };

  const handleFavorite = () => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    const newFavoriteRecipe = {
      id,
      type: isMeal ? 'meal' : 'drink',
      nationality: isMeal ? recipe?.strArea || '' : '',
      category: recipe?.strCategory || '',
      alcoholicOrNot: isMeal ? '' : recipe?.strAlcoholic || '',
      name: isMeal ? recipe?.strMeal : recipe?.strDrink,
      image: isMeal ? recipe?.strMealThumb : recipe?.strDrinkThumb,
    };

    if (isFavorite) {
      const updatedFavorites = favoriteRecipes.filter((fav: any) => fav.id !== id);
      localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
    } else {
      favoriteRecipes.push(newFavoriteRecipe);
      localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
    }
    setIsFavorite(!isFavorite);
  };

  const allIngredientsChecked = Object.keys(recipe || {})
    .filter((key) => key.includes('strIngredient') && recipe?.[key])
    .every((ingredient) => checkedIngredients.includes(recipe?.[ingredient]));

  if (!recipe) return <div>Loading...</div>;

  return (
    <div>
      <img
        src={ isMeal ? recipe.strMealThumb : recipe.strDrinkThumb }
        alt="Recipe"
        data-testid="recipe-photo"
      />
      <h1 data-testid="recipe-title">{isMeal ? recipe.strMeal : recipe.strDrink}</h1>
      <button data-testid="share-btn" onClick={ handleShare }>
        <img src={ shareIcon } alt="Share" />
      </button>
      {copyMessage && <span>{copyMessage}</span>}
      <input
        type="image"
        src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
        alt="Favorite Icon"
        data-testid="favorite-btn"
        onClick={ handleFavorite }
      />
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
      <button
        data-testid="finish-recipe-btn"
        disabled={ !allIngredientsChecked }
        style={ {
          position: 'fixed',
          bottom: '0',
          width: '100%',
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '15px 0',
          border: 'none',
          textAlign: 'center',
        } }
      >
        Finish Recipe
      </button>
    </div>
  );
}

export default RecipeInProgress;
