import React from 'react'

// components
import Hero from '../components/hero'
import MovieList from '../components/movie-list'

// redux
import { useSelector } from 'react-redux'

function HomePage() {
  const { isLoggedIn } = useSelector(slices => slices.auth)

  if (isLoggedIn)
    return <MovieList />
  else
    return <Hero />
}

export default HomePage
