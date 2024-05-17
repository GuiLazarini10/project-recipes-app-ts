import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import DrinkDetails from '../Pages/RecipeDetails';
import { fetchById, fetchRecommendation } from '../services/api';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../services/api');

describe('DrinkDetails Component', () => {
  const mockRecipe = {
    id: '1',
    strDrink: 'Margarita',
    strCategory: 'Cocktail',
    strAlcoholic: 'Alcoholic',
    strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg',
    strInstructions: 'Shake and strain into a chilled cocktail glass.',
    strYoutube: 'https://www.youtube.com/watch?v=1',
  };

  const mockRecommendations = [
    { id: '2', strDrink: 'Martini' },
    { id: '3', strDrink: 'Old Fashioned' },
  ];

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/drinks/1' });
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());

    (fetchById as jest.Mock).mockResolvedValue([mockRecipe]);
    (fetchRecommendation as jest.Mock).mockResolvedValue(mockRecommendations);
  });

  it('renders loading state initially', () => {
    render(<DrinkDetails />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders recipe details after fetching', async () => {
    render(<DrinkDetails />);
    await waitFor(() => expect(fetchById).toHaveBeenCalled());

    expect(screen.getByTestId('recipe-photo')).toHaveAttribute('src', mockRecipe.strDrinkThumb);
    expect(screen.getByTestId('recipe-title')).toHaveTextContent(mockRecipe.strDrink);
    expect(screen.getByTestId('recipe-category')).toHaveTextContent(`Alcoholic: ${mockRecipe.strAlcoholic}`);
    expect(screen.getByTestId('instructions')).toHaveTextContent(mockRecipe.strInstructions);
    expect(screen.getByTestId('video')).toHaveAttribute('src', 'https://www.youtube.com/embed/1');
  });

  it('handles sharing the recipe link', async () => {
    render(<DrinkDetails />);
    await waitFor(() => expect(fetchById).toHaveBeenCalled());

    const shareButton = screen.getByTestId('share-btn');
    fireEvent.click(shareButton);

    await waitFor(() => expect(screen.getByText('Link copied!')).toBeInTheDocument());
  });

  it('handles favoriting the recipe', async () => {
    render(<DrinkDetails />);
    await waitFor(() => expect(fetchById).toHaveBeenCalled());

    const favoriteButton = screen.getByTestId('favorite-btn');

    fireEvent.click(favoriteButton);
    await waitFor(() => {
      expect(favoriteButton).toHaveAttribute('src', blackHeartIcon);
    });

    fireEvent.click(favoriteButton);
    await waitFor(() => {
      expect(favoriteButton).toHaveAttribute('src', whiteHeartIcon);
    });
  });

  it('handles starting the recipe', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(<DrinkDetails />);
    await waitFor(() => expect(fetchById).toHaveBeenCalled());

    const startButton = screen.getByTestId('start-recipe-btn');
    fireEvent.click(startButton);

    expect(mockNavigate).toHaveBeenCalledWith('/drinks/1/in-progress');
  });
});
