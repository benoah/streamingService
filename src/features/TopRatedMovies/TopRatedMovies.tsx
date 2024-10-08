import React, { useState, useEffect, useRef } from "react";
import { fetchTopRatedMovies, fetchGenres } from "../../apiService";
import MovieModal from "./MovieModal";

// Define the Movie type
type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
};

const TopRatedMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null); // State for selected genre
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container

  // Fetch genres when the component mounts
  useEffect(() => {
    const getGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    getGenres();
  }, []);

  // Fetch top-rated movies
  const getMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTopRatedMovies();
      setMovies(data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to fetch top-rated movies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  const genreMap = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as { [key: number]: string });

  // Function to scroll left in the movie list
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 0,
        left: -Math.ceil(window.innerWidth / 1.5),
        behavior: "smooth",
      });
    }
  };

  // Function to scroll right in the movie list
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 0,
        left: Math.ceil(window.innerWidth / 1.5),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-black text-white py-8">
      {/* Movie Carousel */}
      <h4 className="text-3xl font-bold text-white mb-4 ml-8">
        Top Rated Movies
      </h4>

      {/* Genre Filter Dropdown */}
      <div className="mb-4 px-8">
        <select
          value={selectedGenreId ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedGenreId(value ? parseInt(value) : null);
          }}
          className="text-black px-2 py-1 rounded"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className="relative group">
        {/* Scroll Left Button */}
        <button
          onClick={scrollLeft}
          aria-label="Scroll Left"
          className="
            absolute top-1/2 left-2 z-10 -translate-y-1/2
            opacity-70 hover:opacity-100 transition-opacity
            bg-black/50 rounded-full p-2
          "
        >
          {/* Left Arrow Icon */}
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Scroll Right Button */}
        <button
          onClick={scrollRight}
          aria-label="Scroll Right"
          className="
            absolute top-1/2 right-2 z-10 -translate-y-1/2
            opacity-70 hover:opacity-100 transition-opacity
            bg-black/50 rounded-full p-2
          "
        >
          {/* Right Arrow Icon */}
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Movie List */}
        <div
          ref={scrollContainerRef}
          className="
            flex overflow-hidden scrollbar-hide space-x-4 px-8 py-4
            snap-x snap-mandatory scroll-smooth
          "
        >
          {/* Show skeleton loaders when loading */}
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="
                    snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px]
                    animate-pulse
                  "
                >
                  <div className="bg-gray-700 h-[360px] w-full rounded-md"></div>
                  <div className="mt-2 h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="mt-2 h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="mt-2 h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
              ))
            : movies
                .filter(
                  (movie) =>
                    selectedGenreId === null ||
                    movie.genre_ids.includes(selectedGenreId)
                )
                .map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => openModal(movie)}
                    className="
                      relative cursor-pointer snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px]
                      transform transition-transform duration-300 hover:scale-105
                      group
                    "
                  >
                    {/* Movie Poster */}
                    <img
                      src={
                        movie.backdrop_path
                          ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                          : "https://via.placeholder.com/500x750?text=No+Image"
                      }
                      alt={movie.title}
                      className="w-full h-auto object-cover rounded-md"
                    />
                    {/* Movie Info Overlay */}
                    <div
                      className="
                        absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-end
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        rounded-md p-4
                      "
                    >
                      {/* Movie Title */}
                      <h3 className="text-lg font-semibold">{movie.title}</h3>
                      {/* Release Date */}
                      <p className="text-sm text-gray-400">
                        {movie.release_date}
                      </p>
                      {/* Rating */}
                      <p className="text-sm text-yellow-500">
                        Rating: {movie.vote_average}
                      </p>
                      {/* Genres */}
                      <p className="text-sm text-gray-400">
                        Genres:{" "}
                        {movie.genre_ids
                          .map((id) => genreMap[id])
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
        </div>
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} open={true} onClose={closeModal} />
      )}
    </div>
  );
};

export default TopRatedMovies;
