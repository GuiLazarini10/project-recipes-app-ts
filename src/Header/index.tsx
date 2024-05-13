import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileIcon from '../images/profileIcon.svg';
import SearchIcon from '../images/searchIcon.svg';
import SearchBar from '../components/SearchBar';

function Header() {
  const [pageTitle, setPageTitle] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const titleMap: Record<string, string> = {
      '/meals': 'Meals',
      '/drinks': 'Drinks',
      '/profile': 'Profile',
      '/done-recipes': 'Done Recipes',
      '/favorite-recipes': 'Favorite Recipes',
    };
    setPageTitle(titleMap[location.pathname] || '');
  }, [location]);

  const handleSearchClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  return (
    <header>
      <Link to="/profile">
        <img src={ ProfileIcon } alt="Profile" data-testid="profile-top-btn" />
      </Link>
      {location.pathname === '/meals' || location.pathname === '/drinks' ? (
        <button onClick={ handleSearchClick }>
          <img src={ SearchIcon } alt="Search" data-testid="search-top-btn" />
        </button>
      ) : null}
      {showSearchBar && <SearchBar />}
      <h1 data-testid="page-title">{pageTitle}</h1>
    </header>
  );
}

export default Header;
