import React from 'react'
import imdbLogo from '../assets/imdb.png'

function MovieCard(props) {
  const {
    title,
    year,
    imdbRating,
    coverUrl
  } = props.movie

  return (
  <div className='p-1 bg-white bg-opacity-20 text-white rounded-sm'>
    <img src={coverUrl} alt="title" className='w-96' />
    <p className='truncate py-2 text-center'>{title} </p>
    <hr />
    <p className='flex justify-between items-center py-2 px-1'>
      <span>
        <img src={imdbLogo} alt="imdb logo" className='inline w-8 -mt-1'/>
        <span className='font-bold'> {imdbRating}</span>
      </span>
      <span className='font-bold'>{year}</span>
    </p>
  </div>
  )
}
export default MovieCard