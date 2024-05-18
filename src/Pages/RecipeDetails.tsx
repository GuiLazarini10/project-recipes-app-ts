import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  getFavoriteRecipes,
  saveFavoriteRecipes,
  checkIfRecipeIsFavorited,
  createFavoriteRecipe,
} from '../services/favoriteUtils';
import RecipeDetailsView from './RecipeDetailsView';
import { Recipe } from '../services/types';

const LOADING_TEXT = 'Loading...';

async function fetchById(type: string, id: string): Promise<any> {
  const baseUrl = type === 'meals' ? 'https://www.themealdb.com/api/json/v1/1' : 'https://www.thecocktaildb.com/api/json/v1/1';
  const endpoint = `${baseUrl}/lookup.php?i=${id}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    return type === 'meals' ? data.meals : data.drinks;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw new Error('Failed to fetch recipe details');
  }
}

async function fetchRecommendation(isMeal: boolean): Promise<any> {
  const endpoint = isMeal
    ? 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='
    : 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    return isMeal ? data.drinks : data.meals;
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    throw new Error('Failed to fetch recommendation');
  }
}

function RecipeDetails() {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const isMeal = location.pathname.includes('meals');
  const [loading, setLoading] = useState<boolean>(true);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recommendations, setRecommendations] = useState<Recipe[]>([]);
  const [recipeAlreadyDone, setRecipeAlreadyDone] = useState<boolean>(false);
  const [recipeInProgress, setRecipeInProgress] = useState<boolean>(false);
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
      const inProgress = isMeal
        ? inProgressRecipes.meals && inProgressRecipes.meals[id]
        : inProgressRecipes.drinks && inProgressRecipes.drinks[id];
      setRecipeInProgress(!!inProgress);

      const favorites = getFavoriteRecipes();
      setIsFavorited(checkIfRecipeIsFavorited(favorites, id));
    }
  }, [id, isMeal]);

  const handleStartRecipe = () => {
    if (id) {
      const path = isMeal ? `/meals/${id}/in-progress` : `/drinks/${id}/in-progress`;
      navigate(path);
    }
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

  if (loading) {
    return <div>{LOADING_TEXT}</div>;
  }

  let category = '';
  if (recipe) {
    if (isMeal) {
      category = recipe.strCategory || '';
    } else {
      category = `Alcoholic: ${recipe.strAlcoholic || ''}`;
    }
  }

  return (
    <RecipeDetailsView
      recipe={ recipe }
      isMeal={ isMeal }
      category={ category }
      isFavorited={ isFavorited }
      handleFavoriteRecipe={ handleFavoriteRecipe }
      handleStartRecipe={ handleStartRecipe }
      recommendations={ recommendations }
      recipeAlreadyDone={ recipeAlreadyDone }
      recipeInProgress={ recipeInProgress }
    />
  );
}

export default RecipeDetails;
