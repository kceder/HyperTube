import React from 'react'
import { NavLink } from 'react-router-dom'

// homemade i18n
import t from '../i18n/i18n'

// redux
import { useSelector } from 'react-redux'

function Hero() {
  const { activeLanguage } = useSelector(slices => slices.language)

  return (
    <div className='grid md:grid-cols-2 place-items-center max-w-4xl py-20 mx-auto'>
      <div className='flex flex-col p-6'>
        <h1
          className='text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-white mt-10 text-center md:text-left'
          // onClick={testNotif} // for testing Notifications!
        >
          {/* Watch movies for free, without the fear of being swatted. */}
          {t(activeLanguage, 'heroPage.title')}
        </h1>

        <div className='flex mx-auto pt-10'>
          <NavLink
            to='/auth'
            className='inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 hover:underline hover:scale-110'
          >
            {t(activeLanguage, 'heroPage.logInBtn')}
          </NavLink>

          <NavLink
            to='/sign-up'
            className='inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white border border-gray-300 rounded-lg hover:bg-white hover:bg-opacity-20 focus:ring-4 focus:ring-gray-100'
          >
            {t(activeLanguage, 'heroPage.signUpBtn')}
          </NavLink>
        </div>
      </div>

      <div className='hidden md:block md:w-full'>
        <img
          src='/assets/logo.png'
          alt='mockup'
          className='w-80 md:mx-auto'
        />
      </div>
    </div>
  )
}

export default Hero
