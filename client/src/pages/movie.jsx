import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import ReactPlayer from 'react-player'

function MoviePage() {
  const { activeLanguage } = useSelector(slices => slices.language)
  const [ isLoading, setIsloading ] = React.useState(null)
  const [ movie, setMovie ] = React.useState(null)

  // Protected route: redirect to home page if user's not logged in
  // DISABLE IT DURING DEVELOPMENT!!
  // const navigate = useNavigate()
  // const { isLoggedIn } = useSelector(slices => slices.auth)

  // React.useEffect(() => {
  //   if (!isLoggedIn) navigate('/', { replace: true })
  // }, [isLoggedIn])

  const location = useLocation() // needed to parse the imdb id from React URL

  console.log(location.pathname) // testing
  const imdbId = location.pathname.split('/').pop()

  React.useEffect(() => {
    const url = '/api' + location.pathname

    console.log(imdbId)
    async function fetchMovie() {
      const response = await fetch(url + '?' + new URLSearchParams({
        language: activeLanguage
      }))

      const data = await response.json()
      setMovie(data)
      console.log(data)
    }

    fetchMovie()
  }, [])

  // make api request to get all the imdb info, and video stuff
  return (
    <div className='text-white max-w-4xl mx-auto pt-10 pb-20 px-2'>
      {!isLoading && movie && <>
        <h1 className='text-2xl text-white'>{movie.title}</h1>
        <p className='text-xl text-white'>{movie.year}</p>
      </>}
      <ReactPlayer url={`/api/streams/${imdbId}`} config={
        {}
      } controls={true}/>

      {isLoading && <p className='text-white text-center text-2xl pt-20'>
        <ArrowPathIcon className='inline w-8 animate-spin'/>
      </p>}
    </div>)
}

export default MoviePage
