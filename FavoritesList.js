
import React, { useState, useEffect } from 'react';
import { getFavorites, saveFavorites } from '../utils/favorites';
import { MovieCard } from './MovieCard'; // Используем ту же карточку фильма

export const FavoritesList = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    setFavoriteMovies(getFavorites());
  }, []);

  const handleRemoveFromFavorites = (movieIdToRemove) => {
    const updatedFavorites = favoriteMovies.filter(movie => movie.id !== movieIdToRemove);
    setFavoriteMovies(updatedFavorites);
    saveFavorites(updatedFavorites); // Обновляем локальное хранилище
  };

  return (
    <div>
      <h1>Мои избранные фильмы</h1>
      {favoriteMovies.length === 0 ? (
        <p>У вас пока нет избранных фильмов.</p>
      ) : (
        <div className="movie-list-grid">
          {favoriteMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onRemove={handleRemoveFromFavorites} // Передаем функцию для удаления
              showRemoveButton={true} // Опция для отображения кнопки удаления
            />
          ))}
        </div>
      )}
    </div>
  );
};
