import React, { useState } from 'react';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import { Recipe } from '../services/types';
import RecommendationCarousel from './RecommendationCarousel'; // Importa o componente

interface RecipeDetailsViewProps {
  recipe: Recipe | null;
  isMeal: boolean;
  category: string;
  isFavorited: boolean;
  handleFavoriteRecipe: () => void;
  handleStartRecipe: () => void;
  recommendations: Recipe[];
  recipeAlreadyDone: boolean;
  recipeInProgress: boolean;
}

const LINK_COPIED_TEXT = 'Link copied!';

function RecipeDetailsView({
  recipe,
  isMeal,
  category,
  isFavorited,
  handleFavoriteRecipe,
  handleStartRecipe,
  recommendations,
  recipeAlreadyDone,
  recipeInProgress,
}: RecipeDetailsViewProps) {
  const [copySuccess, setCopySuccess] = useState<string>('');

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(LINK_COPIED_TEXT);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const favoriteIconSrc = isFavorited ? blackHeartIcon : whiteHeartIcon;

  return (
    <div>
      {recipe ? (
        <div>
          <img
            src={ isMeal ? recipe.strMealThumb : recipe.strDrinkThumb }
            alt="Recipe"
            data-testid="recipe-photo"
          />
          <h2 data-testid="recipe-title">{isMeal ? recipe.strMeal : recipe.strDrink}</h2>
          <p data-testid="recipe-category">{category}</p>
          <button data-testid="share-btn" onClick={ handleShare }>
            Share
          </button>
          {copySuccess && <div>{copySuccess}</div>}
          <input
            type="image"
            src={ favoriteIconSrc }
            alt="Favoritar"
            data-testid="favorite-btn"
            onClick={ handleFavoriteRecipe }
          />
          <h3>Ingredients:</h3>
          <ul>
            {Object.keys(recipe)
              .filter((key) => key.includes('strIngredient') && recipe[key])
              .map((key, index) => (
                <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
                  {recipe[key as keyof Recipe]}
                  {' '}
                  -
                  {recipe[`strMeasure${index + 1}` as keyof Recipe]}
                </li>
              ))}
          </ul>
          <p data-testid="instructions">{recipe.strInstructions}</p>
          {isMeal && recipe.strYoutube && (
            <iframe
              title="YouTube Video"
              src={ `https://www.youtube.com/embed/${recipe.strYoutube.split('=')[1]}` }
              data-testid="video"
            />
          )}
        </div>
      ) : (
        <div>RECIPE_NOT_FOUND_TEXT</div>
      )}

      {!recipeAlreadyDone && (
        <button
          type="button"
          style={ { position: 'fixed', bottom: '0', width: '100%', zIndex: '1000' } }
          data-testid="start-recipe-btn"
          onClick={ handleStartRecipe }
        >
          {recipeInProgress ? 'Continue Recipe' : 'Start Recipe'}
        </button>
      )}

      <RecommendationCarousel recommendations={ recommendations } />
      {' '}

    </div>
  );
}

export default RecipeDetailsView;
