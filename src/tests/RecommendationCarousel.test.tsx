import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeAll } from 'vitest';
import RecommendationCarousel from '../Pages/RecommendationCarousel';

interface Recommendation {
  id: string;
  strMeal?: string;
  strDrink?: string;
  strMealThumb?: string;
  strDrinkThumb?: string;
}

const mockRecommendations: Recommendation[] = [
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
  {
    id: '3',
    strDrink: 'Mojito',
    strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/rxtqps1478251029.jpg',
  },
  {
    id: '4',
    strDrink: 'Old Fashioned',
    strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/vrwquq1478252802.jpg',
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
      expect(screen.getByTestId(dataTestIds.recommendationTitle(index))).toHaveTextContent(recommendation.strDrink!);
    });
  });

  test('should scroll carousel when buttons are clicked', () => {
    render(<RecommendationCarousel recommendations={ mockRecommendations } />);

    const carousel = screen.getByRole('region');
    const initialScrollLeft = carousel.scrollLeft;

    const nextButton = screen.getByText('»');
    fireEvent.click(nextButton);

    setTimeout(() => {
      const newScrollLeft = carousel.scrollLeft;
      expect(newScrollLeft).toBeGreaterThan(initialScrollLeft);

      const prevButton = screen.getByText('«');
      fireEvent.click(prevButton);

      setTimeout(() => {
        const finalScrollLeft = carousel.scrollLeft;
        expect(finalScrollLeft).toBeLessThan(newScrollLeft);
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

  test('should add or remove visible class based on item position', () => {
    render(<RecommendationCarousel recommendations={ mockRecommendations } />);

    const carousel = screen.getByRole('region');

    const checkVisibility = () => {
      const items = screen.getAllByRole('img');
      items.forEach((item) => {
        const parent = item.parentElement;
        const itemLeft = parent?.getBoundingClientRect().left ?? 0;
        const itemRight = parent?.getBoundingClientRect().right ?? 0;
        const carouselLeft = carousel.getBoundingClientRect().left;
        const carouselRight = carousel.getBoundingClientRect().right;

        if (itemLeft >= carouselLeft && itemRight <= carouselRight) {
          expect(parent).toHaveClass('visible');
        } else {
          expect(parent).not.toHaveClass('visible');
        }
      });
    };

    checkVisibility();

    fireEvent.click(screen.getByText('»'));

    setTimeout(() => {
      checkVisibility();

      fireEvent.click(screen.getByText('«'));

      setTimeout(() => {
        checkVisibility();
      }, 500);
    }, 500);
  });

  test('should handle empty recommendations', () => {
    render(<RecommendationCarousel recommendations={ [] } />);
    expect(screen.queryByTestId(dataTestIds.recommendationCard(0))).not.toBeInTheDocument();
  });
});
