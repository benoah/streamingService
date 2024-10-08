import React, { useState, useEffect, useRef } from "react";
import { fetchGenres, fetchTrendingMovies } from "../../apiService";
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

const Trending = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeWindow, setTimeWindow] = useState<"day" | "week">("week");
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container
  const switchRef = useRef<HTMLDivElement>(null); // Ref for the switch

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

  // Function to fetch movies
  const getMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTrendingMovies(timeWindow);
      setMovies(data.results);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      setError("Failed to fetch trending movies.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch movies whenever the timeWindow changes
  useEffect(() => {
    getMovies();
  }, [timeWindow]);

  // Function to handle dragging the switch
  const handleDrag = (
    e: React.MouseEvent<Element> | React.TouchEvent<Element>
  ) => {
    const switchElement = switchRef.current;
    if (switchElement) {
      const switchWidth = switchElement.offsetWidth;
      const boundingRect = switchElement.getBoundingClientRect();
      const switchCenter = boundingRect.left + switchWidth / 2;

      let clientX: number;

      if ("touches" in e) {
        // It's a touch event
        clientX = e.touches[0].clientX;
      } else {
        // It's a mouse event
        clientX = e.clientX;
      }

      if (clientX < switchCenter) {
        setTimeWindow("day");
      } else {
        setTimeWindow("week");
      }
    }
  };

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

  // Function to open the movie modal
  const openModal = (movie: Movie) => setSelectedMovie(movie);

  // Function to close the movie modal
  const closeModal = () => setSelectedMovie(null);

  // Create a map of genre IDs to genre names for easy lookup
  const genreMap = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as { [key: number]: string });

  return (
    <div className="bg-black text-white py-8">
      <div className="px-8 mb-6">
        {/* Section Title */}
        <h4 className="text-3xl font-bold text-white mb-4">Trending Movies</h4>

        {/* Modern Switch Component - Left aligned under the title */}
        <div className="flex flex-col items-start">
          <div
            className="relative w-72 h-12 bg-gray-800 rounded-full flex p-1 shadow-lg"
            ref={switchRef}
            onMouseMove={handleDrag}
            onTouchMove={handleDrag}
          >
            <div
              className={`absolute h-10 w-36 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full shadow-lg transition-transform duration-300 ease-in-out transform ${
                timeWindow === "week" ? "translate-x-full" : ""
              }`}
            />
            <button
              className={`flex-1 text-center text-lg font-medium px-4 py-2 rounded-full z-10 transition-colors duration-300 ${
                timeWindow === "day"
                  ? "text-white font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setTimeWindow("day")}
            >
              Today
            </button>
            <button
              className={`flex-1 text-center text-lg font-medium px-4 py-2 rounded-full z-10 transition-colors duration-300 ${
                timeWindow === "week"
                  ? "text-white font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setTimeWindow("week")}
            >
              This Week
            </button>
          </div>
        </div>
      </div>

      {/* Error Message with Retry Button */}
      {error && (
        <div className="text-center text-red-500 mb-4">
          <p>{error}</p>
          <button
            onClick={getMovies}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Movie Carousel */}
      <div className="relative group">
        {/* Scroll Left Button */}
        <button
          onClick={scrollLeft}
          aria-label="Scroll Left"
          className="absolute top-1/2 left-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity bg-black/50 rounded-full p-2"
        >
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
          className="absolute top-1/2 right-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity bg-black/50 rounded-full p-2"
        >
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
          className="flex overflow-hidden scrollbar-hide space-x-4 px-8 py-4 snap-x snap-mandatory scroll-smooth"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] animate-pulse"
                >
                  <div className="bg-gray-700 h-[360px] w-full rounded-md"></div>
                  <div className="mt-2 h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="mt-2 h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="mt-2 h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
              ))
            : movies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => openModal(movie)}
                  className="cursor-pointer snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] transform transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-full h-auto object-cover rounded-md"
                  />
                  <h3 className="mt-2 text-lg font-semibold">{movie.title}</h3>
                  <p className="text-sm text-gray-400">{movie.release_date}</p>
                  <p className="text-sm text-yellow-500">
                    Rating: {movie.vote_average}
                  </p>
                  <p className="text-sm text-gray-400">
                    Genres:{" "}
                    {movie.genre_ids
                      .map((id) => genreMap[id])
                      .filter(Boolean)
                      .join(", ")}
                  </p>
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

export default Trending;
