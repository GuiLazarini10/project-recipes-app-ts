import React, { useState } from 'react';
import RecipeCards from '../components/Recipes';
import CategoryFilter from '../components/CategoryFilter';

function Meals() {
  const [category, setCategory] = useState('');

  return (
    <div>
      <CategoryFilter
        type="meals"
        onCategoryChange={ setCategory }
        currentCategory={ category }
      />
      <RecipeCards type="meals" category={ category } />
    </div>
  );
}

export default Meals;
