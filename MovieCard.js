import React from 'react';
import { useNavigate } from 'react-router-dom';

export const MovieCard = React.forwardRef(({ movie, onRemove, showRemoveButton }, ref) => {
  const navigate = useNavigate();
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'placeholder.png';

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" ref={ref}>
      <img src={posterUrl} alt={movie.title} onClick={handleClick} />
      <h3 onClick={handleClick}>{movie.title}</h3>
      <p>Год: {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</p>
      <p>Рейтинг: {movie.vote_average?.toFixed(1)}</p>
      {showRemoveButton && (
        <button onClick={() => onRemove(movie.id)}>Удалить из избранного</button>
      )}
    </div>
  );
});

// components/Filters.js
import React, { useState, useEffect } from 'react';

export const Filters = ({ currentFilters, onFilterChange }) => {
  const [genres, setGenres] = useState([]); // Загрузить жанры из API при монтировании
  const [localFilters, setLocalFilters] = useState(currentFilters);

  useEffect(() => {
    // В реальном приложении: загрузить список жанров из API
    // Например: fetch('API_BASE_URL/genre/movie/list?api_key=...')
    setGenres([
      { id: 28, name: 'Боевик' }, { id: 12, name: 'Приключения' },
      { id: 16, name: 'Мультфильм' }, { id: 35, name: 'Комедия' },
      // ... другие жанры
    ]);
  }, []);

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    const newGenres = checked
      ? [...localFilters.genre, value]
      : localFilters.genre.filter(g => g !== value);
    setLocalFilters(prev => ({ ...prev, genre: newGenres }));
    onFilterChange({ ...localFilters, genre: newGenres });
  };

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    const newRange = name === 'minRating'
      ? [parseFloat(value), localFilters.ratingRange[1]]
      : [localFilters.ratingRange[0], parseFloat(value)];
    setLocalFilters(prev => ({ ...prev, ratingRange: newRange }));
    onFilterChange({ ...localFilters, ratingRange: newRange });
  };

  const handleYearChange = (e) => {
    const { name, value } = e.target;
    const newRange = name === 'minYear'
      ? [parseInt(value), localFilters.yearRange[1]]
      : [localFilters.yearRange[0], parseInt(value)];
    setLocalFilters(prev => ({ ...prev, yearRange: newRange }));
    onFilterChange({ ...localFilters, yearRange: newRange });
  };

  return (
    <div className="filters">
      <h3>Фильтры:</h3>
      <div>
        <h4>Жанры:</h4>
        {genres.map(genre => (
          <label key={genre.id}>
            <input
              type="checkbox"
              value={genre.id}
              checked={localFilters.genre.includes(String(genre.id))} // Сравнение как строки, т.к. API может возвращать id как числа, а checkbox value - строка
              onChange={handleGenreChange}
            />
            {genre.name}
          </label>
        ))}
      </div>
      <div>
        <h4>Рейтинг:</h4>
        <input
          type="number"
          name="minRating"
          min="0" max="10" step="0.1"
          value={localFilters.ratingRange[0]}
          onChange={handleRatingChange}
        />
        -
        <input
          type="number"
          name="maxRating"
          min="0" max="10" step="0.1"
          value={localFilters.ratingRange[1]}
          onChange={handleRatingChange}
        />
      </div>
      <div>
        <h4>Год выпуска (с 1990):</h4>
        <input
          type="number"
          name="minYear"
          min="1990" max={new Date().getFullYear()}
          value={localFilters.yearRange[0]}
          onChange={handleYearChange}
        />
        -
        <input
          type="number"
          name="maxYear"
          min="1990" max={new Date().getFullYear()}
          value={localFilters.yearRange[1]}
          onChange={handleYearChange}
        />
      </div>
    </div>
  );
};

// components/Spinner.js
import React from 'react';

export const Spinner = () => (
  <div className="spinner">
    <div className="loader"></div>
    <p>Загрузка...</p>
  </div>
);

// components/ConfirmationModal.js
import React from 'react';

export const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Да</button>
          <button onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
};
