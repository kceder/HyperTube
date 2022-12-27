import React from 'react'
import finnish from '../assets/finnish.png'
import italian from '../assets/italian.png'
import spanish from '../assets/spanish.png'
import english from '../assets/english.png'
import { Collapse } from 'react-collapse'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { setActiveLanguage } from '../store/languageSlice'

function LanguageSelector(props) {
  const [isOpen, setIsOpen] = React.useState(false)
  const { activeLanguage } = useSelector(slices => slices.language)
  const dispatch = useDispatch()
  // const [lang, setLang] = React.useState('en') // later this is gonna be global state

  let imgFlag
  if (activeLanguage === 'en') imgFlag = english
  if (activeLanguage === 'it') imgFlag = italian
  if (activeLanguage === 'fi') imgFlag = finnish

  function changeLanguage(e) {
    const chosenLanguage = e.currentTarget.getAttribute('data-id')
    // console.log(`user changed language to: ${chosenLanguage}`) // testing
    // setLang(chosenLanguage) // set the language local state
    dispatch(setActiveLanguage(chosenLanguage))

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
            className={`cursor-pointer ${activeLanguage === 'en' && ' hidden'} pt-3`}
            data-id='en'
            onClick={(e) => changeLanguage(e)}
          >
            <img
              src={english}
              className='w-10 h-10 rounded-full'
            />
          </div>

          <div
            className={`cursor-pointer ${activeLanguage === 'it' && ' hidden'} pt-3`}
            data-id='it'
            onClick={(e) => changeLanguage(e)}
          >
            <img
              src={italian}
              className='w-10 h-10 rounded-full'
            />
          </div>

          <div
            className={`cursor-pointer ${activeLanguage === 'fi' && ' hidden'} pt-3`}
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
