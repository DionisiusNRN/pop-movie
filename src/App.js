import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt15398776",
    Title: "Oppenheimer",
    Year: "2013",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt1517268",
    Title: "Barbie",
    Year: "2023",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
  },
  {
    imdbID: "tt8589698",
    Title: "Teenage Mutant Ninja Turtles: Mutant Mayhem",
    Year: "2023",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYzE4MTllZTktMTIyZS00Yzg1LTg1YzAtMWQwZTZkNjNkODNjXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt15398776",
    Title: "Oppenheimer",
    Year: "2013",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg",
    runtime: 180,
    imdbRating: 8.6,
    userRating: 10,
  },
  {
    imdbID: "tt1517268",
    Title: "Barbie",
    Year: "2023",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
    runtime: 114,
    imdbRating: 7.2,
    userRating: 8,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Logo() {
  return (
    <div className="logo">
      <span role="img">🎫</span>
      <h1>Movie</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function MovieItem({ movie, onSelectedMovieId }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectedMovieId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📅</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieList({ movies, onSelectedMovieId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie, index) => (
        <MovieItem
          key={index}
          movie={movie}
          onSelectedMovieId={onSelectedMovieId}
        />
      ))}
    </ul>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>🎬</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.trunc(avgRuntime)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedItem({ movie, onDeleteWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>🎬</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          x
        </button>
      </div>
    </li>
  );
}

function WatchedList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie, index) => (
        <WatchedItem
          key={index}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function BoxMovies({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const isWatched = watched.some((movie) => movie.imdbID == selectedId);
  const userRatingWatched = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Released: released,
    Poster: poster,
    imdbRating,
    Runtime: runtime,
    Plot: plot,
    Genre: genre,
    Actors: actors,
    Director: director,
  } = movie;

  function handleAddWatched() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: Number(userRating),
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}` // i digunakan untuk menunjukkan identitas atau id
      );
      const data = await response.json();
      setMovie(data);
      setIsLoading(false);
    }

    getMovieDetails();
  }, [selectedId]); // yang menjadikan perubahnnya adalah propsnya

  useEffect(() => {
    if (!title) return; // kalau beluj ada data title, tidal perlu ditampilkan
    document.title = `PopMovie | ${title}`;

    return function () {
      document.title = "PopMovie"; // jika close dari movie maka akan kembali ke page PopMovie
      console.log(`clean up title ${title}`);
    };
  }, [title]); // masukkan props supaya ada perubahan setiap propsnya dipanggil

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &#x2715;
            </button>
            <img src={poster} alt={`${title} poster`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                <span>📅</span>
                <span>{released}</span>
              </p>
              <p>
                <span>⌛</span>
                <span>{runtime}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{imdbRating}</span>
              </p>
            </div>
          </header>
          <section>
            <p>
              <em>{plot}</em>
            </p>
            <p>Genre: {genre}</p>
            <p>Starring: {actors}</p>
            <p>DIrector by {director}</p>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    max={10}
                    size={24}
                    color="#fcc419"
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && ( // jika rating tidak diisi maka add to watched tidak akan muncul
                    <button className="btn-add" onClick={handleAddWatched}>
                      + Add to Watched
                    </button>
                  )}
                </>
              ) : (
                <p>you have watched with rating of {userRatingWatched} / 10</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Loader() {
  return (
    <div className="loader">
      <div className="loading-bar">
        <div className="bar"></div>
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="error">
      <span>⚠️</span> {message}
    </div>
  );
}

const API_KEY = "c93ea82d";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("barbie");
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  function handleSelectedMovieId(id) {
    setSelectedMovieId((selectedId) => (selectedId === id ? null : id));
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  function handleCloseMovie() {
    setSelectedMovieId(null);
  }

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovie() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `http://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`,
          { signal: controller.signal } // utk trigger proses abort
        );

        if (!res.ok) throw new Error("Something went wrong");

        const data = await res.json();

        if (data.Response === "False") throw new Error(data.Error);

        setMovies(data.Search);
        setError(""); // supaya tidak perlu menampilkan pesan error disetiap fetch, hanya ketika abort sudah selesai
      } catch (err) {
        if (err.name === "AbortError") return; // supaya tdk perlu menampilkan pesan abort request
        setError(err.message);
      } finally {
        // mau programnya jalan atau enggak, kita akan tetap menjalankan code berikut
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovie();
    return function () {
      // utk memberhentikan trigger abort
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <BoxMovies>
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onSelectedMovieId={handleSelectedMovieId}
            />
          )}
        </BoxMovies>
        <BoxMovies>
          {selectedMovieId ? (
            <MovieDetails
              selectedId={selectedMovieId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </BoxMovies>
      </Main>
    </>
  );
}

// // contoh lain memanggil props
// kalau pakai props element, functionnya harus pakai props children
// {
//   /* <Main>
//   <BoxMovies element={<MovieList movies={movies} />} />
//   <BoxMovies
//     element={
//       <>
//         <WatchedSummary watched={watched} />
//         <WatchedList watched={watched} />
//       </>
//     }
//   />
// </Main> */
// }
