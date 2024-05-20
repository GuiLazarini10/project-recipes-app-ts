import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';

interface Recipe {
  id: string;
  type: 'meal' | 'drink';
  name: string;
  image: string;
  category: string;
  nationality?: string;
  alcoholicOrNot?: string;
}

const LINK_COPIED_TEXT = 'Link copied!';

function FavoriteRecipes() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [copySuccess, setCopySuccess] = useState<string>('');

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

  const handleShare = async (type: string, id: string) => {
    try {
      const url = `${window.location.origin}/${type === 'meal'
        ? 'meals' : 'drinks'}/${id}`;
      await navigator.clipboard.writeText(url);
      setCopySuccess(LINK_COPIED_TEXT);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleUnfavorite = (id: string) => {
    const updatedFavorites = favoriteRecipes.filter((recipe) => recipe.id !== id);
    setFavoriteRecipes(updatedFavorites);
    setFilteredRecipes(updatedFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      <div>
        <button
          data-testid="filter-by-all-btn"
          onClick={ () => handleFilter('all') }
          style={ { marginRight: '10px' } }
        >
          All
        </button>
        <button
          data-testid="filter-by-meal-btn"
          onClick={ () => handleFilter('meal') }
          style={ { marginRight: '10px' } }
        >
          Meals
        </button>
        <button
          data-testid="filter-by-drink-btn"
          onClick={ () => handleFilter('drink') }
        >
          Drinks
        </button>
      </div>
      <div>
        {filteredRecipes.map((recipe, index) => (
          <div key={ recipe.id }>
            <Link
              to={ `/${recipe.type === 'meal'
                ? 'meals' : 'drinks'}/${recipe.id}` }
            >
              <img
                src={ recipe.image }
                alt={ recipe.name }
                data-testid={ `${index}-horizontal-image` }
                width={ 100 }
              />
              <p data-testid={ `${index}-horizontal-name` }>{recipe.name}</p>
            </Link>
            <p data-testid={ `${index}-horizontal-top-text` }>
              {recipe.type === 'meal'
                ? `${recipe.nationality} - ${recipe.category}` : recipe.alcoholicOrNot}
            </p>
            <input
              type="image"
              src={ shareIcon }
              onClick={ () => handleShare(recipe.type, recipe.id) }
              data-testid={ `${index}-horizontal-share-btn` }
              alt="Share"
            />
            <input
              type="image"
              src={ blackHeartIcon }
              onClick={ () => handleUnfavorite(recipe.id) }
              data-testid={ `${index}-horizontal-favorite-btn` }
              alt="Unfavorite"
            />
            {copySuccess && <div>{copySuccess}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoriteRecipes;
