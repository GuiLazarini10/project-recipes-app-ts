import { render, screen, fireEvent } from '@testing-library/react';
import FavoriteRecipes from '../Pages/FavoriteRecipes';
import renderWithRouter from '../services/renderWithRouter';

const favoriteRecipes = [
  {
    id: '52771',
    type: 'meal',
    nationality: 'Italian',
    category: 'Vegetarian',
    alcoholicOrNot: '',
    name: 'Spicy Arrabiata Penne',
    image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
  },
  {
    id: '178319',
    type: 'drink',
    nationality: '',
    category: 'Cocktail',
    alcoholicOrNot: 'Alcoholic',
    name: 'Aquamarine',
    image: 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
  },
];

describe('FavoriteRecipes test - Junior', () => {
  const filterAllBtn = 'filter-by-all-btn';
  const filterMealBtn = 'filter-by-meal-btn';
  const filterDrinkBtn = 'filter-by-drink-btn';

  it('should have All button filter', () => {
    render(<FavoriteRecipes />);
    const allButton = screen.getByTestId(filterAllBtn);
    expect(allButton).toBeInTheDocument();
    expect(allButton).toHaveAttribute('data-testid', filterAllBtn);
  });

  it('should have Meal button filter', () => {
    render(<FavoriteRecipes />);
    const buttonMeals = screen.getByRole('button', { name: /meals/i });
    expect(buttonMeals).toBeInTheDocument();
  });

  it('should have all buttons filters', () => {
    render(<FavoriteRecipes />);
    expect(screen.getByTestId(filterAllBtn)).toBeInTheDocument();
    expect(screen.getByTestId(filterMealBtn)).toBeInTheDocument();
    expect(screen.getByTestId(filterDrinkBtn)).toBeInTheDocument();
  });

  it('should filter recipes by type', () => {
    render(<FavoriteRecipes />);
    fireEvent.click(screen.getByTestId(filterMealBtn));
    fireEvent.click(screen.getByTestId(filterDrinkBtn));
    fireEvent.click(screen.getByTestId(filterAllBtn));
  });

  it('should handle error when copying link fails', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));

    const { user } = renderWithRouter(<FavoriteRecipes />);

    await screen.findByTestId('0-horizontal-image');
    const shareButton = screen.getByTestId('0-horizontal-share-btn');
    await user.click(shareButton);
    const favoriteButton = screen.getByTestId('0-horizontal-favorite-btn');
    await user.click(favoriteButton);
    localStorage.clear();
  });
});
