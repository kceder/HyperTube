import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import ReactPlayer from 'react-player'
import CommentSection from '../components/comment-section'
import Select from 'react-select'

// homemade i18n
import t from '../i18n/i18n'

function MoviePage() {
  const { activeLanguage } = useSelector((slices) => slices.language)
  const [isLoading, setIsloading] = React.useState(true)
  const [movie, setMovie] = React.useState(null)
  const location = useLocation() // needed to parse the imdb id from React URL
  const [selectedTorrent, setSelectedTorrent] = React.useState(null)
  const [config, setConfig] = React.useState(null)
  const { torrents } = location.state.movie
  const torrentOptions = torrents.map((t) => ({
    value: t.quality,
    label: t.quality,
    hash: t.hash,
  }))

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
    /* Here we select the default quality (smaller better):
    1. Try 720p.
    2. If not found then 1080p.
    3. If not found either, the quality of the first torrent. */
    let smallestQuality = torrentOptions.find(
      (torrent) => torrent.value === '720p',
    )
    if (!smallestQuality) {
      smallestQuality = torrentOptions.find(
        (torrent) => torrent.value === '1080p',
      )
    }
    setSelectedTorrent(smallestQuality || torrentOptions[0])
  }, [])

  React.useEffect(() => {
    if (!selectedTorrent) return
    // setIsloading(true)

    const urlSubs = '/api/subtitles/' + imdbId

    async function fetchSubtitles() {
      const response = await fetch(
        urlSubs + '?' +
          new URLSearchParams({
            language: activeLanguage,
          }),
      )
      // console.log(response) // testing

      if (response.ok) {
        // console.log(data) // testing
        const data = await response.json()
        // console.log('subtitles ALL', data.allSubs) // testing

        const tracks = data.subtitles.map(st => ({
          kind: 'subtitles',
          src: st.src, // the link to the sub file in our server.
          srcLang: st.srcLang,
          label: st.label
          // default: true,
        }))
        // console.log('subs array:', tracks) // this is a link
        setConfig({
          file: {
            attributes: {
              crossOrigin: 'true',
            },
            tracks: tracks
          }
        })
      }
    } // fetchSubtitles

    fetchSubtitles()
  }, [selectedTorrent])

  React.useEffect(() => {
    if (!config) return // if the config is still not ready, bail
    const url = '/api' + location.pathname

    // console.log(imdbId)
    async function fetchMovie() {
      const response = await fetch(
        url +
          '?' +
          new URLSearchParams({
            language: activeLanguage,
            hash: selectedTorrent.hash,
            quality: selectedTorrent.quality,
          }),
      )
      const data = await response.json()
      setMovie(data)
      console.log(data)
    }

    fetchMovie()
    setIsloading(false)
  }, [config])

  // console.log('config:', config) // testing
  // make api request to get all the imdb info, and video stuff
  return (
    <div className='max-w-4xl min-w-[360px] md:w-4xl md:px-0 px-3 pt-10 flex flex-col space-y-6'>
      {!isLoading && movie && (
        <>
          <h1 className='text-2xl text-white'>
            {movie.title} ({movie.year})
          </h1>
        </>
      )}

      <div>
        <p className='text-white text-xl capitalize mb-3'>
          {t(activeLanguage, 'moviePage.chooseQuality')}
        </p>
        <Select
          onChange={(e) => setSelectedTorrent(e)}
          options={torrentOptions}
          value={selectedTorrent}
        />
      </div>

      {!isLoading && (
        <div className='react-player-wrapper'>
          <ReactPlayer
            url={`/api/streams/${imdbId}/${selectedTorrent.value}/${selectedTorrent.hash}`}
            controls={true}
            className='react-player'
            width='100%'
            height='100%'
            config={config}
          />
        </div>
      )}

      <CommentSection imdbId={imdbId} />
    </div>
  )
}

export default MoviePage
