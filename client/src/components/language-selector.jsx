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

  let imgFlag
  if (activeLanguage === 'en') imgFlag = english
  if (activeLanguage === 'es') imgFlag = spanish
  if (activeLanguage === 'it') imgFlag = italian
  if (activeLanguage === 'fi') imgFlag = finnish

  const languages = [
    { lang: 'en', imgSrc: english },
    { lang: 'es', imgSrc: spanish },
    { lang: 'fi', imgSrc: finnish },
    { lang: 'it', imgSrc: italian }
  ]

  function changeLanguage(e) {
    const chosenLanguage = e.currentTarget.getAttribute('data-id')
    // console.log(`user changed language to: ${chosenLanguage}`) // testing

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
          {languages.map(l => (
            <div
              key={l.lang}
              className={`cursor-pointer ${activeLanguage === l.lang && ' hidden'} pt-3`}
              data-id={l.lang}
              onClick={(e) => changeLanguage(e)}
            >
              <img
                src={l.imgSrc}
                className='w-10 h-10 rounded-full'
              />
            </div>
          ))}
        </Collapse>
      </div>
    </div>
  )
}

export default LanguageSelector
