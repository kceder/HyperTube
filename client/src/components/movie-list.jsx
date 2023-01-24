import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Link } from 'react-router-dom'
import MovieMiniCard from './movie-mini-card'
import SideBar from './sidebar'

// Redux
import { useSelector } from 'react-redux'

// homemade i18n
import t from '../i18n/i18n'

function MovieList(props) {
  const { activeLanguage } = useSelector(slices => slices.language)  // redux

  const [isVisible, setIsVisible] = React.useState(false) // Sidebar
  const [isLoading, setIsLoading] = React.useState(false)
  const [movieList, setMovieList] = React.useState([])
  const [error, setError] = React.useState('')
  
  /** States for the query */
  const [pageNumber, setPageNumber] = React.useState(1)
  const [minImdbRating, setMinImdbRating] = React.useState(0)
  const [genre, setGenre] = React.useState(null)
  const [queryTerm, setQueryTerm] = React.useState(null)
  const [sortBy, setSortBy] = React.useState(null)
  const [orderBy, setOrderBy] = React.useState(null)

  /* 'hasMore' will be set to 'true' during the first request (assuming
    there are movies) and to 'false' when the request returns no movies. */
  const [hasMore, setHasMore] = React.useState(false)

  async function fetchMovies() {
    try {
      setError(null)
      setIsLoading(true)
      const response = await fetch('/api/movies?' + new URLSearchParams({
        page:           pageNumber,
        minimum_rating: minImdbRating,
        genre:          genre?.value ?? null,
        query_term:     queryTerm,
        sort_by:        sortBy?.value ?? null,
        order_by:       orderBy?.value ?? null
      }))
      const data = await response.json()
	  console.log('46', data)
  
      if (data.error === 'no movies found') {
        setError(t(activeLanguage, 'movieListPage.noMoviesFound')) // ADD TRANSLATION HERE
        setIsLoading(false)
        return console.log(data.error)
      }

      /* If we receive less than 20 movies, the 'hasMore' state is set to false. */
      setHasMore(data.movies.length > 19)
    
      // Once the data is ready, we invoke our callback function with it.
      // setMovieList(prev => [...prev, ...data.movies])
      if (pageNumber === 1)
        setMovieList(data.movies)
      else
        setMovieList(prev => [...[...prev, ...data.movies].filter((v,i,a) => a.findIndex(v2 => (v2.imdbId === v.imdbId)) === i)])
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchMovies()
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
          // console.log('hasMore? ', hasMore)
          // If the last movie is visible and hasMore is true
          if (entries[0].isIntersecting && hasMore) {
            // console.log('You hit end of page', pageNumber) // testing
            /* Here we'd increment our page number, which will trigger the 
            callback in useEffect to make a new request for more stations. */
            setPageNumber((curr) => curr + 1)
            // console.log('in useCallback, pageNumber has been set to', pageNumber + 1);
            observer.current.disconnect()
          }
        },
        { threshold: 0.5 }
      )
      // If the component has been rendered, let's observe it
      if (component) observer.current.observe(component)
    }, [isLoading])

  // This function will be triggered by clicking on the 'Submit Filter' button.
  function submitQuery() {
    setPageNumber(1)
    fetchMovies()
    setIsVisible(prev => !prev)
  }

  return (<>
    <SideBar
      isVisible={isVisible}
      clickHandler={() => setIsVisible(prev => !prev)}
      minImdbRating={minImdbRating}
      setMinImdbRating={setMinImdbRating}
      genre={genre}
      setGenre={setGenre}
      queryTerm={queryTerm}
      setQueryTerm={setQueryTerm}
      submitQuery={submitQuery}
      sortBy={sortBy}
      setSortBy={setSortBy}
      orderBy={orderBy}
      setOrderBy={setOrderBy}
      setPageNumber={setPageNumber}
    />

    <div className={`text-white mx-auto pb-20 px-2`}>
      {/* The paragraph below toggles the Advanced Search side-bar */}
      <p onClick={() => setIsVisible(true)} className='text-white cursor-pointer text-center py-4 hover:scale-105'>
        <MagnifyingGlassIcon className='inline w-6'/>
        <span className='ml-3 capitalize'>
          {t(activeLanguage, 'movieListPage.advancedSearch')}
        </span>
      </p>

      {/* List of Movies */}
      {error ? 
        <p className='text-white text-2xl text-center capitalize'>{error}</p>
      :
        <ul className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {movieList.length > 0 && movieList.map((movie, idx) => {
            if (idx === movieList.length - 1) { // <== Last Movie
              return (<li key={`${movie.imdbId}${idx}`} ref={lastMovie} className='col-span-1'>
                <Link
                  to={`movies/${movie.imdbId}`}
                  state={{movie}}
                >
                  <MovieMiniCard movie={movie} />
                </Link>
              </li>)
            } else {
              return (<li key={`movie.imdbId ${idx}`} className='col-span-1'>
                <Link
                  to={`movies/${movie.imdbId}`}
                  state={{movie}}
                >
                  <MovieMiniCard movie={movie} />
                </Link>
              </li>)
            }
          })}
        </ul>}

      {!isLoading && !error && !hasMore && <p className='text-white text-center text-2xl pt-20'>
        {t(activeLanguage, 'movieListPage.noMoreMovies')}
      </p>}

      {isLoading && <p className='text-white text-center text-2xl pt-20'>
        <ArrowPathIcon className='inline w-8 animate-spin'/>
      </p>}
    </div>
  </>)
}
export default MovieList