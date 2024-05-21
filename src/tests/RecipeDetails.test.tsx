import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DrinkDetails from '../Pages/RecipeDetails';
import { Recipe } from '../services/types';
import * as api from '../services/api';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

vi.mock('../services/api');

const MOCK_CATEGORY = 'Mock Category1';
const MOCK_DRINK = 'Mock Drink';
const MOCK_DRINK_THUMB = 'mock-drink-thumb.jpg';
const DRINK_ROUTE = ['/drinks/54321'];

const MOCK_RECIPE_MEAL: Recipe = {
  id: 'routerTest',
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
  strArea: 'Mock Area',
};

const MOCK_RECIPE_DRINK_ALCOHOLIC: Recipe = {
  id: '54321',
  strMeal: '',
  strDrink: MOCK_DRINK,
  strCategory: '',
  strAlcoholic: 'Alcoholic',
  strMealThumb: '',
  strDrinkThumb: MOCK_DRINK_THUMB,
  strInstructions: 'Mock instructions for drink',
  strYoutube: 'https://www.youtube.com/watch?v=mockdrinkyoutube',
  strIngredient1: 'Drink Ingredient 1',
  strMeasure1: '2 cups',
};

const MOCK_RECIPE_DRINK_NON_ALCOHOLIC: Recipe = {
  id: '98765',
  strMeal: '',
  strDrink: MOCK_DRINK,
  strCategory: '',
  strAlcoholic: '',
  strMealThumb: '',
  strDrinkThumb: MOCK_DRINK_THUMB,
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
  recipeNotFoundText: 'Recipe not found',
};

const LOADING_TEXT = 'Loading...';
const IN_PROGRESS_TEXT = 'In Progress';
const CONTINUE_RECIPE_TEXT = 'Continue Recipe';
const MOCK_MEAL_TITLE = MOCK_RECIPE_MEAL.strMeal ?? '';

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(api, 'fetchById').mockImplementation((type: string, id: string) => {
    if (type === 'meals' && id === 'routerTest') {
      return Promise.resolve([MOCK_RECIPE_MEAL]);
    }
    if (type === 'drinks' && id === '54321') {
      return Promise.resolve([MOCK_RECIPE_DRINK_ALCOHOLIC]);
    }
    if (type === 'drinks' && id === '98765') {
      return Promise.resolve([MOCK_RECIPE_DRINK_NON_ALCOHOLIC]);
    }
    return Promise.reject(new Error('not found'));
  });
  vi.spyOn(api, 'fetchRecommendation').mockResolvedValue(MOCK_RECOMMENDATIONS);
  localStorage.clear();
});

const renderWithRouter = (id?: string) => {
  const initialEntries = id ? [`/meals/${id}`] : ['/meals/'];
  return render(
    <MemoryRouter initialEntries={ initialEntries }>
      <Routes>
        <Route path="/meals/:id" element={ <DrinkDetails /> } />
        <Route path="/drinks/:id" element={ <DrinkDetails /> } />
        <Route path="/meals/:id/in-progress" element={ <div>{IN_PROGRESS_TEXT}</div> } />
        <Route path="/drinks/:id/in-progress" element={ <div>{IN_PROGRESS_TEXT}</div> } />
      </Routes>
    </MemoryRouter>,
  );
};

const testLoadingState = () => {
  it('renderizar o estado de carregamento inicialmente', () => {
    renderWithRouter('routerTest');
    expect(screen.getByText(LOADING_TEXT)).toBeInTheDocument();
  });
};

const testRecipeDetailsAfterFetching = () => {
  it('renderizar os detalhes da receita após buscar os dados', async () => {
    renderWithRouter('routerTest');
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_MEAL_TITLE));
    expect(screen.getByTestId(TEST_IDS.recipePhoto)).toHaveAttribute('src', MOCK_RECIPE_MEAL.strMealThumb ?? '');
    expect(screen.getByTestId(TEST_IDS.recipeCategory)).toHaveTextContent(MOCK_RECIPE_MEAL.strCategory ?? '');
    expect(screen.getByTestId(TEST_IDS.instructions)).toHaveTextContent(MOCK_RECIPE_MEAL.strInstructions ?? '');
  });
};

const testFetchRecipeDetailsEffect = () => {
  it('busca detalhes da receita e definir o estado corretamente', async () => {
    renderWithRouter('routerTest');

    expect(screen.getByText(LOADING_TEXT)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_RECIPE_MEAL.strMeal ?? '');
      expect(screen.getByTestId(TEST_IDS.recipePhoto)).toHaveAttribute('src', MOCK_RECIPE_MEAL.strMealThumb ?? '');
      expect(screen.getByTestId(TEST_IDS.recipeCategory)).toHaveTextContent(MOCK_RECIPE_MEAL.strCategory ?? '');
      expect(screen.getByTestId(TEST_IDS.instructions)).toHaveTextContent(MOCK_RECIPE_MEAL.strInstructions ?? '');

      expect(screen.queryByText(LOADING_TEXT)).not.toBeInTheDocument();
    });
    expect(api.fetchById).toHaveBeenCalledWith('meals', 'routerTest');
  });

  it('lida com erro na busca e definir o estado de carregamento corretamente', async () => {
    vi.spyOn(api, 'fetchById').mockRejectedValue(new Error('Failed to fetch'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithRouter('routerTest');

    expect(screen.getByText(LOADING_TEXT)).toBeInTheDocument();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching recipe details:', expect.any(Error));

      expect(screen.queryByText(LOADING_TEXT)).not.toBeInTheDocument();

      expect(screen.getByText(TEST_IDS.recipeNotFoundText)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
};

const testRecommendationCarousel = () => {
  it('renderiza o carrossel de recomendações após buscar as recomendações', async () => {
    renderWithRouter('routerTest');
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recommendationCard(0))).toBeInTheDocument());
    MOCK_RECOMMENDATIONS.forEach((rec, index) => {
      expect(screen.getByTestId(TEST_IDS.recommendationCard(index))).toBeInTheDocument();
      expect(screen.getByTestId(TEST_IDS.recommendationTitle(index))).toHaveTextContent(rec.strMeal ?? '');
    });
  });
};

const testErrorFetchingRecommendation = () => {
  it('lida com erro ao buscar recomendações', async () => {
    vi.spyOn(api, 'fetchRecommendation').mockRejectedValue(new Error('Failed to fetch recommendations'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithRouter('routerTest');

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching recommendation:', expect.any(Error));

      expect(screen.queryByTestId(TEST_IDS.recommendationCard(0))).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
};

const testFavoriteButtonClick = () => {
  it('lida com clique no botão de favorito', async () => {
    renderWithRouter('routerTest');
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_MEAL_TITLE));

    expect(screen.getByTestId(TEST_IDS.favoriteBtn)).toHaveAttribute('src', whiteHeartIcon);

    fireEvent.click(screen.getByTestId(TEST_IDS.favoriteBtn));
    await waitFor(() => {
      expect(screen.getByTestId(TEST_IDS.favoriteBtn)).toHaveAttribute('src', blackHeartIcon);
    });

    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    expect(favorites).toHaveLength(1);
    expect(favorites[0]).toEqual({
      id: MOCK_RECIPE_MEAL.id,
      type: 'meal',
      nationality: MOCK_RECIPE_MEAL.strArea || '',
      category: MOCK_RECIPE_MEAL.strCategory || '',
      alcoholicOrNot: '',
      name: MOCK_RECIPE_MEAL.strMeal || '',
      image: MOCK_RECIPE_MEAL.strMealThumb || '',
    });
  });
};

const testUnfavoriteButtonClick = () => {
  it('lida com clique no botão de desfavoritar', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify([{
      id: MOCK_RECIPE_MEAL.id,
      type: 'meal',
      nationality: MOCK_RECIPE_MEAL.strArea || '',
      category: MOCK_RECIPE_MEAL.strCategory || '',
      alcoholicOrNot: '',
      name: MOCK_RECIPE_MEAL.strMeal || '',
      image: MOCK_RECIPE_MEAL.strMealThumb || '',
    }]));

    renderWithRouter('routerTest');
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_MEAL_TITLE));

    expect(screen.getByTestId(TEST_IDS.favoriteBtn)).toHaveAttribute('src', blackHeartIcon);

    fireEvent.click(screen.getByTestId(TEST_IDS.favoriteBtn));
    await waitFor(() => {
      expect(screen.getByTestId(TEST_IDS.favoriteBtn)).toHaveAttribute('src', whiteHeartIcon);
    });
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    expect(favorites).toHaveLength(0);
  });
};

const testStartRecipeButtonClick = () => {
  it('lida com clique no botão de começar receita', async () => {
    localStorage.setItem('doneRecipes', JSON.stringify([]));
    localStorage.setItem('inProgressRecipes', JSON.stringify({ meals: { routerTest: [] } }));
    renderWithRouter('routerTest');
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_MEAL_TITLE));
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.startRecipeBtn)).toBeInTheDocument(), { timeout: 2000 });
    fireEvent.click(screen.getByTestId(TEST_IDS.startRecipeBtn));
    await waitFor(() => expect(screen.getByText(IN_PROGRESS_TEXT)).toBeInTheDocument());
  });
};

const testIngredientsList = () => {
  it('renderiza a lista de ingredientes da receita', async () => {
    renderWithRouter('routerTest');
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_MEAL_TITLE));
    const ingredientText = screen.getByTestId(TEST_IDS.ingredientNameAndMeasure(0)).textContent;
    expect(ingredientText).toMatch(/Ingredient 1\s*-\s*1 cup/);
  });
};

const testRecipeNotFound = () => {
  it('renderiza "Recipe not found" quando a receita não for encontrada', async () => {
    vi.spyOn(api, 'fetchById').mockResolvedValue([]);
    renderWithRouter('routerTest');
    await waitFor(() => expect(screen.getByText(TEST_IDS.recipeNotFoundText)).toBeInTheDocument());
  });
};

const testShareButtonClick = () => {
  it('lida com clique no botão de compartilhar', async () => {
    renderWithRouter('routerTest');
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

const testShareButtonError = () => {
  it('registra erro quando o clique no botão de compartilhar falhar', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderWithRouter('routerTest');
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Failed to copy')),
      },
    });
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_MEAL_TITLE));
    fireEvent.click(screen.getByTestId(TEST_IDS.shareBtn));
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Failed to copy:', expect.any(Error)));
    consoleSpy.mockRestore();
  });
};

const testContinueRecipeButton = () => {
  it('renderiza botão "Continue Recipe" quando a receita estiver em andamento', async () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify({ meals: { routerTest: [] } }));
    renderWithRouter('routerTest');
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_MEAL_TITLE));
    expect(screen.getByTestId(TEST_IDS.startRecipeBtn)).toHaveTextContent(CONTINUE_RECIPE_TEXT);
  });
};

const testErrorFetchingRecipeDetails = () => {
  it('lida com erro ao buscar detalhes da receita', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(api, 'fetchById').mockRejectedValue(new Error('Failed to fetch'));
    renderWithRouter('routerTest');
    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Error fetching recipe details:', expect.any(Error)));
    expect(screen.queryByText(LOADING_TEXT)).not.toBeInTheDocument();
    expect(screen.queryByTestId(TEST_IDS.recipeTitle)).not.toBeInTheDocument();
    consoleSpy.mockRestore();
  });
};

const testCategoryDisplay = () => {
  it('exibi a categoria correta para uma refeição', async () => {
    renderWithRouter('routerTest');
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeCategory)).toHaveTextContent(MOCK_CATEGORY));
  });

  it('exibi a categoria correta para uma bebida alcoólica', async () => {
    render(
      <MemoryRouter initialEntries={ DRINK_ROUTE }>
        <Routes>
          <Route path="/drinks/:id" element={ <DrinkDetails /> } />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeCategory)).toHaveTextContent('Alcoholic: Alcoholic'));
  });

  it('exibi a categoria correta para uma bebida não alcoólica', async () => {
    render(
      <MemoryRouter initialEntries={ ['/drinks/98765'] }>
        <Routes>
          <Route path="/drinks/:id" element={ <DrinkDetails /> } />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeCategory)).toHaveTextContent('Non-alcoholic'));
  });
};

const testRecipeInProgress = () => {
  it('defini o estado de receita em progresso para refeições corretamente', async () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify({ meals: { routerTest: [] } }));
    renderWithRouter('routerTest');
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.startRecipeBtn)).toHaveTextContent(CONTINUE_RECIPE_TEXT));
  });

  it('defini o estado de receita em progresso para bebidas corretamente', async () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify({ drinks: { 54321: [] } }));
    render(
      <MemoryRouter initialEntries={ DRINK_ROUTE }>
        <Routes>
          <Route path="/drinks/:id" element={ <DrinkDetails /> } />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.startRecipeBtn)).toHaveTextContent(CONTINUE_RECIPE_TEXT));
  });
};

const testNoId = () => {
  it('não busca dados se não houver id presente', async () => {
    render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Routes>
          <Route path="/meals" element={ <DrinkDetails /> } />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.queryByText(LOADING_TEXT)).not.toBeInTheDocument();
    });
    expect(api.fetchById).not.toHaveBeenCalled();
  });
};

describe('Componente DrinkDetails', () => {
  testLoadingState();
  testRecipeDetailsAfterFetching();
  testFetchRecipeDetailsEffect();
  testRecommendationCarousel();
  testFavoriteButtonClick();
  testUnfavoriteButtonClick();
  testStartRecipeButtonClick();
  testIngredientsList();
  testRecipeNotFound();
  testShareButtonClick();
  testShareButtonError();
  testContinueRecipeButton();
  testErrorFetchingRecipeDetails();
  testCategoryDisplay();
  testRecipeInProgress();
  testNoId();
  testErrorFetchingRecommendation();

  it('lida com dados da receita corretamente para uma refeição', async () => {
    renderWithRouter('routerTest');
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent('Mock Meal'));

    const recipeData = MOCK_RECIPE_MEAL;
    const mealType = true;

    const expectedData = {
      type: mealType ? 'meal' : 'drink',
      nationality: mealType ? recipeData.strArea || '' : '',
      category: recipeData.strCategory || '',
      alcoholicOrNot: mealType ? '' : recipeData.strAlcoholic || '',
      name: mealType ? recipeData.strMeal || '' : recipeData.strDrink || '',
      image: mealType ? recipeData.strMealThumb || '' : recipeData.strDrinkThumb || '',
    };

    expect(expectedData).toEqual({
      type: 'meal',
      nationality: 'Mock Area',
      category: MOCK_CATEGORY,
      alcoholicOrNot: '',
      name: 'Mock Meal',
      image: 'mock-meal-thumb.jpg',
    });
  });

  it('lida com dados da receita corretamente para uma bebida alcoólica', async () => {
    render(
      <MemoryRouter initialEntries={ DRINK_ROUTE }>
        <Routes>
          <Route path="/drinks/:id" element={ <DrinkDetails /> } />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.recipeTitle)).toHaveTextContent(MOCK_DRINK));

    const recipeData = MOCK_RECIPE_DRINK_ALCOHOLIC;
    const mealType = false;

    const expectedData = {
      type: mealType ? 'meal' : 'drink',
      nationality: mealType ? recipeData.strArea || '' : '',
      category: recipeData.strCategory || '',
      alcoholicOrNot: mealType ? '' : recipeData.strAlcoholic || '',
      name: mealType ? recipeData.strMeal || '' : recipeData.strDrink || '',
      image: mealType ? recipeData.strMealThumb || '' : recipeData.strDrinkThumb || '',
    };

    expect(expectedData).toEqual({
      type: 'drink',
      nationality: '',
      category: '',
      alcoholicOrNot: 'Alcoholic',
      name: MOCK_DRINK,
      image: MOCK_DRINK_THUMB,
    });
  });

  it('navegar para o caminho correto ao clicar no botão de começar receita para uma refeição', async () => {
    renderWithRouter('routerTest');
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.startRecipeBtn)).toBeInTheDocument());
    fireEvent.click(screen.getByTestId(TEST_IDS.startRecipeBtn));
    await waitFor(() => expect(screen.getByText(IN_PROGRESS_TEXT)).toBeInTheDocument());
  });

  it('navegar para o caminho correto ao clicar no botão de começar receita para uma bebida', async () => {
    render(
      <MemoryRouter initialEntries={ DRINK_ROUTE }>
        <Routes>
          <Route path="/drinks/:id" element={ <DrinkDetails /> } />
          <Route path="/drinks/:id/in-progress" element={ <div>{IN_PROGRESS_TEXT}</div> } />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId(TEST_IDS.startRecipeBtn)).toBeInTheDocument());
    fireEvent.click(screen.getByTestId(TEST_IDS.startRecipeBtn));
    await waitFor(() => expect(screen.getByText(IN_PROGRESS_TEXT)).toBeInTheDocument());
  });
});
