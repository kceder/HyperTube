import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
// redux
import { useSelector, useDispatch } from 'react-redux'
import { logOut } from '../store/authSlice'
import Burger from './burguer'
import MobileMenu from './mobile-menu'
import LanguageSelector from './language-selector'

function Header() {
  const navigate = useNavigate()
  const [ isOpen, setIsOpen ] = React.useState(false)

  // Redux
  const dispatch = useDispatch()
  const { isLoggedIn, profilePic } = useSelector(slices => slices.auth)

  function logoutHandler() {
    dispatch(logOut())
    navigate('/', { replace: true })
  }
  // console.log(`header: ${isLoggedIn}`);
  let imgElem = !profilePic ?
  <UserCircleIcon className='w-12 hover:text-blue-400' />
  :
  <img src={`${profilePic}`} alt="" className='rounded-full h-12 w-12 object-cover' />
  
  function toggle() {
    setIsOpen(prev => !prev)
  }
  function closeIt() { setIsOpen(false) }

  return (
    <header className='bg-gray-800 py-4 h-20 border-b-[1px] border-gray-700'>
      <div className='flex justify-between items-center max-w-6xl mx-auto'>
        <div className={`pl-3`}>
          <Link to='/' className='text-white text-4xl md:text-5xl font-leagueGothic'>
            <span>Hyper</span> <span className='bg-red-600 px-[2px] tracking-wider rounded-xl -ml-[1px]'>Tube</span>
          </Link>
        </div>

        <nav className='text-white'>
          <ul className='hidden md:flex space-x-4 text-xl items-center'>
            {/* Language Selector (for all folks?) */}
            <li>
              <LanguageSelector />
            </li>
            {!isLoggedIn ?
            (<li>
              <Link to='/auth'>
                <ArrowLeftOnRectangleIcon className='inline w-10 md:w-12 mr-4 hover:scale-105 hover:text-green-300'/>
              </Link>
            </li>)
            :
            (<>
              <li>
                <Link to='/profile'>
                  {imgElem}
                  {/* <ArrowLeftOnRectangleIcon className='inline w-10 md:w-12 mr-4 hover:scale-105 hover:text-green-300'/> */}
                </Link>
              </li>

              <li onClick={logoutHandler}>
                <ArrowRightOnRectangleIcon className='inline w-10 md:w-12 mr-4 hover:scale-105 hover:text-red-500'/>
              </li>
            </>)}
            {/* User Settings (for logged-in users) */}
          </ul>
          <Burger isOpen={isOpen} toggle={toggle} />
          {isOpen && <MobileMenu isOpen={isOpen} closeIt={closeIt} />}
        </nav>
      </div>
    </header>
  )
}

export default Header