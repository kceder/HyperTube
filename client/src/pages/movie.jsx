import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function MoviePage() {
  const navigate = useNavigate()
  const { isLoggedIn } = useSelector(slices => slices.auth)
  // We'll be passing state through the location thing of react-router
  const location = useLocation()
  const { title, director } = location.state.movie // destructure state

  // Protected route: redirect to home page if user's not logged in
  React.useEffect(() => {
    if (!isLoggedIn) navigate('/', { replace: true })
  }, [isLoggedIn])

  return (
    <div className='text-white max-w-4xl mx-auto pt-10 pb-20 px-2'>
      <h1 className='text-2xl text-white'>{title}</h1>
      <p className='text-xl text-white'>{director}</p>
      <p className='text-xl text-white'>Show Video player here</p>
    </div>)
}

export default MoviePage
