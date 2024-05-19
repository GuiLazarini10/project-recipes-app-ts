import React, { useState, useEffect } from 'react';
import shareIcon from '../images/shareIcon.svg';

interface DoneRecipe {
  id: string;
  type: string;
  nationality: string;
  category: string;
  alcoholicOrNot: string;
  name: string;
  image: string;
  doneDate: string;
  tags: string[];
}

function DoneRecipes() {
  const [doneRecipes, setDoneRecipes] = useState<DoneRecipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<DoneRecipe[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [copyMessage, setCopyMessage] = useState<string>('');

  useEffect(() => {
    const storedDoneRecipes = JSON.parse(localStorage.getItem('doneRecipes') || '[]');
    setDoneRecipes(storedDoneRecipes);
    setFilteredRecipes(storedDoneRecipes);
  }, []);

  const handleFilterChange = (type: string) => {
    setFilter(type);
    if (type === 'all') {
      setFilteredRecipes(doneRecipes);
    } else {
      setFilteredRecipes(doneRecipes.filter((recipe) => recipe.type === type));
    }
  };

  const handleShare = (id: string) => {
    const url = `${window.location
      .origin}/${filter === 'meal' ? 'meals' : 'drinks'}/${id}`;
    navigator.clipboard.writeText(url);
    setCopyMessage('Link copied!');
    setTimeout(() => setCopyMessage(''), 3000); // Clear message after 3 seconds
  };

  return (
    <div>
      <h1>Done Recipes</h1>
      <div>
        <button
          data-testid="filter-by-all-btn"
          onClick={ () => handleFilterChange('all') }
        >
          All
        </button>
        <button
          data-testid="filter-by-meal-btn"
          onClick={ () => handleFilterChange('meal') }
        >
          Meals
        </button>
        <button
          data-testid="filter-by-drink-btn"
          onClick={ () => handleFilterChange('drink') }
        >
          Drinks
        </button>
      </div>
      {copyMessage && <span>{copyMessage}</span>}
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
                ? `${recipe.nationality} - ${recipe.category}`
                : recipe.alcoholicOrNot}
            </p>
            <p data-testid={ `${index}-horizontal-name` }>{recipe.name}</p>
            <p data-testid={ `${index}-horizontal-done-date` }>{recipe.doneDate}</p>
            <input
              type="image"
              src={ shareIcon }
              alt="Compartilhar"
              data-testid={ `${index}-horizontal-share-btn` }
              onClick={ () => handleShare(recipe.id) }
            />
            {recipe.tags.slice(0, 2).map((tag) => (
              <span key={ tag } data-testid={ `${index}-${tag}-horizontal-tag` }>
                {tag}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoneRecipes;
