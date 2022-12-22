import { Link } from 'react-router-dom'

const dummyList = [
  { id: 1, title: 'movie one', director: 'John Dummy'},
  { id: 2, title: 'movie two', director: 'Bob Dummy'},
]

function MovieList(props) {
  return (
  <div className='text-white max-w-4xl mx-auto pt-10 pb-20 px-2'>
    <h1>Movie list</h1>
    <ul>
      {dummyList.map(movie => {
        return (<li key={movie.id} className='text-white text-xl'>
          <Link
            to={`movie/${movie.id}`}
            state={{movie}}
          >
            {movie.title}
          </Link>
        </li>)
      })}
    </ul>
  </div>
  )
}
export default MovieList