// src/components/CategoryFilter.tsx
import React, { useEffect, useState } from 'react';

interface Category {
  strCategory: string;
}

interface CategoryFilterProps {
  type: 'meals' | 'drinks';
  onCategoryChange: (category: string) => void;
  currentCategory: string;
}

function CategoryFilter({
  type,
  onCategoryChange,
  currentCategory }: CategoryFilterProps): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const baseUrl = type === 'meals'
        ? 'https://www.themealdb.com/api/json/v1/1/list.php?c=list'
        : 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
      const response = await fetch(baseUrl);
      const data = await response.json();
      setCategories(data[type].slice(0, 5));
    };

    fetchCategories();
  }, [type]);

  return (
    <div
      style={ {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '20px' } }
    >
      <button
        data-testid="All-category-filter"
        style={ {
          margin: '5px',
          padding: '10px 20px',
          cursor: 'pointer',
          backgroundColor: currentCategory === '' ? 'lightblue' : 'transparent',
          transition: 'background-color 0.3s ease',
        } }
        onClick={ () => onCategoryChange('') }
      >
        All
      </button>
      {categories.map((category, index) => (
        <button
          key={ index }
          data-testid={ `${category.strCategory}-category-filter` }
          style={ {
            margin: '5px',
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: currentCategory === category.strCategory
              ? 'lightblue' : 'transparent',
            border: currentCategory === category.strCategory
              ? '2px solid blue' : '1px solid gray',
            boxShadow: currentCategory === category.strCategory
              ? '0 2px 10px rgba(0, 0, 0, 0.2)' : 'none',
            transition: 'all 0.3s ease' } }
          onClick={ () => onCategoryChange(currentCategory === category.strCategory
            ? '' : category.strCategory) }
        >
          {category.strCategory}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
