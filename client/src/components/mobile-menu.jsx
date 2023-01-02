import React from 'react'

// router
import { Link } from 'react-router-dom'

// icons
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  UserPlusIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

// components
import LanguageSelectorMobile from './language-selector-mobile.jsx'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { logOut } from '../store/authSlice.js'

// homemade i18
import t from '../i18n/i18n'

function MobileMenu(props) {
  const { isLoggedIn } = useSelector(slices => slices.auth)
  const { activeLanguage } = useSelector(slices => slices.language)
  const dispatch = useDispatch()

  function logoutHandler() {
    dispatch(logOut())
    // props.closeIt()
  }

  return (
    <div
      id='menu'
      className='absolute top-20 botton-0 left-0 flex flex-col self-end w-full min-h-screen py-1 px-12 pt-8 space-y-9 divide-y-2 divide-pink-500 text-white uppercase bg-black bg-opacity-75 z-10 backdrop-blur-sm'
      onClick={props.closeIt}
    >
      {isLoggedIn ? (
        <>
          <Link
            to='/'
            className='hover:text-pink-500 pt-6 pl-4'
          >
            <UsersIcon className='inline text-green-400 w-6 -mt-1 mr-2' />
            movies
          </Link>

          <Link
            to='/profile'
            className='hover:text-pink-500 pt-6 pl-4'
          >
            <UserCircleIcon className='inline text-blue-500 w-6 -mt-1 mr-2' />
            settings
          </Link>

          <Link
            to=''
            className='hover:text-pink-500 pt-6 pl-4'
            onClick={logoutHandler}
          >
            <ArrowRightOnRectangleIcon className='inline text-red-500 w-6 -mt-1 mr-2 hover:cursor-pointer' />
            {t(activeLanguage, 'mobileMenu.logOutBtn')}
          </Link>
        </>
      ) : (
        <>
          <Link
            to='/auth'
            className='hover:text-pink-500 pt-6 pl-4'
          >
            <ArrowLeftOnRectangleIcon className='inline text-green-500 w-6 -mt-1 mr-2' />
            {t(activeLanguage, 'mobileMenu.logInBtn')}
          </Link>

          <Link
            to='/sign-up'
            className='hover:text-pink-500 pt-6 pl-4'
          >
            <UserPlusIcon className='inline text-orange-500 w-6 -mt-1 mr-2' />
            {t(activeLanguage, 'mobileMenu.signUpBtn')}
          </Link>
        </>
      )}
      <LanguageSelectorMobile closeIt={props.closeIt} />
    </div>
  )
}

export default MobileMenu
