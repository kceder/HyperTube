import React from 'react'
import imdbLogo from '../assets/imdb.png'
import notFound from '../assets/not_found.png'
import MovieCast from './movieCast'

function MovieCard(props) {
  const {
    title,
    year,
    imdb_code: imdbCode,
    rating: imdbRating,
    large_cover_image: coverUrl,
    description_full: synopsis
  } = props.movie

  console.log('props.movie', props) // check all props you get
  return (
  <div>
	<div className='p-3 bg-white bg-opacity-5 text-white rounded-md'>
	  <div className="grid md:grid-cols-5 md:gap-1">
		<div className='md:col-span-4'>
		  <p className='text-xl font-bold text-center'>{title}</p>
		  <hr className='my-4'/>
		  <div className='flex justify-between'>
			<p>
			  <span className='font-bold'>{year}</span>
			</p>
			<p className='flex items-center space-x-2'>
			  <img src={imdbLogo} alt="imdb logo" className='inline w-8 -mt-1'/>
			  <span className='pr-3 font-bold'>{imdbRating}</span>
			</p>
		  </div>
		  <p className='mt-3'>
		  {synopsis}
		  </p>
		</div>
		<img
		  src={coverUrl}
		  alt={title}
		  className='md:w-52 mt-3 md:mt-0 p-3'
		  onError={(e) => {
			e.target.onerror = null
			e.target.src=notFound
		  }}
		  />
	  </div>
		<MovieCast cast={props.movie.cast}/>
	</div>
  </div>
  )
}
export default MovieCard