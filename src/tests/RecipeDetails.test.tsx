import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RecipeDetails from '../Pages/RecipeDetails';
import { Recipe, FavoriteRecipe } from '../services/types';
import * as favoriteUtils from '../services/favoriteUtils';

vi.mock('../services/favoriteUtils');

const MOCK_RECIPE_MEAL: Recipe = {
  id: '12345',
  strMeal: 'Mock Meal',
  strDrink: '',
  strCategory: 'Mock Category1',
  strAlcoholic: '',
  strMealThumb: 'mock-meal-thumb.jpg',
  strDrinkThumb: '',
  strInstructions: 'Mock instructions',
  strYoutube: 'https://www.youtube.com/watch?v=mockyoutube',
  strIngredient1: 'Ingredient 1',
  strMeasure1: '1 cup',
};

const MOCK_RECIPE_DRINK: Recipe = {
  id: '54321',
  strMeal: '',
  strDrink: 'Mock Drink',
  strCategory: '',
  strAlcoholic: 'Alcoholic',
  strMealThumb: '',
  strDrinkThumb: 'mock-drink-thumb.jpg',
  strInstructions: 'Mock instructions for drink',
  strYoutube: 'https://www.youtube.com/watch?v=mockdrinkyoutube',
  strIngredient1: 'Drink Ingredient 1',
  strMeasure1: '2 cups',
};

const MOCK_RECOMMENDATIONS: Recipe[] = [
  {
    id: '67890',
    strMeal: 'Recommended Meal 1',
    strDrink: '',
    strMealThumb: 'recommended-meal-1-thumb.jpg',
    strDrinkThumb: '',
  },
  {
    id: '98765',
    strMeal: 'Recommended Meal 2',
    strDrink: '',
    strMealThumb: 'recommended-meal-2-thumb.jpg',
    strDrinkThumb: '',
  },
];

const MOCK_FAVORITE_RECIPE: FavoriteRecipe = {
  id: '12345',
  type: 'meal',
  nationality: '',
  category: 'Mock Category',
  alcoholicOrNot: '',
  name: 'Mock Meal',
  image: 'mock-meal-thumb.jpg',
};

const TEST_IDS = {
  recipeTitle: 'recipe-title',
  recipePhoto: 'recipe-photo',
  recipeCategory: 'recipe-category',
  instructions: 'instructions',
  favoriteBtn: 'favorite-btn',
  shareBtn: 'share-btn',
  startRecipeBtn: 'start-recipe-btn',
  recommendationCard: (index: number) => `${index}-recommendation-card`,
  recommendationTitle: (index: number) => `${index}-recommendation-title`,
  ingredientNameAndMeasure: (index: number) => `${index}-ingredient-name-and-measure`,
  recipeNotFoundText: 'RECIPE_NOT_FOUND_TEXT',
};

const CONTINUE_RECIPE_TEXT = 'Continue Recipe';
const MOCK_MEAL_TITLE = MOCK_RECIPE_MEAL.strMeal ?? '';

function mockResponse(data: any) {
  return {
    ok: true,
    status: 200,
    json: async () => data,
  } as Response;
}

beforeEach(() => {
  vi.resetAllMocks();
  global.fetch = vi.fn((url) => {
    if (typeof url === 'string' && url.includes('lookup.php')) {
      if (url.includes('12345')) {
        return Promise.resolve(mockResponse({ meals: [MOCK_RECIPE_MEAL], drinks: [] }));
      }
      if (url.includes('54321')) {
        return Promise.resolve(mockResponse({ meals: [], drinks: [MOCK_RECIPE_DRINK] }));
      }
    }
    if (typeof url === 'string' && url.includes('search.php')) {
      return Promise.resolve(mockResponse({ meals: MOCK_RECOMMENDATIONS, drinks: MOCK_RECOMMENDATIONS }));
    }
    return Promise.reject(new Error('not found'));
  });

  vi.mocked(favoriteUtils.getFavoriteRecipes).mockReturnValue([]);
  vi.mocked(favoriteUtils.checkIfRecipeIsFavorited).mockReturnValue(false);
  vi.mocked(favoriteUtils.saveFavoriteRecipes).mockImplementation(() => {});
  vi.mocked(favoriteUtils.createFavoriteRecipe).mockReturnValue(MOCK_FAVORITE_RECIPE);
});

const renderWithRouter = (id = '12345') => {
  return render(
    <MemoryRouter initialEntries={ [`/meals/${id}`] }>
      <Routes>
        <Route path="/meals/:id" element={ <RecipeDetails /> } />
        <Route path="/drinks/:id" element={ <RecipeDetails /> } />
      </Routes>
    </MemoryRouter>,
  );
};

const testLoadingState = () => {
  it('should render loading state initially', () => {
    renderWithRouter();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
};

const testRecipeDetailsAfterFetching = () => {
  it('should render the recipe details after fetching data', async () => {
    renderWithRouter();
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_MEAL_TITLE));
    expect(screen.getByTestId(TEST_IDS.recipePhoto)).toHaveAttribute('src', MOCK_RECIPE_MEAL.strMealThumb ?? '');
    expect(screen.getByTestId(TEST_IDS.recipeCategory)).toHaveTextContent(MOCK_RECIPE_MEAL.strCategory ?? '');
    expect(screen.getByTestId(TEST_IDS.instructions)).toHaveTextContent(MOCK_RECIPE_MEAL.strInstructions ?? '');
  });
};

const testRecommendationCarousel = () => {
  it('should render recommendation carousel after fetching recommendations', async () => {
    renderWithRouter();
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recommendationCard(0))).toBeInTheDocument());
    MOCK_RECOMMENDATIONS.forEach((rec, index) => {
      expect(screen.getByTestId(TEST_IDS.recommendationCard(index))).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.recommendationTitle(index))).toHaveTextContent(rec.strMeal ?? '');
    });
  });
};

const testFavoriteButtonClick = () => {
  it('should handle favorite button click', async () => {
    renderWithRouter();
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_MEAL_TITLE));
    fireEvent.click(screen.getByTestId(TEST_IDS.favoriteBtn));
    await waitFor(() => expect(favoriteUtils.saveFavoriteRecipes).toHaveBeenCalledTimes(1));
  });
};

const testUnfavoriteButtonClick = () => {
  it('should handle unfavorite button click', async () => {
    vi.mocked(favoriteUtils.getFavoriteRecipes).mockReturnValue([MOCK_FAVORITE_RECIPE]);
    vi.mocked(favoriteUtils.checkIfRecipeIsFavorited).mockReturnValue(true);

    renderWithRouter();
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_MEAL_TITLE));
    fireEvent.click(screen.getByTestId(TEST_IDS.favoriteBtn));
    await waitFor(() => expect(favoriteUtils.saveFavoriteRecipes).toHaveBeenCalledWith([]));
  });
};

const testStartRecipeButtonClick = () => {
  it('should handle start recipe button click', async () => {
    localStorage.setItem('doneRecipes', JSON.stringify([]));
    localStorage.setItem('inProgressRecipes', JSON.stringify({ meals: { 12345: [] } }));
    renderWithRouter();
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_MEAL_TITLE));
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.startRecipeBtn)).toBeInTheDocument(), { timeout: 2000 });
    fireEvent.click(screen.getByTestId(TEST_IDS.startRecipeBtn));
  });
};

const testIngredientsList = () => {
  it('should render the recipe ingredients list', async () => {
    renderWithRouter();
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_MEAL_TITLE));
    const ingredientText = screen.getByTestId(TEST_IDS.ingredientNameAndMeasure(0)).textContent;
    expect(ingredientText).toMatch(/Ingredient 1\s*-\s*1 cup/);
  });
};

const testRecipeNotFound = () => {
  it('should render recipe not found when recipe is not found', async () => {
    global.fetch = vi.fn(() => Promise.resolve(mockResponse({ meals: [], drinks: [] })));
    renderWithRouter();
    await waitFor(() => expect(screen.getByText(TEST_IDS.recipeNotFoundText)).toBeInTheDocument());
  });
};

const testShareButtonClick = () => {
  it('should handle share button click', async () => {
    renderWithRouter();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_MEAL_TITLE));
    fireEvent.click(screen.getByTestId(TEST_IDS.shareBtn));
    await waitFor(() => expect(screen.getByText('Link copied!')).toBeInTheDocument());
  });
};

const testContinueRecipeButton = () => {
  it('should render continue recipe button when recipe is in progress', async () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify({ meals: { 12345: [] } }));
    renderWithRouter();
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_MEAL_TITLE));
    expect(screen.getByTestId(TEST_IDS.startRecipeBtn)).toHaveTextContent(CONTINUE_RECIPE_TEXT);
  });
};

const testErrorFetchingRecipeDetails = () => {
  it('should handle error fetching recipe details', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn(() => Promise.reject(new Error('Failed to fetch')));
    renderWithRouter();
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Error fetching recipe details:', expect.any(Error)));
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.recipeTitle)).not.toBeInTheDocument();
    consoleSpy.mockRestore();
  });
};

const testCategoryDisplay = () => {
  it('should display the correct category for a meal', async () => {
    renderWithRouter('12345'); // Renderiza a página com a receita de refeição
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeCategory)).toHaveTextContent('Mock Category1'));
  });

  it('should display the correct category for a drink', async () => {
    render(
      <MemoryRouter initialEntries={ ['/drinks/54321'] }>
        <Routes>
          <Route path="/drinks/:id" element={ <RecipeDetails /> } />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeCategory)).toHaveTextContent('Alcoholic: Alcoholic'));
  });
};

const testRecipeInProgress = () => {
  it('should set recipe in progress state for meals correctly', async () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify({ meals: { 12345: [] } }));
    renderWithRouter('12345');
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.startRecipeBtn)).toHaveTextContent(CONTINUE_RECIPE_TEXT));
  });

  it('should set recipe in progress state for drinks correctly', async () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify({ drinks: { 54321: [] } }));
    render(
      <MemoryRouter initialEntries={ ['/drinks/54321'] }>
        <Routes>
          <Route path="/drinks/:id" element={ <RecipeDetails /> } />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.startRecipeBtn)).toHaveTextContent(CONTINUE_RECIPE_TEXT));
  });
};

describe('RecipeDetails Component', () => {
  testLoadingState();
  testRecipeDetailsAfterFetching();
  testRecommendationCarousel();
  testFavoriteButtonClick();
  testUnfavoriteButtonClick();
  testStartRecipeButtonClick();
  testIngredientsList();
  testRecipeNotFound();
  testShareButtonClick();
  testContinueRecipeButton();
  testErrorFetchingRecipeDetails();
  testCategoryDisplay();
  testRecipeInProgress();
});
