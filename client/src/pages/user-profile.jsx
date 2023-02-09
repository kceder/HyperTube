import React from 'react'
import { useNavigate } from 'react-router-dom'

// redux
import { useSelector } from 'react-redux'

export default function UserProfilePage() {
  const [isLoading, setIsloading] = React.useState(true)
  const [profile, setProfile] = React.useState(null)

  let { accessToken, uid, isLoggedIn } = useSelector((slices) => slices.auth)

  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isLoggedIn) navigate('/')

    async function getUserProfile() {
      setIsloading(true)
      try {
        // uid is user using app not target so i changed it to target user from url
        const target = window.location.pathname.split('/').pop()
        const response = await fetch(`/api/user-profile/${target}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        // console.log(response) // testing
        if (response.ok) {
          const data = await response.json()
          setProfile(data.user)
          setIsloading(false)
        } else {
          navigate('/')
        }
      } catch (error) {
        // console.log(error)
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
              <h2 className='font-bold mb-4 text-center'>
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
