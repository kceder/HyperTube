import React from 'react'
import { Link } from 'react-router-dom'
import MovieCard from './movie-card'

const dummy_query = {
  title: 'gone with the wind', // testing
  genres: ['action'],
  IMdbRating: 2,
  prodYearLo: 1999,
  prodYearHi: 2017
}

function MovieList(props) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [movieList, setMovieList] = React.useState([])
  const [query, setQuery] = React.useState({
    title: '',
    genres: [],
    imdbRating: '',
    prodYearLow: '',
    prodYearHi: ''
  })

  async function fetchMovies(cb) {
    setIsLoading(true)
    const response = await fetch('/api/movies?' + new URLSearchParams(dummy_query)) // use dummy_query for now
    const data = await response.json()
    console.log(data) // testing
    // Once the data is ready, we invoke our callback function with it.
    cb(data) // push new movies to state, or replace state altogether with data
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchMovies((data) => setMovieList(data.movies))
  }, [])

  return (
  <div className='text-white max-w-4xl mx-auto pt-10 pb-20 px-2'>
    <ul className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      {!isLoading && movieList.length > 0 && movieList.map(movie => {
        return (<li key={movie.imdbId} className='col-span-1'>
          <Link
            to={`movie/${movie.imdbId}`}
            state={{movie}}
          >
            <MovieCard movie={movie} />
          </Link>
        </li>)
      })}
    </ul>

    {isLoading && <p className='text-white text-center text-2xl pt-20'>
      spinner goes here...
    </p>}
  </div>
  )
}
export default MovieList