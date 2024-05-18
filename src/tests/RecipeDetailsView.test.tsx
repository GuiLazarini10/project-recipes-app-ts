import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import RecipeDetailsView from '../Pages/RecipeDetailsView';
import { Recipe } from '../services/types';

const MOCK_RECIPE_ID = '12345';
const MOCK_CATEGORY = 'Mock Category';
const LINK_COPIED_TEXT = 'Link copied!';

const MOCK_RECIPE_MEAL: Recipe = {
  id: MOCK_RECIPE_ID,
  strMeal: 'Mock Meal',
  strDrink: '',
  strCategory: MOCK_CATEGORY,
  strAlcoholic: '',
  strMealThumb: 'mock-meal-thumb.jpg',
  strDrinkThumb: '',
  strInstructions: 'Mock instructions',
  strYoutube: 'https://www.youtube.com/watch?v=mockyoutube',
  strIngredient1: 'Ingredient 1',
  strMeasure1: '1 cup',
};

const MOCK_RECIPE_DRINK: Recipe = {
  id: MOCK_RECIPE_ID,
  strMeal: '',
  strDrink: 'Mock Drink',
  strCategory: MOCK_CATEGORY,
  strAlcoholic: 'Alcoholic',
  strMealThumb: '',
  strDrinkThumb: 'mock-drink-thumb.jpg',
  strInstructions: 'Mock drink instructions',
  strYoutube: '',
  strIngredient1: 'Ingredient 1',
  strMeasure1: '1 cup',
};

const MOCK_RECOMMENDATIONS: Recipe[] = [
  {
    id: '54321',
    strMeal: 'Recommended Meal 1',
    strDrink: '',
    strMealThumb: 'recommended-meal-1-thumb.jpg',
    strDrinkThumb: '',
  },
  {
    id: '67890',
    strMeal: 'Recommended Meal 2',
    strDrink: '',
    strMealThumb: 'recommended-meal-2-thumb.jpg',
    strDrinkThumb: '',
  },
];

const renderWithProps = (overrides = {}) => {
  const handleFavoriteRecipe = vi.fn();
  const handleStartRecipe = vi.fn();

  const defaultProps = {
    recipe: MOCK_RECIPE_MEAL,
    isMeal: true,
    category: MOCK_CATEGORY,
    isFavorited: false,
    handleFavoriteRecipe,
    handleStartRecipe,
    recommendations: MOCK_RECOMMENDATIONS,
    recipeAlreadyDone: false,
    recipeInProgress: false,
    ...overrides,
  };

  render(<RecipeDetailsView { ...defaultProps } />);

  return {
    handleFavoriteRecipe,
    handleStartRecipe,
  };
};

const testRenderRecipeDetails = () => {
  it('should render the meal recipe details when isMeal is true', () => {
    renderWithProps();
    expect(screen.getByTestId('recipe-photo')).toHaveAttribute('src', MOCK_RECIPE_MEAL.strMealThumb || '');
    expect(screen.getByTestId('recipe-title')).toHaveTextContent(MOCK_RECIPE_MEAL.strMeal || '');
    expect(screen.getByTestId('recipe-category')).toHaveTextContent(MOCK_CATEGORY);
    expect(screen.getByTestId('instructions')).toHaveTextContent(MOCK_RECIPE_MEAL.strInstructions || '');
  });

  it('should render the drink recipe details when isMeal is false', () => {
    renderWithProps({ recipe: MOCK_RECIPE_DRINK, isMeal: false });
    expect(screen.getByTestId('recipe-photo')).toHaveAttribute('src', MOCK_RECIPE_DRINK.strDrinkThumb || '');
    expect(screen.getByTestId('recipe-title')).toHaveTextContent(MOCK_RECIPE_DRINK.strDrink || '');
    expect(screen.getByTestId('recipe-category')).toHaveTextContent(MOCK_CATEGORY);
    expect(screen.getByTestId('instructions')).toHaveTextContent(MOCK_RECIPE_DRINK.strInstructions || '');
  });
};

const testRenderIngredientsList = () => {
  it('should render the ingredients list', () => {
    renderWithProps();
    const ingredientText = screen.getByTestId('0-ingredient-name-and-measure').textContent;
    expect(ingredientText).toMatch(/Ingredient 1\s*-\s*1 cup/);
  });
};

const testRenderYouTubeVideo = () => {
  it('should render the YouTube video if it is a meal', () => {
    renderWithProps();
    expect(screen.getByTestId('video')).toHaveAttribute(
      'src',
      `https://www.youtube.com/embed/${MOCK_RECIPE_MEAL.strYoutube?.split('=')[1] || ''}`,
    );
  });
};

const testHandleShareButtonClick = () => {
  it('should call handleShare when share button is clicked and show "Link copied!" message', async () => {
    renderWithProps();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    fireEvent.click(screen.getByTestId('share-btn'));
    await waitFor(() => expect(screen.getByText(LINK_COPIED_TEXT)).toBeInTheDocument());
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
    await waitFor(() => expect(screen.queryByText(LINK_COPIED_TEXT)).not.toBeInTheDocument(), { timeout: 2500 });
  });

  it('should log an error when handleShare fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    renderWithProps();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Failed to copy')),
      },
    });
    fireEvent.click(screen.getByTestId('share-btn'));
    await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy:', expect.any(Error)));
  });
};

const testHandleFavoriteButtonClick = () => {
  it('should call handleFavoriteRecipe when favorite button is clicked', () => {
    const { handleFavoriteRecipe } = renderWithProps();
    fireEvent.click(screen.getByTestId('favorite-btn'));
    expect(handleFavoriteRecipe).toHaveBeenCalled();
  });
};

const testRenderStartRecipeButton = () => {
  it('should render the start recipe button and call handleStartRecipe when clicked', () => {
    const { handleStartRecipe } = renderWithProps();
    const startRecipeButton = screen.getByTestId('start-recipe-btn');
    expect(startRecipeButton).toBeInTheDocument();
    fireEvent.click(startRecipeButton);
    expect(handleStartRecipe).toHaveBeenCalled();
  });
};

const testRenderContinueRecipeButton = () => {
  it('should render the continue recipe button when recipe is in progress', () => {
    const { handleStartRecipe } = renderWithProps({ recipeInProgress: true });
    const startRecipeButton = screen.getByTestId('start-recipe-btn');
    expect(startRecipeButton).toBeInTheDocument();
    expect(startRecipeButton).toHaveTextContent('Continue Recipe');
    fireEvent.click(startRecipeButton);
    expect(handleStartRecipe).toHaveBeenCalled();
  });
};

const testRenderNotFoundRecipe = () => {
  it('should render recipe not found when recipe is null', () => {
    renderWithProps({ recipe: null });
    expect(screen.getByText('RECIPE_NOT_FOUND_TEXT')).toBeInTheDocument();
  });
};

const testRenderRecommendationCarousel = () => {
  it('should render recommendation carousel', () => {
    renderWithProps();
    MOCK_RECOMMENDATIONS.forEach((recommendation, index) => {
      expect(screen.getByTestId(`${index}-recommendation-card`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-recommendation-title`)).toHaveTextContent(recommendation.strMeal || '');
    });
  });
};

describe('RecipeDetailsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  testRenderRecipeDetails();
  testRenderIngredientsList();
  testRenderYouTubeVideo();
  testHandleShareButtonClick();
  testHandleFavoriteButtonClick();
  testRenderStartRecipeButton();
  testRenderContinueRecipeButton();
  testRenderNotFoundRecipe();
  testRenderRecommendationCarousel();
});
