import React, { useState, useEffect } from "react";
import { fetchPopularMovies } from "../../apiService"; // Ensure fetchPopularMovies is correctly implemented

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[]; // Assuming the API provides genre IDs
};

const PopularMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1); // State to keep track of the current page

  useEffect(() => {
    const getMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch popular movies
        const moviesData = await fetchPopularMovies();

        console.log("Full Movies Data:", moviesData); // Log the entire data structure
        console.log("Movies Results:", moviesData?.results); // Log the results array

        // Ensure the data has the expected structure
        if (!moviesData || !Array.isArray(moviesData.results)) {
          throw new Error("Invalid movies data structure");
        }

        setMovies(moviesData.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to fetch popular movies.");
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, []); // No dependency on page since pagination is handled client-side

  // Handlers for next and previous page
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  // Logic to display only a limited number of movies per page
  const moviesPerPage = 6; // 3 movies per row × 2 rows
  const startIndex = (page - 1) * moviesPerPage;
  const displayedMovies = movies.slice(startIndex, startIndex + moviesPerPage);

  return (
    <div className="bg-black text-white py-8">
      <div className="px-8 mb-6">
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold mb-2 tracking-wide">
          Popular Movies
        </h2>
        <p className="text-gray-400 text-sm">
          Discover the most popular movies right now.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-500 mb-4">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl animate-pulse">Loading...</div>
        </div>
      ) : (
        <>
          {/* Movies Grid */}
          {displayedMovies.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-400">No movies available to display.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-8">
              {displayedMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => {
                    // Handle movie click, e.g., open modal
                    console.log("Movie clicked:", movie); // Log the clicked movie details
                  }}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-lg font-semibold mb-1">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-gray-300">
                      Release: {movie.release_date}
                    </p>
                    <div className="flex items-center mt-2">
                      <svg
                        className="w-5 h-5 text-yellow-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.978a1 1 0 00.95.69h4.19c.969 0 1.371 1.24.588 1.81l-3.396 2.47a1 1 0 00-.364 1.118l1.287 3.979c.3.921-.755 1.688-1.538 1.118l-3.396-2.47a1 1 0 00-1.175 0l-3.396 2.47c-.783.57-1.838-.197-1.538-1.118l1.287-3.979a1 1 0 00-.364-1.118L2.098 9.405c-.783-.57-.38-1.81.588-1.81h4.19a1 1 0 00.95-.69l1.286-3.978z" />
                      </svg>
                      <span className="text-sm text-yellow-400">
                        {movie.vote_average}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {movies.length > moviesPerPage && (
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`px-4 py-2 rounded-full text-white ${
                  page === 1
                    ? "bg-grey-800 cursor-not-allowed"
                    : "bg-grey-800 hover:bg-blue-600 transition-colors"
                }`}
              >
                Previous
              </button>
              <span className="text-gray-400">Page {page}</span>
              <button
                onClick={handleNextPage}
                disabled={startIndex + moviesPerPage >= movies.length}
                className={`px-4 py-2 rounded-full text-white ${
                  startIndex + moviesPerPage >= movies.length
                    ? "bg-grey-800 cursor-not-allowed"
                    : "bg-grey-800 hover:bg-blue-600 transition-colors"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PopularMovies;
