import React from "react";
import "./App.css";
import Navigation from "./components/Navigation/nav";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import PopularMovies from "./features/ PopularMovies/popularMovies";
import TopRatedMovies from "./features/TopRatedMovies/TopRatedMovies";
import Trending from "./features/Trending/Trending";
import { TopRatedSeries, PopularSeries } from "./features/TV/TopRatedSeries";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <div className="App">
      {/* Uncomment these when needed */}
      {/* <Header /> */}
      {/* <Navigation /> */}
      <ErrorBoundary>
        <ChakraProvider>
          <Trending />
        </ChakraProvider>

        <TopRatedMovies />
        <PopularMovies />

        {/* <TopRatedSeries /> */}
        {/* <PopularSeries /> */}
      </ErrorBoundary>
      <Footer />
    </div>
  );
}

export default App;
