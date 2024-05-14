import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Recipe {
  idMeal?: string;
  idDrink?: string;
  strMeal?: string;
  strDrink?: string;
  strMealThumb?: string;
  strDrinkThumb?: string;
}

interface RecipeCardsProps {
  type: 'meals' | 'drinks';
  category?: string;
}

function RecipeCards({ type, category = '' }: RecipeCardsProps): JSX.Element {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      const baseUrl = `https://www.${type === 'meals' ? 'themealdb' : 'thecocktaildb'}.com/api/json/v1/1/`;
      const query = category ? `filter.php?c=${category}` : 'search.php?s=';
      try {
        const response = await fetch(baseUrl + query);
        const data = await response.json();
        setRecipes((data[type] || []).slice(0, 12));
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      }
    };

    fetchRecipes();
  }, [type, category]);

  const handleKeyDown = (event:
  React.KeyboardEvent<HTMLDivElement>, id: string | undefined) => {
    // Combina as condições em um único `if`
    if ((event.key === 'Enter' || event.key === ' ') && id) {
      navigate(`/${type}/${id}`);
    }
  };

  return (
    <div
      style={ {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        maxWidth: '1200px',
        margin: 'auto' } }
    >
      {recipes.map((recipe, index) => {
        const name = recipe.strMeal || recipe.strDrink || '';
        const isLongName = name.length > 20;
        const id = recipe.idMeal || recipe.idDrink;
        return (
          <div
            key={ id }
            data-testid={ `${index}-recipe-card` }
            style={ {
              width: 'calc(100% / 6 - 10px)',
              margin: '5px',
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
              boxSizing: 'border-box',
              cursor: 'pointer',
            } }
            role="button"
            tabIndex={ 0 }
            onClick={ () => id && navigate(`/${type}/${id}`) }
            onKeyDown={ (event) => id && handleKeyDown(event, id) }
          >
            <img
              src={ recipe.strMealThumb || recipe.strDrinkThumb }
              alt={ recipe.strMeal || recipe.strDrink }
              data-testid={ `${index}-card-img` }
              style={ { width: '100%', height: '70%', objectFit: 'cover' } }
            />
            <h3
              data-testid={ `${index}-card-name` }
              style={ {
                padding: '10px',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: isLongName ? 'normal' : 'nowrap',
                fontSize: isLongName ? '14px' : '16px',
                height: '30%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              } }
            >
              {recipe.strMeal || recipe.strDrink}
            </h3>
          </div>
        );
      })}
    </div>
  );
}

export default RecipeCards;
