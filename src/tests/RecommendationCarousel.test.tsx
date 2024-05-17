import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RecommendationCarousel from '../Pages/RecommendationCarousel';
import '@testing-library/jest-dom/extend-expect';

const mockRecommendations = [
  {
    id: '1',
    strDrink: 'Margarita',
    strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/wpxpvu1439905379.jpg',
  },
  {
    id: '2',
    strDrink: 'Daiquiri',
    strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/mrz9091589574515.jpg',
  },
];

const dataTestIds = {
  recommendationCard: (index: number) => `${index}-recommendation-card`,
  recommendationTitle: (index: number) => `${index}-recommendation-title`,
};

describe('RecommendationCarousel Component', () => {
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
      configurable: true,
      value({ left }: { left: number }) {
        this.scrollLeft += left;
        this.dispatchEvent(new Event('scroll'));
      },
    });
  });

  test('should render recommendations', () => {
    render(<RecommendationCarousel recommendations={ mockRecommendations } />);

    mockRecommendations.forEach((recommendation, index) => {
      expect(screen.getByTestId(dataTestIds.recommendationCard(index))).toBeInTheDocument();
      expect(screen.getByTestId(dataTestIds.recommendationTitle(index))).toHaveTextContent(recommendation.strDrink);
    });
  });

  test('should scroll carousel when buttons are clicked', () => {
    render(<RecommendationCarousel recommendations={ mockRecommendations } />);

    const carousel = screen.getByRole('region');
    const initialScrollLeft = carousel.scrollLeft;
    const initialScrollRight = carousel.scrollWidth - carousel.clientWidth - initialScrollLeft;

    const nextButton = screen.getByText('»');
    fireEvent.click(nextButton);

    setTimeout(() => {
      const newScrollLeft = carousel.scrollLeft;
      const newScrollRight = carousel.scrollWidth - carousel.clientWidth - newScrollLeft;
      expect(newScrollRight).toBeLessThan(initialScrollRight);

      const prevButton = screen.getByText('«');
      fireEvent.click(prevButton);

      setTimeout(() => {
        const finalScrollLeft = carousel.scrollLeft;
        const finalScrollRight = carousel.scrollWidth - carousel.clientWidth - finalScrollLeft;
        expect(finalScrollRight).toBeGreaterThan(newScrollRight);
      }, 500);
    }, 500);
  });

  test('should mark visible items with visible class', () => {
    render(<RecommendationCarousel recommendations={ mockRecommendations } />);

    const items = screen.getAllByRole('img');
    items.forEach((item) => {
      expect(item.parentElement).toHaveClass('visible');
    });
  });
});
