import React from 'react';
import { useLocation } from 'react-router-dom';
import ProfileIcon from '../images/profileIcon.svg';
import SearchIcon from '../images/searchIcon.svg';

function Header() {
  const location = useLocation();
  const { pathname } = location;

  const getTitle = () => {
    switch (pathname) {
      case '/meals':
        return 'Meals';
      case '/drinks':
        return 'Drinks';
      case '/profile':
        return 'Profile';
      case '/done-recipes':
        return 'Done Recipes';
      case '/favorite-recipes':
        return 'Favorite Recipes';
      default:
        return '';
    }
  };

  const showSearchIcon = ['/meals', '/drinks'].includes(pathname);

  return (
    <header>
      <div>
        <img src={ ProfileIcon } alt="Profile" data-testid="profile-top-btn" />
        {showSearchIcon && <img
          src={ SearchIcon }
          alt="Search"
          data-testid="search-top-btn"
        />}
      </div>
      <h1 data-testid="page-title">{getTitle()}</h1>
    </header>
  );
}

export default Header;
