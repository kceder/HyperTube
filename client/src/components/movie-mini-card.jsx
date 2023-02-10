import React from 'react'
import imdbLogo from '../assets/imdb.png'
import notFound from '../assets/not_found.png'

function MovieMiniCard(props) {
  const { title, year, imdbRating, coverUrl, synopsis } = props.movie
  return (
    <div className='relative group bg-[#2e3747] text-white rounded duration-500 hover:scale-110 hover:z-40 overflow-hidden'>
      {props.movie.watched && (
        <div className="absolute bg-blue-600 w-3 h-3 top-1 right-1 rounded-full animate-pulse"></div>
      )}
      <img
        src={coverUrl}
        alt={title}
        className='w-96 rounded'
        onError={(e) => {
          e.target.onerror = null
          e.target.src = notFound
        }}
      />
      <div className='absolute hidden duration-500 group-hover:block mt-[-5rem] bg-black bg-opacity-70 min-w-[100%] max-w-[100%]'>
        <p className='truncate py-2 text-center'>{title} </p>
        <hr />
        <p className='flex justify-between items-center py-2 px-1'>
          <span>
            <img
              src={imdbLogo}
              alt='imdb logo'
              className='inline w-8'
            />
            <span className='font-bold'> {imdbRating}</span>
          </span>
          <span className='font-bold'>{year}</span>
        </p>
      </div>
      {/* <div className='hidden group-hover:block'>{synopsis}</div> */}
    </div>
  )
}
export default MovieMiniCard
