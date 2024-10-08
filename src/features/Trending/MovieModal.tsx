// MovieModal.tsx

import React, { useEffect, useState } from "react";
import { Box, Typography, Dialog, IconButton } from "@mui/material";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

if (!API_KEY) {
  throw new Error(
    "REACT_APP_TMDB_API_KEY is not defined. Please set it in your .env file."
  );
}

type Genre = {
  id: number;
  name: string;
};

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genres?: Genre[];
  adult?: boolean;
};

type Video = {
  key: string;
  site: string;
  type: string;
};

interface MovieModalProps {
  movie: Movie;
  open: boolean;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, open, onClose }) => {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [movieDetails, setMovieDetails] = useState<Movie>(movie);

  useEffect(() => {
    const fetchTrailerAndDetails = async () => {
      try {
        // Fetch trailer
        const trailerResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
        );
        const trailerData = await trailerResponse.json();
        const trailer = trailerData.results.find(
          (video: Video) => video.type === "Trailer" && video.site === "YouTube"
        );

        setTrailerUrl(
          trailer ? `https://www.youtube.com/embed/${trailer.key}` : ""
        );

        // Fetch full movie details
        const detailsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`
        );
        const detailsData = await detailsResponse.json();
        setMovieDetails(detailsData);
      } catch (error) {
        console.error("Failed to fetch trailer or movie details", error);
      }
    };

    if (movie) {
      fetchTrailerAndDetails();
    }
  }, [movie]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "#181818",
          borderRadius: "15px",
          overflow: "hidden",
        },
      }}
    >
      {/* Close Icon */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: "16px",
          right: "16px",
          color: "#fff",
          zIndex: 1,
        }}
      >
        ✕
      </IconButton>

      {/* Trailer Video or Fallback Image */}
      {trailerUrl ? (
        <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
          <iframe
            src={`${trailerUrl}?autoplay=1&mute=1`}
            title={movie.title}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          ></iframe>
        </Box>
      ) : (
        // Fallback Image
        <Box
          component="img"
          src={
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/w780/${movie.backdrop_path}`
              : "fallback_image_url"
          }
          alt={movie.title}
          sx={{
            width: "100%",
            height: { xs: "300px", sm: "400px", md: "500px" },
            objectFit: "cover",
            filter: "brightness(50%)",
          }}
        />
      )}

      {/* Movie Details */}
      <Box sx={{ padding: { xs: "16px", md: "24px" }, color: "#fff" }}>
        {/* Movie Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            marginBottom: { xs: "12px", md: "16px" },
            fontSize: { xs: "1.5rem", md: "2.5rem" },
          }}
        >
          {movieDetails.title}
        </Typography>

        {/* Movie Info Badges */}
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          {/* Release Year */}
          <Box
            sx={{
              padding: "4px 12px",
              backgroundColor: "#333",
              borderRadius: "5px",
            }}
          >
            {new Date(movieDetails.release_date).getFullYear()}
          </Box>
          {/* Age Rating */}
          <Box
            sx={{
              padding: "4px 12px",
              backgroundColor: "#333",
              borderRadius: "5px",
            }}
          >
            {movieDetails.adult ? "18+" : "PG"}
          </Box>
        </Box>

        {/* Movie Genres */}
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          {movieDetails.genres?.map((genre: Genre) => (
            <Box
              key={genre.id}
              sx={{
                padding: "4px 12px",
                backgroundColor: "#333",
                borderRadius: "5px",
              }}
            >
              {genre.name}
            </Box>
          ))}
        </Box>

        {/* Overview */}
        <Typography
          variant="body1"
          sx={{
            textAlign: "left",
            lineHeight: "1.7",
            fontSize: { xs: "0.9rem", md: "1rem" },
            marginBottom: "24px",
          }}
        >
          {movieDetails.overview}
        </Typography>
      </Box>
    </Dialog>
  );
};

export default MovieModal;
