import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchById } from '../services/api';

function RecipeDetails() {
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        if (!id) return;
        await fetchById(window.location.pathname
          .includes('meals') ? 'comidas' : 'bebidas', id);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* receita aqui */}
    </div>
  );
}

export default RecipeDetails;
