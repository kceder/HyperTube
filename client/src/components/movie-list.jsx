import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Link } from 'react-router-dom'
import MovieCard from './movie-card'
import SideBar from './sidebar'

function MovieList(props) {
  const [isVisible, setIsVisible] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(false)
  const [movieList, setMovieList] = React.useState([])
  const [pageNumber, setPageNumber] = React.useState(1)

  // To Do: move query state into a custom hook
  // const [query, setQuery] = React.useState({
  //   title: '',
  //   genres: [],
  //   imdbRating: '',
  //   prodYearLow: '',
  //   prodYearHi: ''
  // })
  /** States for the query */
  const [minImdbRating, setMinImdbRating] = React.useState(0)
  const [genre, setGenre] = React.useState('All')

  /* 'hasMore' will be set to 'true' during the first request (assuming
    there are movies) and to 'false' when the request returns no movies. */
  const [hasMore, setHasMore] = React.useState(false)

  async function fetchMovies(cb) {
    setIsLoading(true)
    const response = await fetch('/api/movies?' + new URLSearchParams({
      page: pageNumber
    }))
    const data = await response.json()

    // If data is an empty array, the 'hasMore' state is set to false.
    setHasMore(data.movies.length > 0)
  
    console.log(data) // testing
    // Once the data is ready, we invoke our callback function with it.
    cb(data) // push new movies to state, or replace state altogether with data
    setIsLoading(false)
  }
  
  React.useEffect(() => {
    // The callback we're passing merge the new movies into the existing state.
    fetchMovies(data => setMovieList(prev => [...prev, ...data.movies]))
    // setMovieList((prev) => [...new Set([...prev, ...data.movies])]) // no need
    // (when we submit a filter, we can pass another callback that will replace
    // the movies in state with a new batch, compliant with the filter query)
  }, [pageNumber])

  // Infinite pagination
  const observer = React.useRef()
  const lastMovie = React.useCallback(
    (component) => {
      // If 'isLoading' is true, it means we're fetching data, so bail!
      if (isLoading) return
      // Disconnect previous observer
      if (observer.current) observer.current.disconnect()

      // Create new observer instance
      observer.current = new IntersectionObserver(
        (entries) => {
          // If the last movie is visible and hasMore is true
          if (entries[0].isIntersecting && hasMore) {
            console.log('You hit end of page', pageNumber) // testing
            /* Here we'd increment our page number, which will trigger the 
            callback in useEffect to make a new request for more stations. */
            setPageNumber((curr) => curr + 1)

            observer.current.disconnect()
          }
        },
        { threshold: 1 },
      )
      // If the component has been rendered, let's observe it
      if (component) observer.current.observe(component)
    }, [isLoading])

  function toggleSideBar() {
    console.log('clicked');
    setIsVisible(prev => !prev)
  }

  return (<>
    <SideBar
      isVisible={isVisible}
      clickHandler={toggleSideBar}
      minImdbRating={minImdbRating}
      setMinImdbRating={setMinImdbRating}
      genre={genre}
      setGenre={setGenre}
    />

    <div className={`text-white max-w-4xl mx-auto pb-20 px-2`}>
      {/* The paragraph below toggles the Advanced Search side-bar */}
      <p onClick={toggleSideBar} className='text-white cursor-pointer text-center py-4 hover:scale-110'>
        <MagnifyingGlassIcon className='inline w-6'/>
        <span className='ml-3 capitalize'>advanced search</span>
      </p>

      <ul className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {movieList.length > 0 && movieList.map((movie, idx) => {
          if (idx === movieList.length - 1) { // <== Last Movie
            return (<li key={`movie.imdbId ${idx}`} ref={lastMovie} className='col-span-1'>
              <Link
                to={`movie/${movie.imdbId}`}
                state={{movie}}
              >
                <MovieCard movie={movie} />
              </Link>
            </li>)
          } else {
            return (<li key={`movie.imdbId ${idx}`} className='col-span-1'>
              <Link
                to={`movie/${movie.imdbId}`}
                state={{movie}}
              >
                <MovieCard movie={movie} />
              </Link>
            </li>)
          }
        })}
      </ul>

      {isLoading && <p className='text-white text-center text-2xl pt-20'>
        spinner goes here...
      </p>}
    </div>
  </>)
}
export default MovieList