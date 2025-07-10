// constants.js
export const API_BASE_URL = 'https://api.themoviedb.org/3'; // Пример URL API
export const API_KEY = 'YOUR_API_KEY'; // Замените на ваш реальный ключ API

// utils/api.js
import { API_BASE_URL, API_KEY } from '../constants';

export const fetchMoviesFromApi = async (filters, page = 1, limit = 50) => {
  try {
    // В реальном приложении здесь будет построение URL с учетом фильтров
    // и пагинации для API (например, The Movie Database API)
    const genreQuery = filters.genre.length > 0 ? `&with_genres=${filters.genre.join(',')}` : '';
    const ratingGte = filters.ratingRange[0] > 0 ? `&vote_average.gte=${filters.ratingRange[0]}` : '';
    const ratingLte = filters.ratingRange[1] < 10 ? `&vote_average.lte=${filters.ratingRange[1]}` : '';
    const yearGte = filters.yearRange[0] > 1990 ? `&primary_release_date.gte=${filters.yearRange[0]}-01-01` : '';
    const yearLte = filters.yearRange[1] < new Date().getFullYear() ? `&primary_release_date.lte=${filters.yearRange[1]}-12-31` : '';

    const response = await fetch(
      `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&language=ru-RU&sort_by=popularity.desc&page=${page}${genreQuery}${ratingGte}${ratingLte}${yearGte}${yearLte}`
    );
    const data = await response.json();
    return data.results; // Возвращаем массив фильмов
  } catch (error) {
    console.error('Ошибка при получении фильмов:', error);
    return [];
  }
};

export const fetchMovieDetailsFromApi = async (movieId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ru-RU`
    );
    const data = await response.json();
    return data; // Возвращаем объект с деталями фильма
  } catch (error) {
    console.error('Ошибка при получении деталей фильма:', error);
    return null;
  }
};

// utils/favorites.js
export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem('favoriteMovies');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Ошибка при получении избранных фильмов:', error);
    return [];
  }
};

export const saveFavorites = (movies) => {
  try {
    localStorage.setItem('favoriteMovies', JSON.stringify(movies));
  } catch (error) {
    console.error('Ошибка при сохранении избранных фильмов:', error);
  }
};
