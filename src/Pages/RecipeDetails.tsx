import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchById } from '../services/api';

function RecipeDetails() {
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<any>(null);
  useEffect(() => {
    // Função que busca os detalhes da receita quando o ID é atualizado
    const fetchData = async () => {
      // Verifica se o ID está presente
      if (!id) return;
      try {
        // Determina o tipo de receita com base na URL
        const type = window.location.pathname.includes('meals') ? 'meals' : 'drinks';
        // Faz a requisição à API mostrar os detalhes da receita
        const data = await fetchById(type, id);
        // Armazena no estado
        setRecipe(data[0]);
        setLoading(false);
      } catch (error) {
        // Se houver erro na requisição
        console.error('Error fetching recipe details:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  // Mensagem de carregamento
  if (loading) {
    return <div>Loading...</div>;
  }
  // Se a receita existe
  return (
    <div>
      {recipe ? (
        <div>
          <h2>{recipe.strMeal || recipe.strDrink}</h2>
          <p>{recipe.strInstructions}</p>
          {/* Detalhes da receita */}
        </div>
      ) : (
        // Se a receita não existe
        <div>Recipe not found</div>
      )}
    </div>
  );
}
export default RecipeDetails;
