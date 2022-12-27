import React from 'react'
import finnish from '../assets/finnish.png'
import italian from '../assets/italian.png'
import spanish from '../assets/spanish.png'
import english from '../assets/english.png'
// import { Collapse } from 'react-collapse'
// Redux
// import { useSelector, useDispatch } from 'react-redux'

function LanguageSelectorMobile(props) {
  const [lang, setLang] = React.useState('en') // later this is gonna be global state

  let imgFlag
  if (lang === 'en') imgFlag = english
  if (lang === 'it') imgFlag = italian
  if (lang === 'fi') imgFlag = finnish

  console.log('mobile',lang);
  function changeLanguage(e) {
    const chosenLanguage = e.currentTarget.getAttribute('data-id')
    console.log(`user changed language to: ${chosenLanguage}`)
    setLang(chosenLanguage) // set the language state
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
          className={`w-10 h-10 rounded-full border-2 border-gray-700 p-1 ${lang === 'en' && ' border-white'}`}
        />
      </div>

      <div
        className={`cursor-pointer pt-3`}
        data-id='it'
        onClick={(e) => changeLanguage(e)}
      >
        <img
          src={italian}
          className={`w-10 h-10 rounded-full border-2 border-gray-700 p-1 ${lang === 'it' && ' border-white'}`}
        />
      </div>

      <div
        className={`cursor-pointer pt-3`}
        data-id='fi'
        onClick={(e) => changeLanguage(e)}
      >
        <img
          src={finnish}
          className={`w-10 h-10 rounded-full border-2 border-gray-700 p-1 ${lang === 'fi' && ' border-white'}`}
        />
      </div>
    </div>
  )
}

export default LanguageSelectorMobile
