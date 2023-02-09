import React from 'react'
import { useNavigate } from 'react-router-dom'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { showNotif } from '../store/notificationsSlice'

// homemade i18n
import t from '../i18n/i18n'

import placeholder from '../assets/cast-placeholder.jpeg'

export default function UserProfilePage() {
  const { activeLanguage } = useSelector((slices) => slices.language)
  const [isLoading, setIsloading] = React.useState(true)
  const [profile, setProfile] = React.useState(null)

  let { accessToken, uid, isLoggedIn } = useSelector((slices) => slices.auth)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  console.log(location.pathname.split('/').pop())

  React.useEffect(() => {
    const userData = window.localStorage.hypertube
    if (isLoggedIn) return
    else if (userData !== undefined) {
      const parsedData = JSON.parse(userData)
      dispatch(logIn(parsedData))
      accessToken = parsedData.accessToken
    } else navigate('/')
  }, [])

  React.useEffect(() => {
    if (!isLoggedIn) return
    async function getUserProfile() {
      setIsloading(true)
      // console.log('testing __ uid: ' + uid, 'accessToken: ' + accessToken)
      const target = window.location.pathname.split('/').pop() // uid is user using app not target so i changed it to target user from url
      const response = await fetch(`/api/user-profile/${target}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      // console.log(response) // testing
      const data = await response.json()
      if (response.ok) {
        console.log(data) // testing

        setProfile(data.user)
        setIsloading(false)
      } else {
        console.log(data) // testing
      }
    }
    getUserProfile()
  }, [accessToken, uid, isLoggedIn])

  return (
    <div className='text-white sm:w-[35rem] md:w-[30rem] mx-auto pt-5 pb-2 px-2'>
      {isLoading && 'Loading...'}

      {!isLoading && profile && (
        <>
          <div className='flex m-5 border-[1px] border-white border-opacity-20 text-[3rem]'>
            <div className='overflow-hidden m-5'>
              <h1 className='font-bold text-center'>
                {profile.firstname} {profile.lastname}
              </h1>
              <h2 className='font-bold mb-4 text-center font-thin'>
                <span className='font-thin'>as </span>
                {profile.username}
              </h2>
              <img
                src={
                  profile.profile_pic === ''
                    ? 'https://via.placeholder.com/500'
                    : profile.profile_pic
                }
                alt=''
              />
              <div className='px-6 pt-4 pb-2'></div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
