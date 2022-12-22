import React from 'react'

import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
// redux
import { useSelector, useDispatch } from 'react-redux'
import { logIn } from '../store/authSlice'
import { showNotif } from '../store/notificationsSlice'

export default function OAuthPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(document.location.search)
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector(slices => slices.auth)

  async function oauthGitHub() {
    setIsLoading(true) // replace by a cool notif!!!
    const data = { code: searchParams.get('code') }
    console.log('code: ', data.code);

    const response = await fetch('/api/sessions/oauth/github', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const parsed = await response.json()
    // console.log(`response: ${JSON.stringify(parsed)}`)
    // console.log(`response: ${JSON.stringify(parsed.id)}`) // testing
    if (parsed.error) {
      // Don't log in the user
      setError(parsed.error)

      // Redirect after 3 seconds
      setTimeout(() => { 
        navigate('/', { replace: true })
    }, 3000)
    } else if (parsed.newUser) {
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
      // Log in the user
      dispatch(logIn({
        uid: parsed.uid,
        username: parsed.username,
        profilePic: parsed.profilePic || '',
        accessToken: parsed.accessToken
      }))
      navigate('/', { replace: true })
    }
    setIsLoading(false)
  }

  async function oauth42() {
    // setIsLoading(true) // replace by a cool notif!!!
    dispatch(
      showNotif({
        status: 'loading',
        title: 'signing up',
        message: "We're signing you up"
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
      dispatch(
        showNotif({
          status: 'error',
          title: 'woops',
          message: parsed.error
        })
      )
      // Don't log in the user
      setError(parsed.error)

      // Redirect after 3 seconds
      setTimeout(() => { 
        navigate('/', { replace: true })
      }, 3000)
    } else if (parsed.newUser) {
      dispatch(
        showNotif({
          status: 'success',
          title: 'signed up successfully',
          message: "The answer is 42!"
        })
      )
      // Log in the user
      dispatch(logIn({
        uid:          parsed.uid,
        username:     parsed.username,
        profilePic:   parsed.profilePic || '',
        accessToken:  parsed.accessToken
      }))
      // Redirect to profile, so that user can update settings (username, ...)
      navigate('/profile', { replace: true })
    } else {
      dispatch(
        showNotif({
          status: 'success',
          title: 'logged in successfully',
          message: "The answer is 42!"
        })
      )
      // Log in the user
      dispatch(logIn({
        uid:          parsed.uid,
        username:     parsed.username,
        profilePic:   parsed.profilePic || '',
        accessToken:  parsed.accessToken
      }))
      navigate('/', { replace: true })
    }
    // setIsLoading(false)
  }

  React.useEffect(() => {
    // if (isLoggedIn) navigate('/', { replace: true })

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
        <p className='text-white text-2xl'>{error}</p>
      </div>
    )
  }

  return (
    <div className='text-white max-w-4xl mx-auto pt-10 pb-20 px-2'>
      <h1 className='text-2xl text-center pb-8'>OAuth Stuff</h1>

    </div>
  )
}
