import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DoneRecipes from '../Pages/DoneRecipes';

const doneRecipes = [
  {
    id: '52771',
    type: 'meal',
    nationality: 'Italian',
    category: 'Vegetarian',
    alcoholicOrNot: '',
    name: 'Spicy Arrabiata Penne',
    image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
    doneDate: '23/06/2020',
    tags: ['Pasta', 'Curry'],
  },
  {
    id: '178319',
    type: 'drink',
    nationality: '',
    category: 'Cocktail',
    alcoholicOrNot: 'Alcoholic',
    name: 'Aquamarine',
    image: 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
    doneDate: '23/06/2020',
    tags: [],
  },
];

const horizontalname0 = '0-horizontal-name';
const horizontalname1 = '1-horizontal-name';

describe('DoneRecipes Page', () => {
  beforeEach(() => {
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders done recipes with correct details for meals', () => {
    render(
      <MemoryRouter>
        <DoneRecipes />
      </MemoryRouter>,
    );

    const mealImage = screen.getByTestId('0-horizontal-image');
    const mealTopText = screen.getByTestId('0-horizontal-top-text');
    const mealName = screen.getByTestId(horizontalname0);
    const doneDate = screen.getByTestId('0-horizontal-done-date');
    const shareButton = screen.getByTestId('0-horizontal-share-btn');

    expect(mealImage).toHaveAttribute('src', doneRecipes[0].image);
    expect(mealTopText).toHaveTextContent(`${doneRecipes[0].nationality} - ${doneRecipes[0].category}`);
    expect(mealName).toHaveTextContent(doneRecipes[0].name);
    expect(doneDate).toHaveTextContent(doneRecipes[0].doneDate);
    expect(shareButton).toBeInTheDocument();
  });

  test('renders done recipes with correct details for drinks', () => {
    render(
      <MemoryRouter>
        <DoneRecipes />
      </MemoryRouter>,
    );

    const drinkImage = screen.getByTestId('1-horizontal-image');
    const drinkTopText = screen.getByTestId('1-horizontal-top-text');
    const drinkName = screen.getByTestId(horizontalname1);
    const doneDate = screen.getByTestId('1-horizontal-done-date');
    const shareButton = screen.getByTestId('1-horizontal-share-btn');

    expect(drinkImage).toHaveAttribute('src', doneRecipes[1].image);
    expect(drinkTopText).toHaveTextContent(doneRecipes[1].alcoholicOrNot);
    expect(drinkName).toHaveTextContent(doneRecipes[1].name);
    expect(doneDate).toHaveTextContent(doneRecipes[1].doneDate);
    expect(shareButton).toBeInTheDocument();
  });

  test('copies the link to clipboard when share button is clicked', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <DoneRecipes />
      </MemoryRouter>,
    );

    const mockClipboard = {
      writeText: (text: string) => {
        mockClipboard.text = text;
      },
      text: '',
    };
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });

    fireEvent.click(getByTestId('1-horizontal-share-btn'));
    expect(mockClipboard.text).toBe('http://localhost:3000/drinks/178319');
  });

  test('filters done recipes correctly', () => {
    render(
      <MemoryRouter>
        <DoneRecipes />
      </MemoryRouter>,
    );

    // Test filter by meals
    fireEvent.click(screen.getByTestId('filter-by-meal-btn'));
    expect(screen.queryByTestId(horizontalname0)).toHaveTextContent(doneRecipes[0].name);
    expect(screen.queryByTestId(horizontalname1)).toBeNull();

    // Test filter by all
    fireEvent.click(screen.getByTestId('filter-by-all-btn'));
    expect(screen.queryByTestId(horizontalname0)).toHaveTextContent(doneRecipes[0].name);
    expect(screen.queryByTestId(horizontalname1)).toHaveTextContent(doneRecipes[1].name);
  });

  test('navigates to recipe details on image click', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <DoneRecipes />
      </MemoryRouter>,
    );

    const link = getByTestId('0-horizontal-image').closest('a');
    expect(link).toHaveAttribute('href', '/meals/52771');
  });

  test('navigates to recipe details on name click', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <DoneRecipes />
      </MemoryRouter>,
    );

    const link = getByTestId(horizontalname1).closest('a');
    expect(link).toHaveAttribute('href', '/drinks/178319');
  });

  test('shows copy message when link is copied', async () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <DoneRecipes />
      </MemoryRouter>,
    );

    fireEvent.click(getByTestId('0-horizontal-share-btn'));
    await waitFor(() => getByText('Link copied!'));

    // Ensure message disappears after 3 seconds
    await waitFor(() => expect(screen.queryByText('Link copied!')).toBeNull(), { timeout: 3500 });
  });

  test('filters done recipes correctly by drink', () => {
    render(
      <MemoryRouter>
        <DoneRecipes />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId('filter-by-drink-btn'));

    const filteredDrinkRecipes = doneRecipes.filter((recipe) => recipe.type === 'drink');

    filteredDrinkRecipes.forEach((recipe, index) => {
      const drinkNameElement = screen.queryByTestId(`${index}-horizontal-name`);
      expect(drinkNameElement).toBeInTheDocument();
      expect(drinkNameElement).toHaveTextContent(recipe.name);
    });

    const mealNameElement = screen.queryByTestId(horizontalname0);
    if (mealNameElement) {
      expect(mealNameElement).not.toHaveTextContent(doneRecipes[0].name);
    }
  });
});
