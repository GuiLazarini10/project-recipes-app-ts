import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Meal {
  idMeal: string;
  strMeal: string;
}

interface Drink {
  idDrink: string;
  strDrink: string;
}

interface ApiSearchResponse {
  meals?: Meal[];
  drinks?: Drink[];
}

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOption, setSearchOption] = useState<'ingredient'
  | 'name' | 'first-letter'>('ingredient');
  const [searchResults, setSearchResults] = useState<(Meal | Drink)[]>([]);
  const navigate = useNavigate();

  const handleSearchOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchOption(event.target.value as 'ingredient' | 'name' | 'first-letter');
  };

  const handleSearch = async () => {
    let searchUrl = '';

    // Definindo o URL correto com base na opção de busca e na página atual
    if (window.location.pathname === '/drinks') {
      searchUrl = buildSearchUrl(searchOption, searchTerm, 'https://www.thecocktaildb.com/api/json/v1/1');
    } else {
      searchUrl = buildSearchUrl(searchOption, searchTerm, 'https://www.themealdb.com/api/json/v1/1');
    }

    // Chamada para a API
    try {
      const response = await fetch(searchUrl);
      const data: ApiSearchResponse = await response.json();
      setSearchResults(data.meals || data.drinks || []);

      // Redirecionar para a tela de detalhes se apenas um resultado for encontrado
      if ((data.meals?.length === 1 && !data.drinks)
        || (data.drinks?.length === 1 && !data.meals)) {
        const id = data.meals ? data.meals[0].idMeal : data.drinks![0].idDrink;
        const type = data.meals ? 'meals' : 'drinks';
        navigate(`/${type}/${id}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Função para construir o URL de busca com base na opção selecionada
  const buildSearchUrl = (option: string, term: string, apiUrl: string): string => {
    switch (option) {
      case 'ingredient':
        return `${apiUrl}/filter.php?i=${term}`;
      case 'name':
        return `${apiUrl}/search.php?s=${term}`;
      case 'first-letter':
        if (term.length !== 1) {
          alert('Your search must have only 1 (one) character');
          return '';
        }
        return `${apiUrl}/search.php?f=${term}`;
      default:
        return '';
    }
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
          <li key={ 'idMeal' in result ? result.idMeal : result.idDrink }>
            {'strMeal' in result ? (result as Meal).strMeal : (result as Drink).strDrink}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBar;
