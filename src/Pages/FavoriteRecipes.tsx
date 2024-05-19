import React, { useEffect, useState } from 'react';
import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

interface Recipe {
  id: string;
  type: 'meal' | 'drink';
  name: string;
  image: string;
  category: string;
  nationality?: string; // Alterado de area para nationality
  alcoholicOrNot?: string;
}

function FavoriteRecipes() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const storedFavoriteRecipes = localStorage.getItem('favoriteRecipes');
    if (storedFavoriteRecipes) {
      const recipes = JSON.parse(storedFavoriteRecipes);
      setFavoriteRecipes(recipes);
      setFilteredRecipes(recipes);
    }
  }, []);

  const handleFilter = (filter: 'all' | 'meal' | 'drink') => {
    if (filter === 'all') {
      setFilteredRecipes(favoriteRecipes);
    } else if (filter === 'meal') {
      setFilteredRecipes(favoriteRecipes.filter((recipe) => recipe.type === 'meal'));
    } else {
      setFilteredRecipes(favoriteRecipes.filter((recipe) => recipe.type === 'drink'));
    }
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/meals/${id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleUnfavorite = (id: string) => {
    const updatedFavorites = favoriteRecipes.filter((recipe) => recipe.id !== id);
    setFavoriteRecipes(updatedFavorites);
    setFilteredRecipes(updatedFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      <button
        data-testid="filter-by-all-btn"
        onClick={ () => handleFilter('all') }
      >
        All
      </button>
      <button
        data-testid="filter-by-meal-btn"
        onClick={ () => handleFilter('meal') }
      >
        Meals
      </button>
      <button
        data-testid="filter-by-drink-btn"
        onClick={ () => handleFilter('drink') }
      >
        Drinks
      </button>
      <div>
        {filteredRecipes.map((recipe, index) => (
          <div key={ recipe.id }>
            <img
              src={ recipe.image }
              alt={ recipe.name }
              data-testid={ `${index}-horizontal-image` }
            />
            <p data-testid={ `${index}-horizontal-top-text` }>
              {recipe.type === 'meal'
                ? `${recipe.nationality} - ${recipe.category}` : recipe.alcoholicOrNot}
            </p>
            <h3 data-testid={ `${index}-horizontal-name` }>{recipe.name}</h3>
            <button
              onClick={ () => handleShare(recipe.id) }
            >
              <img
                data-testid={ `${index}-horizontal-share-btn` }
                src={ shareIcon }
                alt="Share"
              />
            </button>
            <button
              onClick={ () => handleUnfavorite(recipe.id) }
            >
              <img
                data-testid={ `${index}-horizontal-favorite-btn` }
                src={ blackHeartIcon }
                alt="Unfavorite"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoriteRecipes;
