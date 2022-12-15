import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
// redux
import { useSelector, useDispatch } from 'react-redux'
import { logOut } from '../store/authSlice'

function Header() {
  // Redux
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector(slices => slices.auth)

  console.log(`header: ${isLoggedIn}`);
  return (
    <header className='bg-gray-800 py-4 border-b-[1px] border-gray-700'>
      <div className='flex justify-between items-center max-w-6xl mx-auto'>
        <div className={`pl-3`}>
          <Link to='/' className='text-white text-4xl md:text-5xl font-leagueGothic'>
            <span>Hyper</span> <span className='bg-red-600 px-[2px] tracking-wider rounded-xl -ml-[1px]'>Tube</span>
          </Link>
        </div>

        <nav className='text-white'>
          <ul className='flex space-x-4 text-xl'>
            {!isLoggedIn ?
            (<li>
              <Link to='/auth'>
                <ArrowLeftOnRectangleIcon className='inline w-10 md:w-12 mr-4 hover:scale-105 hover:text-green-300'/>
              </Link>
            </li>)
            :
            (<li onClick={() => dispatch(logOut())}>
              <ArrowRightOnRectangleIcon className='inline w-10 md:w-12 mr-4 hover:scale-105 hover:text-red-500'/>
            </li>)}
            {/* User Settings (for logged-in users) */}
            {/* Language Selector (for all folks?) */}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header