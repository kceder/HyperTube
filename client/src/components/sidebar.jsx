import React from 'react'
import ReactDOM from 'react-dom'
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/outline'

// components
import MinRatingRangeSlider from './min-rating-range-slider'
import Select from 'react-select'

const genres = [
  { value: 'action',      label: 'Action' },
  { value: 'adult',       label: 'Adult' },
  { value: 'adventure',   label: 'Adventure' },
  { value: 'animation',   label: 'Animation' },
  { value: 'biography',   label: 'Biography' },
  { value: 'comedy',      label: 'Comedy' },
  { value: 'crime',       label: 'Crime' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'drama',       label: 'Drama' },
  { value: 'family',      label: 'Family' },
  { value: 'fantasy',     label: 'Fantasy' },
  { value: 'film noir',   label: 'Film Noir' },
  { value: 'game show',   label: 'Game Show' },
  { value: 'history',     label: 'History' },
  { value: 'horror',      label: 'Horror' },
  { value: 'musical',     label: 'Musical' },
  { value: 'music',       label: 'Music' },
  { value: 'mystery',     label: 'Mystery' },
  { value: 'news',        label: 'News' },
  { value: 'reality-TV',  label: 'Reality-TV' },
  { value: 'romance',     label: 'Romance' },
  { value: 'sci-Fi',      label: 'Sci-Fi' },
  { value: 'short',       label: 'Short' },
  { value: 'sport',       label: 'Sport' },
  { value: 'talk-show',   label: 'Talk-Show' },
  { value: 'thriller',    label: 'Thriller' }, 
  { value: 'war',         label: 'War' },
  { value: 'western',     label: 'Western' }
]

function SideBar(props) {
  const {
    isVisible,
    clickHandler,
    minImdbRating,
    setMinImdbRating,
    genre,
    setGenre
  } = props

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

          <hr className='pb-4'/>

          <div className='flex flex-col p-4 space-y-8'>
            <MinRatingRangeSlider
              label='Minimum Rating'
              value={minImdbRating}
              changeHandler={e => setMinImdbRating(e.target.value)}
            />

            <div>
              <p className='text-white text-2xl mb-3'>Select Genre</p>
              <Select value={genre} onChange={setGenre} options={genres} isClearable={true} />
            </div>
          </div>
        </div>
      </div>

      {isVisible && (
        <div
          className={`fixed top-0 right-0 w-full h-full bg-black bg-opacity-70 z-40 transition-opacity ease-in-out duration-800`}
        ></div>
      )}
    </>,
    document.getElementById('overlays'),
  )
}

export default SideBar
