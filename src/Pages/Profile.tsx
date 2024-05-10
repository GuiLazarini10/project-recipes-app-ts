import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../components/Footer';
import ProfileImg from '../images/profileIcon.svg';

function Profile() {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const userLocalStorage = localStorage.getItem('user');
    if (userLocalStorage) {
      const userObject = JSON.parse(userLocalStorage);
      setUserEmail(userObject.email);
    }
  }, []);

  const clearLocalStorage = () => {
    localStorage.clear();
  };
  return (
    <div>
      <Header />
      <header>
        <Link to="/profile">
          <img
            data-testid="profile-top-btn"
            src={ ProfileImg }
            alt="Profile"
          />
        </Link>
        <h1 data-testid="page-title">Profile</h1>
      </header>
      <main>

        <p data-testid="profile-email">
          {userEmail}
        </p>
        <Link to="/done-recipes">
          <button
            data-testid="profile-done-btn"
            type="button"
          >
            Done Recipes
          </button>
        </Link>
        <Link to="/favorite-recipes">
          <button
            data-testid="profile-favorite-btn"
            type="button"
          >
            Favorite Recipes
          </button>
        </Link>
        <Link to="/">
          <button
            data-testid="profile-logout-btn"
            type="button"
            onClick={ clearLocalStorage }
          >
            Logout
          </button>
        </Link>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
