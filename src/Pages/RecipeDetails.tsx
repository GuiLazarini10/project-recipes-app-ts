import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { fetchById, fetchRecommendation } from '../services/api';
import RecommendationCarousel from './RecommendationCarousel';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

interface Recipe {
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

interface FavoriteRecipe {
  id: string;
  type: 'meal' | 'drink';
  nationality: string;
  category: string;
  alcoholicOrNot: string;
  name: string;
  image: string;
}
//
function DrinkDetails() {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const isMeal = location.pathname.includes('meals');
  const [loading, setLoading] = useState<boolean>(true);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recommendations, setRecommendations] = useState<Recipe[]>([]);
  const [recipeAlreadyDone, setRecipeAlreadyDone] = useState<boolean>(false);
  const [recipeInProgress, setRecipeInProgress] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const type = isMeal ? 'meals' : 'drinks';
        const data = await fetchById(type, id);
        setRecipe(data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isMeal]);

  useEffect(() => {
    const fetchRecommendationData = async () => {
      try {
        const data = await fetchRecommendation(isMeal);
        setRecommendations(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching recommendation:', error);
      }
    };

    fetchRecommendationData();
  }, [isMeal]);

  useEffect(() => {
    if (id) {
      const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes') || '[]');
      const recipeIndex = doneRecipes
        .findIndex((doneRecipe: Recipe) => doneRecipe.id === id);
      setRecipeAlreadyDone(recipeIndex !== -1);

      const inProgressRecipes = JSON
        .parse(localStorage.getItem('inProgressRecipes') || '{}');
      const inProgress = isMeal ? inProgressRecipes.meals && inProgressRecipes.meals[id]
        : inProgressRecipes.drinks && inProgressRecipes.drinks[id];
      setRecipeInProgress(!!inProgress);

      const favorites: FavoriteRecipe[] = JSON
        .parse(localStorage.getItem('favoriteRecipes') || '[]');
      setIsFavorited(favorites.some((favorite) => favorite.id === id));
    }
  }, [id, isMeal]);

  const handleStartRecipe = () => {
    if (id) {
      const path = isMeal ? `/meals/${id}/in-progress` : `/drinks/${id}/in-progress`;
      navigate(path);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess('Link copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getFavoriteRecipes = (): FavoriteRecipe[] => {
    return JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
  };

  const saveFavoriteRecipes = (favorites: FavoriteRecipe[]) => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
  };

  const checkIfRecipeIsFavorited = (favorites:
  FavoriteRecipe[], recipeId: string): boolean => {
    return favorites.some((favorite) => favorite.id === recipeId);
  };

  const createFavoriteRecipe = (
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

  const handleFavoriteRecipe = () => {
    if (id && recipe) {
      const favorites = getFavoriteRecipes();
      const recipeFavorited = checkIfRecipeIsFavorited(favorites, id);

      if (recipeFavorited) {
        const updatedFavorites = favorites.filter((favorite) => favorite.id !== id);
        saveFavoriteRecipes(updatedFavorites);
        setIsFavorited(false);
      } else {
        const newFavorite = createFavoriteRecipe(id, recipe, isMeal);
        const updatedFavorites = [...favorites, newFavorite];
        saveFavoriteRecipes(updatedFavorites);
        setIsFavorited(true);
      }
    }
  };

  useEffect(() => {
    if (id) {
      const favorites: FavoriteRecipe[] = getFavoriteRecipes();
      setIsFavorited(checkIfRecipeIsFavorited(favorites, id));
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  let category;
  if (isMeal) {
    category = recipe?.strCategory;
  } else if (recipe?.strAlcoholic) {
    category = `Alcoholic: ${recipe.strAlcoholic}`;
  } else {
    category = 'Non-alcoholic';
  }

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
                  {
                  recipe[`strMeasure${index + 1}` as keyof Recipe]
}
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
        <div>Recipe not found</div>
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
    </div>
  );
}

export default DrinkDetails;
