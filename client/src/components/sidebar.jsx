import React from 'react'
import ReactDOM from 'react-dom'
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/outline'
import MinRatingRangeSlider from './min-rating-range-slider'

function SideBar(props) {
  const {
    isVisible,
    clickHandler,
    minImdbRating,
    setMinImdbRating
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

          <hr />

          <div className='p-4'>
            <MinRatingRangeSlider
              label='Minimum Rating'
              value={minImdbRating}
              changeHandler={e => setMinImdbRating(e.target.value)}
            />
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
