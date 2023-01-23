import React from 'react'
import imdbLogo from '../assets/imdb.png'
import notFound from '../assets/not_found.png'

function MovieCard(props) {
  const {
    title,
    year,
    imdb_code: imdbCode,
    rating: imdbRating,
    large_cover_image: coverUrl,
    description_full: synopsis
  } = props.movie

  console.log(props) // check all props you get
  return (
  <div className='p-3 bg-white bg-opacity-20 text-white rounded-sm'>
    <div className="grid md:grid-cols-2 md:gap-1">
      <img
        src={coverUrl}
        alt={title}
        className='w-96 col-span-1' 
        onError={(e) => {
          e.target.onerror = null
          e.target.src=notFound
        }}
        />
      <div className='col-span-1'>
        <p className='text-xl font-bold text-center'>{title}</p>
        <hr className='my-4'/>
        <div className='flex justify-between'>
          <p>
            <span>Year: </span>
            <span className='font-bold'>{year}</span>
          </p>
          <p className='flex items-center space-x-2'>
            <img src={imdbLogo} alt="imdb logo" className='inline w-8 -mt-1'/>
            <span className='pr-3 font-bold'>{imdbCode}</span>
          </p>
        </div>
        <p>
          <span className='font-bold text-lg'>Synopsis: </span>{synopsis}
        </p>
      </div>
    </div>
    <p className='flex justify-between items-center py-2 px-1'>
      <span>
        <img src={imdbLogo} alt="imdb logo" className='inline w-8 -mt-1'/>
        <span className='font-bold'>{imdbRating}</span>
      </span>
    </p>
  </div>
  )
}
export default MovieCard