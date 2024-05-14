import React, { useState } from 'react';
import RecipeCards from '../components/Recipes';
import CategoryFilter from '../components/CategoryFilter';

function Drinks() {
  const [category, setCategory] = useState('');

  return (
    <div>
      <CategoryFilter
        type="drinks"
        onCategoryChange={ setCategory }
        currentCategory={ category }
      />
      <RecipeCards type="drinks" category={ category } />
    </div>
  );
}

export default Drinks;
