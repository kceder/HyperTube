import React from 'react'

import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { showNotif } from '../store/notificationsSlice'

// homemade i18n
import t from '../i18n/i18n'

export default function ConfirmAccountPage() {
  const { activeLanguage } = useSelector((slices) => slices.language)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector((slices) => slices.auth)
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  // Extract the parameters from the confirmation link
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')
  // console.log(email, token) // testing
  React.useEffect(() => {
    if (email === null || token === null) navigate('/')
  }, [email, token])

  async function requestConfirmation() {
    setIsLoading(true)
    dispatch(
      showNotif({
        status: 'loading',
        message: t(activeLanguage, 'confirmAccountPage.notification.loading'),
      }),
    )
    const response = await fetch('/api/users/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, token }),
    })
    const data = await response.json()
    if (data.error) {
      setError(data.error)

      dispatch(
        showNotif({
          status: 'error',
          title: 'error',
          message: t(activeLanguage, 'confirmAccountPage.notification.error'),
        }),
      )
    } else {
      dispatch(
        showNotif({
          status: 'success',
          message: t(activeLanguage, 'confirmAccountPage.notification.success'),
        }),
      )
    }
    setIsLoading(false)
    // console.log(data) // testing
  }

  React.useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true })
    if (email !== null || token !== null) requestConfirmation()

    // redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate('/', { replace: true })
    }, 3000)

    // Cleanup function (so we don't end up with multiple timers on)
    return () => clearTimeout(timer)
  }, [isLoggedIn])

  if (isLoading) {
    // Show the notification too!!
    return (
      <div className='flex h-[80vh] items-center justify-center'>
        <ArrowPathIcon className='text-white animate-spin w-40 md:w-96' />
      </div>
    )
  }

  if (error) {
    // Show the notification!!
    return (
      <div className='flex h-[80vh] items-center justify-center'>
        <p className='text-white text-2xl'>
          {t(activeLanguage, 'confirmAccountPage.notification.error')}
        </p>
      </div>
    )
  }

  return (
    <div className='text-white max-w-4xl mx-auto pt-10 pb-20 px-2'>
      <h1 className='text-2xl text-center pb-8 capitalize'>
        {t(activeLanguage, 'confirmAccountPage.title')}
      </h1>
    </div>
  )
}
