import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import ReactPlayer from 'react-player'
import CommentSection from '../components/comment-section'

// homemade i18n
import t from '../i18n/i18n'

function MoviePage() {
  const { activeLanguage } = useSelector(slices => slices.language)
  const [ isLoading, setIsloading ] = React.useState(null)
  const [ movie, setMovie ] = React.useState(null)
  const [ subtitles, setSubtitles ] = React.useState(null)
  const location = useLocation() // needed to parse the imdb id from React URL

  const { torrents } = location.state.movie
  /* Here we should write code to select the default quality (smaller better):
    1. Try 720p
    2. If not found then 1080p
    3. If not found either, the quality of the first torrent.
  */
  const qualities = torrents.map(t => ({ quality: t.quality, hash: t.hash }))
  let smallerQuality = qualities.find(q => q.quality === '720p')
  if (!smallerQuality)
    smallerQuality = qualities.find(q => q.quality === '1080p')
  // console.log(smallerQuality) // test it
  const [ quality, setQuality ] = React.useState(smallerQuality || qualities[0])
  // console.log(quality)
  // get the array of torrents (include several qualities)

  // Protected route: redirect to home page if user's not logged in
  // DISABLE IT DURING DEVELOPMENT!!
  // const navigate = useNavigate()
  // const { isLoggedIn } = useSelector(slices => slices.auth)

  // React.useEffect(() => {
  //   if (!isLoggedIn) navigate('/', { replace: true })
  // }, [isLoggedIn])

  // console.log(location.pathname) // testing
  const imdbId = location.pathname.split('/').pop()

  React.useEffect(() => {
    const url = '/api' + location.pathname
    
    // console.log(imdbId)
    async function fetchMovie() {
      const response = await fetch(url + '?' + new URLSearchParams({
        language: activeLanguage,
        hash:     quality.hash,
        quality:  quality.quality
      }))
      
      const data = await response.json()
      setMovie(data)
      // console.log(data)
    }
    
    fetchMovie()
  }, [])

  React.useEffect(() => {
    if (movie === null) return
    const url = '/api/subtitles/' + imdbId
    
    async function fetchSubtitles() {
      const response = await fetch(url + '?' + new URLSearchParams({
        language: activeLanguage
      }))
      
      const data = await response.json()
      console.log(data)
      setSubtitles(data)
    }
    
    fetchSubtitles()
  }, [movie])

  // make api request to get all the imdb info, and video stuff
  return (
    <div className='text-white max-w-4xl min-w-[360px] md:w-4xl md:px-0 px-3 pt-10 flex flex-col space-y-6'>
      {!isLoading && movie && <>
        <h1 className='text-2xl text-white'>{movie.title}</h1>
        <p className='text-xl text-white'>{movie.year}</p>
      </>}

      <p>
        {t(activeLanguage, 'moviePage.chooseQuality')}
      </p>
      <ul>
        {qualities.map((q, idx) => (
          <li
            key={idx}
            className='text-white text-xl'
          >
            {q.quality}
          </li>
        ))}
      </ul>
      <div className='react-player-wrapper'>
        <ReactPlayer
          url={`/api/streams/${imdbId}/${quality.quality}/${quality.hash}`}
          config={{}}
          controls={true}
          className='react-player'
          width='100%'
          height='100%'
        />
      </div>

      {isLoading && <p className='text-white text-center text-2xl pt-20'>
        <ArrowPathIcon className='inline w-8 animate-spin'/>
      </p>}

      <CommentSection imdbId={imdbId} />
    </div>)
}

export default MoviePage
