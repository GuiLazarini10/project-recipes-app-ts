import React, { useState } from 'react';

interface Meal {
  idMeal: string;
  strMeal: string;
}

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOption, setSearchOption] = useState('ingredient');
  const [searchResults, setSearchResults] = useState<Meal[]>([]);

  const handleSearchOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchOption(event.target.value);
  };

  const handleSearch = () => {
    let searchUrl = '';
    switch (searchOption) {
      case 'ingredient':
        searchUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchTerm}`;
        break;
      case 'name':
        searchUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
        break;
      case 'first-letter':
        if (searchTerm.length !== 1) {
          alert('Your search must have only 1 (one) character');
          return;
        }
        searchUrl = `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchTerm}`;
        break;
      default:
        break;
    }

    // Chamada para a API
    fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data.meals || []);
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  return (
    <div>
      <input
        type="text"
        value={ searchTerm }
        onChange={ (e) => setSearchTerm(e.target.value) }
        placeholder="Search..."
        data-testid="search-input"
      />
      <label>
        Ingredient
        <input
          type="radio"
          value="ingredient"
          checked={ searchOption === 'ingredient' }
          onChange={ handleSearchOptionChange }
          data-testid="ingredient-search-radio"
        />
      </label>
      <label>
        Name
        <input
          type="radio"
          value="name"
          checked={ searchOption === 'name' }
          onChange={ handleSearchOptionChange }
          data-testid="name-search-radio"
        />
      </label>
      <label>
        First letter
        <input
          type="radio"
          value="first-letter"
          checked={ searchOption === 'first-letter' }
          onChange={ handleSearchOptionChange }
          data-testid="first-letter-search-radio"
        />
      </label>
      <button onClick={ handleSearch } data-testid="exec-search-btn">Search</button>

      <ul>
        {searchResults.map((result) => (
          <li key={ result.idMeal }>{result.strMeal}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBar;
