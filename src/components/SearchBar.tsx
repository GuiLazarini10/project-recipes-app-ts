import React from 'react';

function SearchBar() {
  return (
    <div className="search-bar">
      <input type="text" data-testid="search-input" placeholder="Search..." />
      <div>
        <label htmlFor="ingredient-search">
          <input
            type="radio"
            id="ingredient-search"
            name="search-type"
            data-testid="ingredient-search-radio"
          />
          Ingredient
        </label>
        <label htmlFor="name-search">
          <input
            type="radio"
            id="name-search"
            name="search-type"
            data-testid="name-search-radio"
          />
          Name
        </label>
        <label htmlFor="first-letter-search">
          <input
            type="radio"
            id="first-letter-search"
            name="search-type"
            data-testid="first-letter-search-radio"
          />
          First Letter
        </label>
        <button type="button" data-testid="exec-search-btn">Search</button>
      </div>
    </div>
  );
}

export default SearchBar;
