import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import SearchBar, { buildSearchUrl } from '../components/SearchBar';

// Definindo constantes para evitar duplicação de strings
const SEARCH_INPUT = 'search-input';
const INGREDIENT_SEARCH_RADIO = 'ingredient-search-radio';
const NAME_SEARCH_RADIO = 'name-search-radio';
const FIRST_LETTER_SEARCH_RADIO = 'first-letter-search-radio';
const EXEC_SEARCH_BTN = 'exec-search-btn';
const SEARCH_URL_DRINKS = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Vodka';
const SEARCH_URL_MEALS = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=Chicken';
const NO_RECIPES_ALERT = "Sorry, we haven't found any recipes for these filters";
const FIRST_LETTER_ALERT = 'Your search must have only 1 (one) character';
const MEAL1 = 'Meal1';
const DRINK1 = 'Drink1';
const CHICKEN = 'Chicken';
const VODKA = 'Vodka';

describe('SearchBar', () => {
  let originalFetch: typeof global.fetch;
  let originalConsoleError: typeof console.error;
  let originalAlert: typeof window.alert;

  beforeEach(() => {
    originalFetch = global.fetch;
    originalConsoleError = console.error;
    originalAlert = window.alert;

    // Mock do fetch manual
    global.fetch = async () => {
      throw new Error(NO_RECIPES_ALERT);
    };

    // Mock do console.error manual
    console.error = () => {
      /* noop */
    };

    // Mock do alert manual
    window.alert = () => {
      /* noop */
    };
  });

  afterEach(() => {
    global.fetch = originalFetch;
    console.error = originalConsoleError;
    window.alert = originalAlert;
  });

  it('deve renderizar o componente corretamente', () => {
    const history = createMemoryHistory();
    render(
      <Router navigator={ history } location={ history.location }>
        <SearchBar />
      </Router>,
    );
    expect(screen.getByTestId(SEARCH_INPUT)).toBeInTheDocument();
    expect(screen.getByTestId(INGREDIENT_SEARCH_RADIO)).toBeInTheDocument();
    expect(screen.getByTestId(NAME_SEARCH_RADIO)).toBeInTheDocument();
    expect(screen.getByTestId(FIRST_LETTER_SEARCH_RADIO)).toBeInTheDocument();
    expect(screen.getByTestId(EXEC_SEARCH_BTN)).toBeInTheDocument();
  });

  it('deve mudar a opção de busca', () => {
    const history = createMemoryHistory();
    render(
      <Router navigator={ history } location={ history.location }>
        <SearchBar />
      </Router>,
    );
    const nameRadio = screen.getByTestId(NAME_SEARCH_RADIO);
    fireEvent.click(nameRadio);
    expect(nameRadio).toBeChecked();
  });

  it('deve realizar uma busca por ingrediente', async () => {
    const mockData = { meals: [{ idMeal: '1', strMeal: MEAL1 }] };

    // Mock do fetch
    global.fetch = async (url) => {
      if (url === SEARCH_URL_MEALS) {
        return {
          ok: true,
          status: 200,
          json: async () => mockData,
        } as Response;
      }
      throw new Error(NO_RECIPES_ALERT);
    };

    const history = createMemoryHistory();
    render(
      <Router navigator={ history } location={ history.location }>
        <SearchBar />
      </Router>,
    );

    const input = screen.getByTestId(SEARCH_INPUT);
    fireEvent.change(input, { target: { value: CHICKEN } });

    const searchButton = screen.getByTestId(EXEC_SEARCH_BTN);
    fireEvent.click(searchButton);

    await waitFor(() => expect(screen.getByText(MEAL1)).toBeInTheDocument());
  });

  it('deve exibir um alerta quando nenhuma receita for encontrada', async () => {
    global.fetch = async () => Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({ meals: [] }),
    } as Response);

    let alertMessage = '';
    window.alert = (message) => {
      alertMessage = message;
    };

    const history = createMemoryHistory();
    render(
      <Router navigator={ history } location={ history.location }>
        <SearchBar />
      </Router>,
    );

    const input = screen.getByTestId(SEARCH_INPUT);
    fireEvent.change(input, { target: { value: 'NonExistentMeal' } });

    const searchButton = screen.getByTestId(EXEC_SEARCH_BTN);
    fireEvent.click(searchButton);

    await waitFor(() => expect(alertMessage).toBe(NO_RECIPES_ALERT));
  });

  it('deve redirecionar para a página de detalhes se apenas uma receita for encontrada', async () => {
    const mockData = { meals: [{ idMeal: '1', strMeal: MEAL1 }] };
    global.fetch = async () => Promise.resolve({
      ok: true,
      status: 200,
      json: async () => mockData,
    } as Response);

    const history = createMemoryHistory();
    render(
      <Router navigator={ history } location={ history.location }>
        <SearchBar />
      </Router>,
    );

    const input = screen.getByTestId(SEARCH_INPUT);
    fireEvent.change(input, { target: { value: MEAL1 } });

    const searchButton = screen.getByTestId(EXEC_SEARCH_BTN);
    fireEvent.click(searchButton);

    await waitFor(() => expect(history.location.pathname).toBe('/meals/1'));
  });

  it('deve exibir uma mensagem de erro quando o fetch falhar', async () => {
    global.fetch = async () => {
      throw new Error('Error: Failed to fetch');
    };

    let consoleErrorMessage = '';
    const originalConsoleErrorTest = console.error;
    console.error = (message) => {
      consoleErrorMessage = message;
    };

    const history = createMemoryHistory();
    render(
      <Router navigator={ history } location={ history.location }>
        <SearchBar />
      </Router>,
    );

    const input = screen.getByTestId(SEARCH_INPUT);
    fireEvent.change(input, { target: { value: CHICKEN } });

    const searchButton = screen.getByTestId(EXEC_SEARCH_BTN);
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(consoleErrorMessage).toBe('Error fetching data:');
    });

    // Restaurar o console.error original
    console.error = originalConsoleErrorTest;
  });

  it('deve exibir um alerta se a busca por first-letter tiver mais de um caractere', async () => {
    const history = createMemoryHistory();
    render(
      <Router navigator={ history } location={ history.location }>
        <SearchBar />
      </Router>,
    );

    let alertMessage = '';
    window.alert = (message) => {
      alertMessage = message;
    };

    const firstLetterRadio = screen.getByTestId(FIRST_LETTER_SEARCH_RADIO);
    fireEvent.click(firstLetterRadio);
    expect(firstLetterRadio).toBeChecked();

    const input = screen.getByTestId(SEARCH_INPUT);
    fireEvent.change(input, { target: { value: 'AB' } });

    const searchButton = screen.getByTestId(EXEC_SEARCH_BTN);
    fireEvent.click(searchButton);

    await waitFor(() => expect(alertMessage).toBe(FIRST_LETTER_ALERT));
  });

  it('deve realizar uma busca por nome', async () => {
    const mockData = { meals: [{ idMeal: '1', strMeal: MEAL1 }] };

    global.fetch = async (url) => {
      if (url === 'https://www.themealdb.com/api/json/v1/1/search.php?s=Meal1') {
        return {
          ok: true,
          status: 200,
          json: async () => mockData,
        } as Response;
      }
      throw new Error('fetch not mocked');
    };

    const history = createMemoryHistory();
    render(
      <Router navigator={ history } location={ history.location }>
        <SearchBar />
      </Router>,
    );

    const nameRadio = screen.getByTestId(NAME_SEARCH_RADIO);
    fireEvent.click(nameRadio);
    expect(nameRadio).toBeChecked();

    const input = screen.getByTestId(SEARCH_INPUT);
    fireEvent.change(input, { target: { value: MEAL1 } });

    const searchButton = screen.getByTestId(EXEC_SEARCH_BTN);
    fireEvent.click(searchButton);

    await waitFor(() => expect(screen.getByText(MEAL1)).toBeInTheDocument());
  });

  it('deve construir a URL correta com base na opção de busca para drinks', async () => {
    let fetchUrl = '';
    global.fetch = async (url) => {
      fetchUrl = url as string;
      return {
        ok: true,
        status: 200,
        json: async () => ({ drinks: [{ idDrink: '1', strDrink: 'Long Vodka' }] }),
      } as Response;
    };

    // Mock manual do location.pathname
    const originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = { ...originalLocation, pathname: '/drinks' };

    const history = createMemoryHistory();
    render(
      <Router navigator={ history } location={ history.location }>
        <SearchBar />
      </Router>,
    );

    const input = screen.getByTestId(SEARCH_INPUT);
    fireEvent.change(input, { target: { value: VODKA } });

    const ingredientRadio = screen.getByTestId(INGREDIENT_SEARCH_RADIO);
    fireEvent.click(ingredientRadio);

    const searchButton = screen.getByTestId(EXEC_SEARCH_BTN);
    fireEvent.click(searchButton);

    await waitFor(() => expect(fetchUrl).toBe(SEARCH_URL_DRINKS));
    await waitFor(() => expect(screen.getByText('Long Vodka')).toBeInTheDocument());

    // Restaurar o location original
    window.location = originalLocation;
  });

  // Novo teste para cobrir a linha 83 (definindo os resultados da pesquisa)
  it('deve definir os resultados da pesquisa corretamente quando a API retorna dados', async () => {
    const mockData = { meals: [{ idMeal: '1', strMeal: MEAL1 }] };

    global.fetch = async (url) => {
      if (url === SEARCH_URL_MEALS) {
        return {
          ok: true,
          status: 200,
          json: async () => mockData,
        } as Response;
      }
      throw new Error(NO_RECIPES_ALERT);
    };

    const history = createMemoryHistory();
    render(
      <Router navigator={ history } location={ history.location }>
        <SearchBar />
      </Router>,
    );

    const input = screen.getByTestId(SEARCH_INPUT);
    fireEvent.change(input, { target: { value: CHICKEN } });

    const searchButton = screen.getByTestId(EXEC_SEARCH_BTN);
    fireEvent.click(searchButton);

    await waitFor(() => expect(screen.getByText(MEAL1)).toBeInTheDocument());
    await waitFor(() => {
      const results = screen.getAllByRole('listitem');
      expect(results).toHaveLength(1);
    });
  });

  // Novo teste para cobrir a linha 85 (redirecionamento para detalhes da receita)
  it('deve redirecionar para a tela de detalhes da receita se apenas uma receita for encontrada para drinks', async () => {
    const mockData = { drinks: [{ idDrink: '1', strDrink: DRINK1 }] };
    global.fetch = async () => Promise.resolve({
      ok: true,
      status: 200,
      json: async () => mockData,
    } as Response);

    // Mock manual do location.pathname
    const originalLocation = window.location;
    delete (window as any).location;
    (window as any).location = { ...originalLocation, pathname: '/drinks' };

    const history = createMemoryHistory();
    render(
      <Router navigator={ history } location={ history.location }>
        <SearchBar />
      </Router>,
    );

    const input = screen.getByTestId(SEARCH_INPUT);
    fireEvent.change(input, { target: { value: DRINK1 } });

    const searchButton = screen.getByTestId(EXEC_SEARCH_BTN);
    fireEvent.click(searchButton);

    await waitFor(() => expect(history.location.pathname).toBe('/drinks/1'));

    // Restaurar o location original
    window.location = originalLocation;
  });
  it('deve retornar uma URL vazia se a opção de busca for inválida', () => {
    const url = buildSearchUrl('invalid-option', 'test', SEARCH_URL_MEALS);
    expect(url).toBe('');
  });
});
