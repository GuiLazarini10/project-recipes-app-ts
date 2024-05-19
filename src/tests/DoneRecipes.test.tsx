import { render, screen, fireEvent } from '@testing-library/react';
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

describe('DoneRecipes Page', () => {
  beforeEach(() => {
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('renders done recipes with correct details for drinks', () => {
    render(
      <MemoryRouter>
        <DoneRecipes />
      </MemoryRouter>,
    );

    const drinkImage = screen.getByTestId('1-horizontal-image');
    const drinkTopText = screen.getByTestId('1-horizontal-top-text');
    const drinkName = screen.getByTestId('1-horizontal-name');
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
    expect(screen.queryByTestId('0-horizontal-name')).toHaveTextContent(doneRecipes[0].name);
    expect(screen.queryByTestId('1-horizontal-name')).toBeNull();
  });
});
