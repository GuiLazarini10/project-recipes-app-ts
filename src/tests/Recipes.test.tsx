// src/components/RecipeCards.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import RecipeCards from '../components/Recipes'; // Corrigir importação

// Mock data
const mockMeals = [
  {
    idMeal: '52977',
    strMeal: 'Corba',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
  },
  {
    idMeal: '52978',
    strMeal: 'Very Long Meal Name That Exceeds Usual Length',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/58oia61564916530.jpg',
  },
];

const mockDrinks = [
  {
    idDrink: '17222',
    strDrink: 'A1',
    strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/2x8thr1504816928.jpg',
  },
  {
    idDrink: '17223',
    strDrink: 'Another Drink',
    strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/2x8thr1504816929.jpg',
  },
];

// Mock fetch function
const mockFetch = (url: string) => {
  if (url.includes('themealdb')) {
    return Promise.resolve({
      json: () => Promise.resolve({ meals: mockMeals }),
    });
  } if (url.includes('thecocktaildb')) {
    return Promise.resolve({
      json: () => Promise.resolve({ drinks: mockDrinks }),
    });
  }
  return Promise.reject(new Error('Unknown API'));
};

describe('RecipeCards', () => {
  const renderComponent = (type: 'meals' | 'drinks' = 'meals', category = '') => {
    const history = createMemoryHistory();
    // Mocking fetch globally in the window object
    (window as any).fetch = mockFetch;
    return render(
      <Router navigator={ history } location={ history.location }>
        <RecipeCards type={ type } category={ category } />
      </Router>,
    );
  };

  const recipeCardTestId = '0-recipe-card';
  const cardImgTestId = '0-card-img';

  afterEach(() => {
    // Clear mock fetch
    (window as any).fetch = undefined;
  });

  test('renders without crashing', async () => {
    renderComponent('meals');
    expect(await screen.findByText('Corba')).toBeInTheDocument();
  });

  test('fetches and displays meals', async () => {
    renderComponent('meals');

    expect(await screen.findByText('Corba')).toBeInTheDocument();
    expect(screen.getByTestId(recipeCardTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cardImgTestId)).toHaveAttribute('src', mockMeals[0].strMealThumb);
  });

  test('fetches and displays drinks', async () => {
    renderComponent('drinks');

    expect(await screen.findByText('A1')).toBeInTheDocument();
    expect(screen.getByTestId(recipeCardTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cardImgTestId)).toHaveAttribute('src', mockDrinks[0].strDrinkThumb);
  });

  test('renders correctly with different type and category', async () => {
    renderComponent('drinks', 'Cocktail');

    expect(await screen.findByText('A1')).toBeInTheDocument();
  });

  test('fetches and displays meals with a different category', async () => {
    renderComponent('meals', 'Seafood');

    expect(await screen.findByText('Corba')).toBeInTheDocument();
    expect(screen.getByTestId(recipeCardTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cardImgTestId)).toHaveAttribute('src', mockMeals[0].strMealThumb);
  });

  test('renders long recipe names correctly', async () => {
    renderComponent('meals');

    expect(await screen.findByText('Very Long Meal Name That Exceeds Usual Length')).toBeInTheDocument();
  });

  test('renders images correctly', async () => {
    renderComponent('meals');

    expect(await screen.findByTestId(cardImgTestId)).toHaveAttribute('src', mockMeals[0].strMealThumb);
    expect(await screen.findByTestId('1-card-img')).toHaveAttribute('src', mockMeals[1].strMealThumb);
  });

  test('displays correct number of recipe cards', async () => {
    renderComponent('meals');

    expect(await screen.findAllByTestId(/-recipe-card/)).toHaveLength(mockMeals.length);
  });

  it('fetches and sets recipes data correctly', async () => {
    renderComponent('meals');
    await waitFor(() => {
      const cards = screen.getAllByTestId(/-recipe-card/);
      expect(cards).toHaveLength(mockMeals.length);
    });
  });

  // Armazena a implementação original para restauração posterior
  const originalFetch = global.fetch;
  const originalError = console.error;

  // Função para mockar o fetch que falha
  const mockFetchError = () => {
    global.fetch = () => Promise.reject(new Error('Failed to fetch'));
  };

  // Função para restaurar os mocks
  const restoreMocks = () => {
    global.fetch = originalFetch;
    console.error = originalError;
  };

  afterEach(() => {
    // Restaura as funções originais após cada teste
    restoreMocks();
  });

  it('deve registrar um erro quando o fetch falhar', async () => {
    // Mockando o console.error manualmente
    let errorMessage = '';
    console.error = (message) => { errorMessage = message; };

    // Mockando fetch para simular um erro
    mockFetchError();

    // Renderiza o componente com o tipo 'meals'
    render(<RecipeCards type="meals" />);

    // Aguarda a execução assíncrona
    await waitFor(() => expect(errorMessage).toContain('Failed to fetch recipes:'));
  });
});
