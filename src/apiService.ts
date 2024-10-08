import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
  throw new Error(
    "REACT_APP_TMDB_API_KEY is not defined. Please set it in your .env file."
  );
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});
// ... rest of your code remains the same

export const fetchPopularMovies = async () => {
  try {
    const response = await axiosInstance.get("/movie/popular");
    return response.data;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

export const fetchTopRatedMovies = async () => {
  try {
    const response = await axiosInstance.get("/movie/top_rated");
    return response.data;
  } catch (error) {
    console.error("Error fetching top-rated movies:", error);
    throw error;
  }
};

export const fetchTrendingMovies = async (timeWindow = "week") => {
  try {
    const response = await axiosInstance.get(`/trending/movie/${timeWindow}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};

export const fetchGenres = async () => {
  try {
    const response = await axiosInstance.get("/genre/movie/list");
    return response.data.genres; // This will be an array of { id, name }
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

export const fetchPopularSeries = async () => {
  try {
    const response = await axiosInstance.get("/tv/popular");
    return response.data;
  } catch (error) {
    console.error("Error fetching popular series:", error);
    throw error;
  }
};

export const fetchTopRatedSeries = async () => {
  try {
    const response = await axiosInstance.get("/tv/top_rated");
    return response.data;
  } catch (error) {
    console.error("Error fetching top-rated series:", error);
    throw error;
  }
};
