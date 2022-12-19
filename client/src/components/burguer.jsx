import React from 'react'

// Redux
// import { useSelector, useDispatch } from 'react-redux'
// import { toggleMobileMenu } from '../../../store/burgerSlice'

function Burger(props) {
  return (
    <div className={`md:hidden${props.isOpen ? ' open' : ''} mr-4`}>
      <button
        id='menu-btn'
        type='button'
        className='z-40 block hamburger focus:outline-none'
        onClick={props.toggle}
      >
        <span className='hamburger-top'></span>
        <span className='hamburger-middle'></span>
        <span className='hamburger-bottom'></span>
      </button>
    </div>
  )
}

export default Burger