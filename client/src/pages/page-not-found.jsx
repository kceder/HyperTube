import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'

function PageNotFound() {

  return ReactDOM.createPortal(
    <div className='bg-travolta w-screen h-screen bg-center bg-cover flex flex-col space-y-4 items-center justify-center z-50 fixed'>
      <h1 className='text-8xl text-white font-bold text-center font-logo'>404</h1>
      <p className='text-6xl'>🙈</p>
      <Link to='/' className='text-white text-xl underline underline-offset-4 hover:text-blue-500'>Please Take me home</Link>
    </div>,
    document.getElementById('overlays'),
  )
}

export default PageNotFound