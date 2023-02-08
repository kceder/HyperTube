import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import ReactPlayer from 'react-player'
import CommentSection from '../components/comment-section'
import Select from 'react-select'
import MovieCard from '../components/movie-card'
import { logIn } from '../store/authSlice'

// homemade i18n
import t from '../i18n/i18n'

function MoviePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector((slices) => slices.auth)
  const { accessToken } = useSelector((slices) => slices.auth)
  const { activeLanguage } = useSelector((slices) => slices.language)
  const [isLoading, setIsloading] = React.useState(true)
  const [movie, setMovie] = React.useState(null)
  const [comments, setComments] = React.useState(null)
  const location = useLocation() // needed to parse the imdb id from React URL
  const [selectedTorrent, setSelectedTorrent] = React.useState(null)
  const [config, setConfig] = React.useState(null)
  let torrentOptions
  React.useEffect(() => {
    if (location.state !== null) {
      const { torrents } = location.state.movie
      torrentOptions = torrents.map((t) => ({
        value: t.quality,
        label: t.quality,
        hash: t.hash,
      }))
    }
  }, [])

  React.useEffect(() => {
    if (location.state === null) navigate('/')
    const userData = window.localStorage.hypertube
    if (isLoggedIn) return
    else navigate('/')
  }, [])

  const imdbId = location.pathname.split('/').pop()
  React.useEffect(() => {
    /* Here we select the default quality (smaller better):
    1. Try 720p.
    2. If not found then 1080p.
    3. If not found either, the quality of the first torrent. */
    if (!isLoggedIn) return
    if (torrentOptions === undefined) return
    let smallestQuality = torrentOptions.find(
      (torrent) => torrent.value === '720p',
    )
    if (!smallestQuality) {
      smallestQuality = torrentOptions.find(
        (torrent) => torrent.value === '1080p',
      )
    }
    setSelectedTorrent(smallestQuality || torrentOptions[0])

    async function setAsWatched() {
      const response = await fetch(`/api/movies/${imdbId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
      }
    }
    setAsWatched()
  }, [torrentOptions, isLoggedIn])

  React.useEffect(() => {
    if (!selectedTorrent) return
    const urlSubs = '/api/subtitles/' + imdbId

    async function fetchSubtitles() {
      try {
        const response = await fetch(
          urlSubs +
            '?' +
            new URLSearchParams({
              language: activeLanguage,
            }),
        )
  
        if (response.ok) {
          const data = await response.json()
          const tracks = data.subtitles.map((st) => ({
            kind: 'subtitles',
            src: st.src, // the link to the sub file in our server.
            srcLang: st.srcLang,
            label: st.label,
            // default: true,
          }))
          setConfig({
            file: {
              attributes: {
                crossOrigin: 'true',
              },
              tracks: tracks,
            },
          })
        }
      } catch (error) {
        console.log(error)
      }
    } // fetchSubtitles

    fetchSubtitles()
  }, [selectedTorrent])

  React.useEffect(() => {
    if (!config) return // if the config is still not ready, bail
    const url = '/api' + location.pathname

    async function fetchMovie() {
      try {
        const response = await fetch(
          url +
            '?' +
            new URLSearchParams({
              language: activeLanguage,
              hash: selectedTorrent.hash,
              quality: selectedTorrent.quality,
            }),
        )
        if (response.ok) {
          const data = await response.json()
          setMovie(data.movie)
          setComments(data.comments)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchMovie()
    setIsloading(false)
  }, [config])

  // make api request to get all the imdb info, and video stuff
  return (
    <div className='max-w-4xl min-w-[360px] md:w-4xl md:px-0 px-3 flex flex-col space-y-10 md:pt-7'>
      {isLoading && (
        <ArrowPathIcon className='inline w-8 animate-spin'/>
      )}

      {!isLoading && (
        <div className='react-player-wrapper'>
          <ReactPlayer
            url={`/api/streams/${imdbId}/${selectedTorrent.value}/${selectedTorrent.hash}`}
            controls={true}
            className='react-player'
            width='100%'
            height='100%'
            config={config}
            autoPlay={true}
            muted={true}
          />
        </div>
      )}
      <div className='flex space-x-3 items-center h-3'>
        {/* <p className='text-white text-xl capitalize mb-3'>
          {t(activeLanguage, 'moviePage.chooseQuality')}
        </p> */}
        {/* <Select
          onChange={(e) => setSelectedTorrent(e)}
          options={torrentOptions}
          value={selectedTorrent}
          className='mb-2'
        /> */}
      </div>
      {!isLoading && movie && <MovieCard movie={movie} />}
      {!isLoading && comments &&
        <CommentSection
          comments={comments}
          setComments={setComments}
          imdbId={imdbId}
      />}

    </div>
  )
}

export default MoviePage
