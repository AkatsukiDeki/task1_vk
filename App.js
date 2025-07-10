
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MovieList } from './components/MovieList';
import { MovieDetails } from './components/MovieDetails';
import { FavoritesList } from './components/FavoritesList';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Фильмы</Link>
          </li>
          <li>
            <Link to="/favorites">Избранное</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/movie/:movieId" element={<MovieDetails />} />
        <Route path="/favorites" element={<FavoritesList />} />
      </Routes>
    </Router>
  );
}

export default App;
