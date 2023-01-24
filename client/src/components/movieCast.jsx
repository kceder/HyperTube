import React from 'react'

const MovieCast = ({cast}) => {
	console.log('cast', cast)
	const castMembers = cast.map((member => {
		return (
			<div key={member.imdb_code} className='flex items-center flex-col'>
				<img
					className='rounded-full'
					src={member.url_small_image}
				/>
				<small style={{fontWeight: 'lighter', fontSize: '0.95em'}}>{member.name}</small>
			</div>
		)
	}))
  return (
	<div>
		<div className=' p-1 bg-white bg-opacity-5 text-white rounded-md flex justify-evenly'>
			{castMembers}
		</div>
	</div>
  )
}

export default MovieCast