import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileIcon from '../images/profileIcon.svg';
import SearchIcon from '../images/searchIcon.svg';

function Header() {
  const [pageTitle, setPageTitle] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const titleMap: Record<string, string> = {
      '/meals': 'Meals',
      '/drinks': 'Drinks',
      '/profile': 'Profile',
      '/done-recipes': 'Done Recipes',
      '/favorite-recipes': 'Favorite Recipes',
    };

    // Verifica se a chave da localização atual está presente no titleMap antes de acessá-la
    if (titleMap[location.pathname]) {
      setPageTitle(titleMap[location.pathname]);
    } else {
      // Define o título como vazio se a chave não existir
      setPageTitle('');
    }
  }, [location]);

  return (
    <header>
      <button onClick={ () => navigate('/profile') }>
        <img src={ ProfileIcon } alt="Profile" data-testid="profile-top-btn" />
      </button>
      {(location.pathname === '/meals' || location.pathname === '/drinks') && (
        <button>
          <img
            src={ SearchIcon }
            alt="Search"
            data-testid="search-top-btn"
          />
        </button>
      )}
      <h1 data-testid="page-title">{pageTitle}</h1>
    </header>
  );
}

export default Header;
