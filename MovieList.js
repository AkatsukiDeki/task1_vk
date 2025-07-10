
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchMoviesFromApi } from '../utils/api';
import { MovieCard } from './MovieCard'; // Отдельный компонент для одной карточки фильма
import { Filters } from './Filters'; // Компонент для UI фильтров
import { Spinner } from './Spinner'; // Индикатор загрузки

// Предполагаем, что этот компонент получает initialFilters из searchParameters
export const MovieList = ({ initialFilters = {} }) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    genre: initialFilters.genre || [],
    ratingRange: initialFilters.ratingRange || [0, 10],
    yearRange: initialFilters.yearRange || [1990, new Date().getFullYear()],
  });

  const observer = useRef(); // Для Intersection Observer для бесконечной прокрутки
  const lastMovieElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const loadMovies = useCallback(async () => {
    setIsLoading(true);
    const newMovies = await fetchMoviesFromApi(filters, page);
    if (newMovies.length === 0) {
      setHasMore(false);
    }
    setMovies(prevMovies => [...prevMovies, ...newMovies]);
    setIsLoading(false);
  }, [filters, page]);

  useEffect(() => {
    // При изменении фильтров сбрасываем список и загружаем новые фильмы с первой страницы
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [filters]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]); // Загружаем фильмы при изменении page или при первом рендере

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // В реальном приложении здесь нужно обновить searchParameters в URL
    // Например: history.push(`/?${new URLSearchParams(newFilters).toString()}`);
  };

  return (
    <div>
      <h1>Список фильмов</h1>
      <Filters currentFilters={filters} onFilterChange={handleFilterChange} />
      <div className="movie-list-grid">
        {movies.map((movie, index) => {
          if (movies.length === index + 1) {
            return <MovieCard ref={lastMovieElementRef} key={movie.id} movie={movie} />;
          } else {
            return <MovieCard key={movie.id} movie={movie} />;
          }
        })}
      </div>
      {isLoading && <Spinner />}
      {!hasMore && !isLoading && <p>Больше нет фильмов.</p>}
    </div>
  );
};
