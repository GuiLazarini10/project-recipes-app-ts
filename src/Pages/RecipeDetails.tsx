import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchById, fetchRecommendation } from '../services/api'; // Importa a função fetchRecommendation

function DrinkDetails() {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const isMeal = location.pathname.includes('meals');
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<any>(null);
  const [, setRecommendation] = useState<any>(null); // Armazena a recomendação

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const type = isMeal ? 'meals' : 'drinks';
        const data = await fetchById(type, id);
        setRecipe(data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isMeal]);

  useEffect(() => {
    const fetchRecommendationData = async () => {
      try {
        // Chama a função fetchRecommendation com base na página atual (comida ou bebida)
        const data = await fetchRecommendation(isMeal);
        setRecommendation(data);
      } catch (error) {
        console.error('Error fetching recommendation:', error);
      }
    };

    fetchRecommendationData();
  }, [isMeal]);

  if (loading) {
    return <div>Loading...</div>;
  }

  let category;
  if (isMeal) {
    category = recipe.strCategory;
  } else {
    category = recipe.strAlcoholic ? `Alcoholic: 
    ${recipe.strAlcoholic}` : 'Non-alcoholic';
  }

  return (
    <div>
      {recipe ? (
        <div>
          <img
            src={ isMeal ? recipe.strMealThumb : recipe.strDrinkThumb }
            alt="Recipe"
            data-testid="recipe-photo"
          />
          <h2 data-testid="recipe-title">{isMeal ? recipe.strMeal : recipe.strDrink}</h2>
          <p data-testid="recipe-category">{category}</p>
          <h3>Ingredients:</h3>
          <ul>
            {Object.keys(recipe)
              .filter((key) => key.includes('strIngredient') && recipe[key])
              .map((key, index) => (
                <li key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
                  {recipe[key]}
                  {' '}
                  -
                  {recipe[`strMeasure${index + 1}`]}
                </li>
              ))}
          </ul>
          <p data-testid="instructions">{recipe.strInstructions}</p>
          {isMeal && recipe.strYoutube && <iframe title="YouTube Video" src={ `https://www.youtube.com/embed/${recipe.strYoutube.split('=')[1]}` } data-testid="video" />}
        </div>
      ) : (
        <div>Recipe not found</div>
      )}
    </div>
  );
}

export default DrinkDetails;
