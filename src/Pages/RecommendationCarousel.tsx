import React, { useRef, useEffect } from 'react';
import './RecommendationCarousel.css';

interface Recommendation {
  id: string;
  strMeal?: string;
  strDrink?: string;
  strMealThumb?: string;
  strDrinkThumb?: string;
}

// Define as propriedades esperadas pelo componente
interface RecommendationCarouselProps {
  recommendations: Recommendation[];
}

// Função principal do componente
function RecommendationCarousel({ recommendations }: RecommendationCarouselProps) {
  // Cria uma referência para o elemento do caroussel
  const carouselRef = useRef<HTMLDivElement>(null);

  // Função para rolar o carousel para a esquerda ou direita
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left'
        ? -carouselRef.current.clientWidth / 2 : carouselRef.current.clientWidth / 2;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Função que verifica a visibilidade dos itens
    const handleScroll = () => {
      if (carouselRef.current) {
        const items = carouselRef.current.querySelectorAll('.item');
        items.forEach((item) => {
          const itemLeft = item.getBoundingClientRect().left;
          const itemRight = item.getBoundingClientRect().right;
          const carouselLeft = carouselRef.current?.getBoundingClientRect().left || 0;
          const carouselRight = carouselRef.current?.getBoundingClientRect().right || 0;

          // Adiciona ou remove a classe 'visible' baseada na posição do item
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
    // Adiciona os listeners para rolagem e redimensionamento da janela
    currentCarouselRef?.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    // Remove os listeners quando o componente é desmontado
    return () => {
      currentCarouselRef?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [carouselRef]);

  return (
    <div className="main-container">
      <button className="prev" onClick={ () => scroll('left') }>&laquo;</button>
      <div className="carousel" ref={ carouselRef }>
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
