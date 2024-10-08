import React from "react";

// Define the BaseMovie type
interface BaseMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  backdrop_path?: string; // Optional if it might be missing
}

interface MovieModalProps {
  movie: BaseMovie;
  open: boolean;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, open, onClose }) => {
  if (!open) return null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : null; // Handle missing backdrop

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white text-black rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
        {/* Movie Backdrop */}
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-auto object-cover rounded-md mb-4"
          />
        )}

        {/* Movie Title */}
        <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>

        {/* Overview */}
        <p className="mb-4">{movie.overview}</p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MovieModal;
