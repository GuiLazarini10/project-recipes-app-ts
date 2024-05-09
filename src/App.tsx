import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Header from './Header';
import Meals from './Pages/Meals';
import Drinks from './Pages/Drinks';
import Profile from './Pages/Profile';
import DoneRecipes from './Pages/DoneRecipes';
import FavoriteRecipes from './Pages/FavoriteRecipes';
import Login from './Pages/Login';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route
          path="/meals/*"
          element={
            <>
              <Header />
              <Meals />
            </>
}
        />
        <Route
          path="/drinks/*"
          element={
            <>
              <Header />
              <Drinks />
            </>
}
        />
        <Route
          path="/profile"
          element={
            <>
              <Header />
              <Profile />
            </>
}
        />
        <Route
          path="/done-recipes"
          element={
            <>
              <Header />
              <DoneRecipes />
            </>
}
        />
        <Route
          path="/favorite-recipes"
          element={
            <>
              <Header />
              <FavoriteRecipes />
            </>
}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
