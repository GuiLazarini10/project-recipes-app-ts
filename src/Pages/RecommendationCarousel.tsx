import React, { useRef, useEffect } from 'react';
import './RecommendationCarousel.css';

interface Recommendation {
  id: string;
  strMeal?: string;
  strDrink?: string;
  strMealThumb?: string;
  strDrinkThumb?: string;
}

interface RecommendationCarouselProps {
  recommendations: Recommendation[];
}

function RecommendationCarousel({ recommendations }: RecommendationCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left'
        ? -carouselRef.current.clientWidth / 2 : carouselRef.current.clientWidth / 2;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const items = carouselRef.current.querySelectorAll('.item');
        items.forEach((item) => {
          const itemLeft = item.getBoundingClientRect().left;
          const itemRight = item.getBoundingClientRect().right;
          const carouselLeft = carouselRef.current?.getBoundingClientRect().left || 0;
          const carouselRight = carouselRef.current?.getBoundingClientRect().right || 0;

          if (itemLeft >= carouselLeft && itemRight <= carouselRight) {
            item.classList.add('visible');
          } else {
            item.classList.remove('visible');
          }
        });
      }
    };

    handleScroll();

    const currentCarouselRef = carouselRef.current;
    currentCarouselRef?.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      currentCarouselRef?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [carouselRef]);

  return (
    <div className="main-container">
      <button className="prev" onClick={ () => scroll('left') }>&laquo;</button>
      <div className="carousel" ref={ carouselRef } role="region">
        {recommendations.map((recommendation, index) => (
          <div
            key={ recommendation.id }
            className="item"
            data-testid={ `${index}-recommendation-card` }
          >
            <img
              src={ recommendation.strMealThumb || recommendation.strDrinkThumb }
              alt={ recommendation.strMeal || recommendation.strDrink }
            />
            <p data-testid={ `${index}-recommendation-title` }>
              {recommendation.strMeal || recommendation.strDrink}
            </p>
          </div>
        ))}
      </div>
      <button className="next" onClick={ () => scroll('right') }>&raquo;</button>
    </div>
  );
}

export default RecommendationCarousel;
