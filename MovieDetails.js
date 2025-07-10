
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Для роутинга
import { fetchMovieDetailsFromApi } from '../utils/api';
import { getFavorites, saveFavorites } from '../utils/favorites';
import { Spinner } from './Spinner';
import { ConfirmationModal } from './ConfirmationModal'; // Пользовательское модальное окно

export const MovieDetails = () => {
  const { movieId } = useParams(); // Получаем ID фильма из URL
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadMovieDetails = async () => {
      setIsLoading(true);
      const details = await fetchMovieDetailsFromApi(movieId);
      setMovie(details);
      // Проверяем, находится ли фильм уже в избранном
      const favorites = getFavorites();
      setIsFavorite(favorites.some(fav => fav.id === details.id));
      setIsLoading(false);
    };
    loadMovieDetails();
  }, [movieId]);

  const handleAddToFavorites = () => {
    setShowModal(true); // Показать модальное окно подтверждения
  };

  const confirmAddToFavorites = () => {
    if (movie) {
      const favorites = getFavorites();
      const updatedFavorites = [...favorites, movie]; // Добавляем фильм
      saveFavorites(updatedFavorites);
      setIsFavorite(true);
    }
    setShowModal(false); // Скрыть модальное окно
  };

  const cancelAddToFavorites = () => {
    setShowModal(false); // Скрыть модальное окно
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!movie) {
    return <p>Фильм не найден.</p>;
  }

  return (
    <div className="movie-details-page">
      <button onClick={() => navigate(-1)}>Назад к списку</button>
      <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder.png'} alt={movie.title} />
      <h1>{movie.title}</h1>
      <p><strong>Описание:</strong> {movie.overview}</p>
      <p><strong>Рейтинг:</strong> {movie.vote_average?.toFixed(1)} / 10</p>
      <p><strong>Дата выхода:</strong> {movie.release_date}</p>
      <p><strong>Жанры:</strong> {movie.genres?.map(g => g.name).join(', ')}</p>

      {!isFavorite ? (
        <button onClick={handleAddToFavorites}>Добавить в избранное</button>
      ) : (
        <p>Уже в избранном</p>
      )}

      {showModal && (
        <ConfirmationModal
          message={`Вы уверены, что хотите добавить "${movie.title}" в избранное?`}
          onConfirm={confirmAddToFavorites}
          onCancel={cancelAddToFavorites}
        />
      )}
    </div>
  );
};
