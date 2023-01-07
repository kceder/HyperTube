import React from 'react'
import ReactDOM from 'react-dom'
import {
  ChevronDoubleLeftIcon,
  HandRaisedIcon,
} from '@heroicons/react/24/outline'

// components
import MinRatingRangeSlider from './min-rating-range-slider'
import Select from 'react-select'

const genres = [
  { value: 'action', label: 'Action' },
  { value: 'adult', label: 'Adult' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'animation', label: 'Animation' },
  { value: 'biography', label: 'Biography' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'crime', label: 'Crime' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'drama', label: 'Drama' },
  { value: 'family', label: 'Family' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'film noir', label: 'Film Noir' },
  { value: 'game show', label: 'Game Show' },
  { value: 'history', label: 'History' },
  { value: 'horror', label: 'Horror' },
  { value: 'musical', label: 'Musical' },
  { value: 'music', label: 'Music' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'news', label: 'News' },
  { value: 'reality-TV', label: 'Reality-TV' },
  { value: 'romance', label: 'Romance' },
  { value: 'sci-Fi', label: 'Sci-Fi' },
  { value: 'short', label: 'Short' },
  { value: 'sport', label: 'Sport' },
  { value: 'talk-show', label: 'Talk-Show' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'war', label: 'War' },
  { value: 'western', label: 'Western' },
]

function SideBar(props) {
  const {
    isVisible,
    clickHandler,
    minImdbRating,
    setMinImdbRating,
    genre,
    setGenre,
    queryTerm,
    setQueryTerm,
    submitQuery,
  } = props
  const [queryTermError, setQueryTermError] = React.useState('')
  const [genreObject, setGenreObject] = React.useState(null)

  React.useEffect(() => {
    const regex = /^[a-zA-Z]*$/

    if (regex.test(queryTerm) || queryTerm > 30) {
      setQueryTermError(null)
    } else
      setQueryTermError('Only one word (Max. 30 upper and lowercase letters)') // use translation here
  }, [queryTerm])

  function genreChangeHandler(e) {
    console.log(e?.value)
    setGenreObject(e)
    if (e && e.value) setGenre(e.value)
  }

  React.useEffect(() => {
    if (genreObject === null) setGenre('all')
  }, [genreObject])

  return ReactDOM.createPortal(
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full z-50 ease-in-out duration-500 ${
          isVisible ? '-translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* CONTENT */}
        <div className={`h-full w-full md:w-[50%] bg-slate-500`}>
          {/* Header */}
          <div className='flex justify-between items-center p-4 text-2xl text-white'>
            <p className='capitalize'>advanced search</p>

            <ChevronDoubleLeftIcon
              className='w-10 hover:cursor-pointer hover:scale-110'
              onClick={clickHandler}
            />
          </div>

          <hr className='pb-4' />

          <div className='flex flex-col p-4 space-y-8'>
            <MinRatingRangeSlider
              label='Minimum Rating'
              value={minImdbRating}
              changeHandler={(e) => setMinImdbRating(e.target.value)}
            />

            <div>
              <p className='text-white text-2xl mb-3'>Select Genre</p>
              <Select
                value={genreObject}
                onChange={genreChangeHandler}
                options={genres}
                isClearable={true}
              />
            </div>

            <div className='flex flex-col w-full relative pb-20'>
              <label className='text-2xl font-medium text-white pb-2 capitalize align-left'>
                query term
              </label>

              <input
                id='query-term'
                type='text'
                className='bg-gray-50 border border-gray-300 rounded-md px-4 py-1 text-gray-900 text-2xl max-w-xs md:max-w-md placeholder:text-gray-300 min-w-full'
                placeholder='Search by term'
                onChange={e => setQueryTerm(e.target.value)}
              />

              {queryTermError && (
                <p className='absolute top-24 left-2 text-white'>
                  <HandRaisedIcon className='inline w-5 -mt-1 mx-2' />
                  {queryTermError}
                </p>
              )}
            </div>

            <button
              className='text-white border rounded-md p-4 hover:bg-white hover:bg-opacity-30'
              onClick={submitQuery}
            >
              Submit Filter
            </button>
          </div>
        </div>
      </div>

      {isVisible && (
        <div
          className={`fixed top-0 right-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-40 transition-opacity ease-in-out duration-800`}
        ></div>
      )}
    </>,
    document.getElementById('overlays'),
  )
}

export default SideBar
