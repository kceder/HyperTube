import React from 'react'
import finnish from '../assets/finnish.png'
import italian from '../assets/italian.png'
import spanish from '../assets/spanish.png'
import english from '../assets/english.png'
// import { Collapse } from 'react-collapse'
// Redux
import { useSelector, useDispatch } from 'react-redux'
import { setActiveLanguage } from '../store/languageSlice'

function LanguageSelectorMobile(props) {
  const { activeLanguage } = useSelector(slices => slices.language)
  const dispatch = useDispatch()

  // const [lang, setLang] = React.useState('en') // later this is gonna be global state

  let imgFlag
  if (activeLanguage === 'en') imgFlag = english
  if (activeLanguage === 'it') imgFlag = italian
  if (activeLanguage === 'fi') imgFlag = finnish

  // console.log('mobile', activeLanguage) // testing

  function changeLanguage(e) {
    const chosenLanguage = e.currentTarget.getAttribute('data-id')

    // console.log(`user changed language to: ${chosenLanguage}`) // testing

    dispatch(setActiveLanguage(chosenLanguage))
    // setLang(chosenLanguage) // set the language state
    props.closeIt()         // close the mobile menu
  }

  return (
    <div className='flex justify-evenly'>
      <div
        className={`cursor-pointer pt-3`}
        data-id='en'
        onClick={(e) => changeLanguage(e)}
      >
        <img
          src={english}
          className={`w-10 h-10 rounded-full border-2 border-gray-700 p-1 ${activeLanguage === 'en' && ' border-white'}`}
        />
      </div>

      <div
        className={`cursor-pointer pt-3`}
        data-id='it'
        onClick={(e) => changeLanguage(e)}
      >
        <img
          src={italian}
          className={`w-10 h-10 rounded-full border-2 border-gray-700 p-1 ${activeLanguage === 'it' && ' border-white'}`}
        />
      </div>

      <div
        className={`cursor-pointer pt-3`}
        data-id='fi'
        onClick={(e) => changeLanguage(e)}
      >
        <img
          src={finnish}
          className={`w-10 h-10 rounded-full border-2 border-gray-700 p-1 ${activeLanguage === 'fi' && ' border-white'}`}
        />
      </div>
    </div>
  )
}

export default LanguageSelectorMobile
