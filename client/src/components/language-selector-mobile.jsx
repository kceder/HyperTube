import React from 'react'
import finnish from '../assets/finnish.png'
import italian from '../assets/italian.png'
import spanish from '../assets/spanish.png'
import english from '../assets/english.png'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { setActiveLanguage } from '../store/languageSlice'

function LanguageSelectorMobile(props) {
  const { activeLanguage } = useSelector(slices => slices.language)
  const dispatch = useDispatch()

  const languages = [
    { lang: 'en', imgSrc: english },
    { lang: 'es', imgSrc: spanish },
    { lang: 'fi', imgSrc: finnish },
    { lang: 'it', imgSrc: italian }
  ]
  // console.log('mobile', activeLanguage) // testing

  function changeLanguage(e) {
    const chosenLanguage = e.currentTarget.getAttribute('data-id')
    // console.log(`user changed language to: ${chosenLanguage}`) // testing

    dispatch(setActiveLanguage(chosenLanguage))
    props.closeIt()         // close the mobile menu
  }

  return (
    <div className='flex justify-evenly pt-4'>
      {languages.map(l => (
        <div
        key={l.lang}
        className={`cursor-pointer pt-3`}
        data-id={l.lang}
        onClick={(e) => changeLanguage(e)}
      >
        <img
          src={l.imgSrc}
          className={`w-10 h-10 rounded-full border-2 p-1${activeLanguage === l.lang ? ' border-white' : ' border-gray-700'}`}
        />
      </div>
      ))}
    </div>
  )
}

export default LanguageSelectorMobile
