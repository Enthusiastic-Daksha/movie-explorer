import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useParams } from "react-router-dom";
import "./App.css";

const featuredMovies = [
  { title: "Zootopia", category: "Adventure", rating: "8.0" },
  { title: "Toy Story 2", category: "Comedy", rating: "7.9" },
  { title: "Up", category: "Adventure", rating: "8.3" },
  { title: "Finding Nemo", category: "Family", rating: "8.2" },
  { title: "Moana", category: "Fantasy", rating: "7.6" }
];

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    async function loadMovies() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("https://api.sampleapis.com/movies/animation");
        if (!response.ok) throw new Error("Movie data could not be loaded.");

        const data = await response.json();
        const selectedMovies = data
          .filter((movie) => featuredMovies.some((featured) => featured.title === movie.title))
          .sort((first, second) => featuredMovies.findIndex((featured) => featured.title === first.title) - featuredMovies.findIndex((featured) => featured.title === second.title))
          .slice(0, 5)
          .map((movie) => {
            const featured = featuredMovies.find((item) => item.title === movie.title);
            return {
              ...movie,
              id: movie.imdbId || `animation-${movie.id}`,
              category: featured.category,
              poster: movie.posterURL || movie.poster || "",
              rating: featured.rating
            };
          });

        if (!isCurrent) return;
        if (selectedMovies.length === 0) {
          setError("We couldn't load movies right now. Check your connection and try again.");
        } else {
          setMovies(selectedMovies);
        }
      } catch {
        if (isCurrent) setError("We couldn't load movies right now. Check your connection and try again.");
      }

      if (isCurrent) setLoading(false);
    }

    loadMovies();
    return () => {
      isCurrent = false;
    };
  }, [retry]);

  return (
    <BrowserRouter>
      <div className="app">
        <header className="navbar">
          <Link className="logo" to="/">CineVerse</Link>
          <span>Animated movies</span>
        </header>

        <Routes>
          <Route
            path="/"
            element={<MovieCatalog movies={movies} loading={loading} error={error} onRetry={() => setRetry((value) => value + 1)} />}
          />
          <Route path="/movie/:movieId" element={<MovieDetails movies={movies} loading={loading} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer>Movie data from SampleAPIs</footer>
      </div>
    </BrowserRouter>
  );
}

function MovieCatalog({ movies, loading, error, onRetry }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(movies.map((movie) => movie.category))];
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(search.trim().toLowerCase());
    return matchesSearch && (category === "All" || movie.category === category);
  });

  return (
    <main className="main-content">
      <div className="section-heading">
        <div>
          <h1>Animated movies</h1>
          <p>Five films to explore.</p>
        </div>
        {!loading && !error && <span>{filteredMovies.length} movies</span>}
      </div>

      <label className="search-box">
        <span>Search</span>
        <input
          type="search"
          placeholder="Search by title"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>

      <label className="category-filter">
        <span>Category</span>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>

      {loading ? (
        <div className="status-state" role="status">Loading movies...</div>
      ) : error ? (
        <div className="status-state" role="alert">
          <p>{error}</p>
          <button type="button" onClick={onRetry}>Try again</button>
        </div>
      ) : filteredMovies.length ? (
        <div className="movie-grid">
          {filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      ) : (
        <div className="status-state">No movies found. Try another title.</div>
      )}
    </main>
  );
}

function MovieCard({ movie }) {
  return (
    <Link className="movie-card" to={`/movie/${encodeURIComponent(movie.id)}`}>
      <div className="poster-container">
        <MoviePoster movie={movie} />
      </div>
      <div className="movie-info">
        <h2>{movie.title}</h2>
        <p>IMDb ★ {movie.rating}</p>
      </div>
    </Link>
  );
}

function MoviePoster({ movie }) {
  const [failed, setFailed] = useState(false);

  if (!movie.poster || failed) {
    return <div className="poster-placeholder">Poster unavailable</div>;
  }

  return (
    <img
      src={movie.poster}
      alt={`${movie.title} poster`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function MovieDetails({ movies, loading }) {
  const { movieId } = useParams();
  const movie = movies.find((item) => item.id === movieId);

  if (loading) return <main className="main-content status-state">Loading movie...</main>;
  if (!movie) return <NotFound />;

  return (
    <main className="main-content detail-page">
      <Link className="back-link" to="/">Back to movies</Link>
      <article className="detail-layout">
        <div className="detail-poster"><MoviePoster movie={movie} /></div>
        <div>
          <p>{movie.category}</p>
          <h1>{movie.title}</h1>
          <p>IMDb rating: ★ {movie.rating}</p>
          <p>More information is available on IMDb.</p>
          {movie.imdbId && <a className="imdb-link" href={`https://www.imdb.com/title/${movie.imdbId}/`} target="_blank" rel="noreferrer">View on IMDb</a>}
        </div>
      </article>
    </main>
  );
}

function NotFound() {
  return (
    <main className="main-content status-state">
      <p>Movie not found.</p>
      <Link className="back-link" to="/">Back to movies</Link>
    </main>
  );
}

export default App;
