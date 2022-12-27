import React from 'react'
import finnish from '../assets/finnish.png'
import italian from '../assets/italian.png'
import spanish from '../assets/spanish.png'
import english from '../assets/english.png'
import { Collapse } from 'react-collapse'
// Redux
// import { useSelector, useDispatch } from 'react-redux'

function LanguageSelector(props) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [lang, setLang] = React.useState('en') // later this is gonna be global state

  let imgFlag
  if (lang === 'en') imgFlag = english
  if (lang === 'it') imgFlag = italian
  if (lang === 'fi') imgFlag = finnish

  function changeLanguage(e) {
    const chosenLanguage = e.currentTarget.getAttribute('data-id')
    console.log(`user changed language to: ${chosenLanguage}`)
    setLang(chosenLanguage) // set the language state
    setIsOpen(false)        // collapse the component
  }

  return (
    <div className='relative'>
      <img
        src={imgFlag}
        className='w-10 h-10 rounded-full cursor-pointer'
        onClick={() => setIsOpen((prev) => !prev)}
      />
      <div className=' absolute'>
        <Collapse
          isOpened={isOpen}
          className=''
        >
          <div
            className={`cursor-pointer ${lang === 'en' && ' hidden'} pt-3`}
            data-id='en'
            onClick={(e) => changeLanguage(e)}
          >
            <img
              src={english}
              className='w-10 h-10 rounded-full'
            />
          </div>

          <div
            className={`cursor-pointer ${lang === 'it' && ' hidden'} pt-3`}
            data-id='it'
            onClick={(e) => changeLanguage(e)}
          >
            <img
              src={italian}
              className='w-10 h-10 rounded-full'
            />
          </div>

          <div
            className={`cursor-pointer ${lang === 'fi' && ' hidden'} pt-3`}
            data-id='fi'
            onClick={(e) => changeLanguage(e)}
          >
            <img
              src={finnish}
              className='w-10 h-10 rounded-full'
            />
          </div>
        </Collapse>
      </div>
    </div>
  )
}

export default LanguageSelector
