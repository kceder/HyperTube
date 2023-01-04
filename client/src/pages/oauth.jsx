import React from 'react'

import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { logIn } from '../store/authSlice'
import { showNotif } from '../store/notificationsSlice'

// homemade i18n
import t from '../i18n/i18n'

export default function OAuthPage() {
  const { activeLanguage } = useSelector(slices => slices.language)

  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(document.location.search)
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector(slices => slices.auth)
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  async function oauthGitHub() {
    setIsLoading(true) // to show the spinner

    dispatch(
      showNotif({
        status: 'loading',
        message: t(activeLanguage, 'OAuthPage.GH.notification.loading')
      })
    )

    const data = { code: searchParams.get('code') }
    // console.log('code: ', data.code)  // testing

    const response = await fetch('/api/sessions/oauth/github', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const parsed = await response.json()
    // console.log(`response: ${JSON.stringify(parsed)}`)
    // console.log(`response: ${JSON.stringify(parsed.id)}`) // testing
    if (parsed.error) {
      setError(parsed.error)
      // Don't log in the user
      dispatch(
        showNotif({
          status: 'error',
          message: t(activeLanguage, 'OAuthPage.GH.notification.error')
        })
      )

      // Redirect after 3 seconds
      setTimeout(() => { 
        navigate('/', { replace: true })
    }, 3000)
    } else if (parsed.newUser) {
      dispatch(
        showNotif({
          status: 'success',
          message: t(activeLanguage, 'OAuthPage.GH.notification.successNewUser')
        })
      )

      // Log in the user
      dispatch(logIn({
        uid: parsed.uid,
        username: parsed.username,
        profilePic: parsed.profilePic || '',
        accessToken: parsed.accessToken
      }))

      // Redirect to profile, so that user can update settings (username, ...)
      navigate('/profile', { replace: true })
    } else {
      dispatch(
        showNotif({
          status: 'success',
          message: t(activeLanguage, 'OAuthPage.GH.notification.success')
        })
      )

      // Log in the user
      dispatch(logIn({
        uid: parsed.uid,
        username: parsed.username,
        profilePic: parsed.profilePic || '',
        accessToken: parsed.accessToken
      }))
      navigate('/', { replace: true })
    }
    setIsLoading(false) // to hide the spinner
  }

  async function oauth42() {
    dispatch(
      showNotif({
        status: 'loading',
        message: t(activeLanguage, 'OAuthPage.42.notification.loading')
      })
    )

    const data = { code: searchParams.get('code') }
    // console.log('code: ', data) // testing

    const response = await fetch('/api/sessions/oauth/42', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const parsed = await response.json()
    // console.log(`response: ${JSON.stringify(parsed)}`)  // testing

    if (parsed.error) {
      setError(parsed.error)

      dispatch(
        showNotif({
          status: 'error',
          message:  t(activeLanguage, 'OAuthPage.42.notification.error')
        })
      )

      // Redirect after 3 seconds
      setTimeout(() => { 
        navigate('/', { replace: true })
      }, 3000)
    } else if (parsed.newUser) {
      dispatch(
        showNotif({
          status: 'success',
          title: 'signed up successfully',
          message:  t(activeLanguage, 'OAuthPage.42.notification.successNewUser')
        })
      )

      // Log in the user
      dispatch(logIn({
        uid:          parsed.uid,
        username:     parsed.username,
        profilePic:   parsed.profilePic || '',
        accessToken:  parsed.accessToken
      }))

      setIsLoading(false) // to hide the spinner
      // Redirect to profile, so that user can update settings (username, ...)
      navigate('/profile', { replace: true })
    } else {
      dispatch(
        showNotif({
          status: 'success',
          title: 'logged in successfully',
          message:  t(activeLanguage, 'OAuthPage.42.notification.success')
        })
      )

      // Log in the user
      dispatch(logIn({
        uid:          parsed.uid,
        username:     parsed.username,
        profilePic:   parsed.profilePic || '',
        accessToken:  parsed.accessToken
      }))

      setIsLoading(false) // to hide the spinner
      navigate('/', { replace: true })
    }
  }

  React.useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true })

    // Invoke code to authenticate user using GitHub
    if (location.pathname === '/oauth/github') {
      oauthGitHub()
    } else if (location.pathname === '/oauth/42') {
      oauth42()
    }
  }, [])

  if (isLoading) {
    // Show the notification too!!
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <ArrowPathIcon className='text-white animate-spin w-40 md:w-96' />
      </div>
    )
  }
  
  if (error) {
    // Show the notification!!
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className='text-white text-2xl'>
          { t(activeLanguage, 'OAuthPage.GH.notification.error')}
        </p>
      </div>
    )
  }

  return (
    <div className='text-white max-w-4xl mx-auto pt-10 pb-20 px-2'>
      <h1 className='text-2xl text-center pb-8 capitalize'>
        {location.pathname === '/oauth/github' ? 
          t(activeLanguage, 'OAuthPage.GH.title')
        :
          t(activeLanguage, 'OAuthPage.42.title')
        }
      </h1>
    </div>
  )
}
