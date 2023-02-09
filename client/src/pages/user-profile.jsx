import React from 'react'
import { useNavigate } from 'react-router-dom'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { showNotif } from '../store/notificationsSlice'

// homemade i18n
import t from '../i18n/i18n'

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
      const response = await fetch(`/api/user-profile/${uid}`, {
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
    <div className='text-white sm:w-[18rem] md:w-[22rem] mx-auto pt-5 pb-2 px-2'>
      {isLoading && 'Loading...'}

      {!isLoading && profile && <>
        <h1 className='text-xl text-center pb-5 capitalize'>
          {t(activeLanguage, 'profilePage.title')}
        </h1>
        <p>{profile.firstname}</p>
        <p>{profile.lastname}</p>
        <img src={profile.profile_pic} alt="" />
      </>}

    </div>
  )
}
