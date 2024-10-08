import React, { useState, useEffect } from "react";
import { fetchTopRatedSeries, fetchPopularSeries } from "../../apiService";

type Series = {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
};

const TopRatedSeries = () => {
  const [series, setSeries] = useState<Series[]>([]);

  useEffect(() => {
    const getSeries = async () => {
      try {
        const data = await fetchTopRatedSeries();
        console.log(data); // Log the fetched data
        setSeries(data.results); // Set the series data to state
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };

    getSeries();
  }, []);

  return (
    <div>
      <h2>Top Rated Series</h2>
      <div className="series-grid">
        {series.map((item) => {
          console.log("Mapping over series:", item);
          return <div key={item.id}>{item.name}</div>;
        })}
      </div>
    </div>
  );
};

const PopularSeries = () => {
  const [series, setSeries] = useState<Series[]>([]);

  useEffect(() => {
    const getSeries = async () => {
      try {
        const data = await fetchPopularSeries();
        console.log(data); // Log the fetched data
        setSeries(data.results); // Set the series data to state
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };

    getSeries();
  }, []);

  return (
    <div>
      <h2>Popular Series</h2>
      <div className="series-grid">
        {series.map((item) => {
          console.log("Mapping over series:", item);
          return <div key={item.id}>{item.name}</div>;
        })}
      </div>
    </div>
  );
};

export { TopRatedSeries, PopularSeries };
