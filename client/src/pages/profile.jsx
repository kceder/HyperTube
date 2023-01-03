import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// components
import Input from '../components/input'
import InputFile from '../components/input-file'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { setProfilePic, logOut } from '../store/authSlice'
import { showNotif } from '../store/notificationsSlice'

const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export default function ProfilePage() {
  const { accessToken, uid, isLoggedIn } = useSelector(slices => slices.auth)
  const validationSchema = z
  .object({
    userName: z
      .string()
      .min(1, { message: 'Username is required' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
        message: '5-10 upper and lowercase letters, and digits',
      })
      .refine(
        async (userName) => {
          const resp = await fetch(`/api/usernames`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: userName, uid: uid })
          })
          const data = await resp.json()
          const usernameExists = data.message
          // console.log('usernameExists? '+ usernameExists)
          return !usernameExists
        },
        { message: 'Username already taken' }
      ),
    firstName: z
      .string()
      .min(1, { message: 'First Name is required' })
      .max(30, { message: 'Maximum 30 characters' })
      .regex(/^(?=.*[^\W_])[\w ]*$/, { message: 'Only letters and space' }),
    lastName: z
      .string()
      .min(1, { message: 'Last Name is required' })
      .max(30, { message: 'Maximum 30 characters' })
      .regex(/^(?=.*[^\W_])[\w ]*$/, { message: 'Only letters and space' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Must be a valid email' }),
    profilePic: z
      .any()
      .refine(
        (files) => files?.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
        `Max image size is 5MB.`
      )
      .refine(
        (files) => files?.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        'Only .jpg, .jpeg, .png and .webp formats are supported.'
      ),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    mode: 'all',
    resolver: zodResolver(validationSchema),
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (!isLoggedIn) navigate('/', { replace: true })

    async function getProfile() {
      const response = await fetch(`/api/users/${uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      })
      // console.log(response) // testing
      const data = await response.json()
      if (response.ok) {
        // console.log(data.user) // testing
        setValue('userName',  data.user.username)
        setValue('firstName', data.user.firstname)
        setValue('lastName',  data.user.lastname)
        setValue('email',     data.user.email)
      } else {
        console.log(data) // testing
      }
    }
    getProfile()
  }, [])

  async function submitHandler(data) {
    // console.log(data) // testing
    dispatch(
      showNotif({
        status: 'loading',
        title: 'updating profile',
        message: "We're updating your profile"
      })
    )

    const formData = new FormData()
    formData.append('userName', data.userName)
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('email', data.email)

    /* If the user added a profile picture, 'data.profilePic' is a FileList 
      array (truthy value). Otherwise it's a falsey empty string. */
    if (data.profilePic) {
      // Add the profile pic at the end of the form.
      formData.append('profilePic', data.profilePic[0])
      // console.log(data.profilePic[0]) // testing
    }
    
    const response = await fetch(`/api/users/${uid}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData
    })
    const parsed = await response.json()
    if (parsed.error) {
      // console.log(`profile update failed: ${JSON.stringify(parsed.error)}`) // show some feedback in modal bro!!!
      dispatch(
        showNotif({
          status: 'error',
          title: 'something went wrong updating your profile',
          message: parsed.error
        })
      )
    } else {
      // logout the user if the email was changed
      if (parsed.confirmed === false) {
        dispatch(
          showNotif({
            status: 'success',
            title: 'success',
            message: "please confirm your new email"
          })
        )
        dispatch(logOut())
        // redirect after 3 seconds
        const timer = setTimeout(() => {
          navigate('/', { replace: true })
        }, 1500)

        // Cleanup function (so we don't end up with multiple timers on)
        return () => clearTimeout(timer)
      }

      // console.log(`profile update OK: ${JSON.stringify(parsed)}`) // show some feedback in modal bro!!!
      dispatch(
        showNotif({
          status: 'success',
          title: 'success',
          message: "profile updated"
        })
      )

      // update the profile pic (if there was any in the response)
      if (parsed.profilePicUrl) dispatch(setProfilePic(parsed.profilePicUrl))

      // redirect after 3 seconds
      const timer = setTimeout(() => {
        navigate('/', { replace: true })
      }, 3000)
  
      // Cleanup function (so we don't end up with multiple timers on)
      return () => clearTimeout(timer)
    }
  }

  return (
    <div className='text-white max-w-4xl mx-auto pt-10 pb-20 px-2'>
      <h1 className='text-2xl text-center pb-8'>Profile Settings</h1>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className='space-y-4'
      >
        <Input
          id='userName'
          type='text'
          label='Username'
          register={register}
          registerOptions={{ required: true }}
          errors={errors}
          isRequired={true}
        />

        <Input
          id='firstName'
          type='text'
          label='First Name'
          register={register}
          registerOptions={{ required: false }}
          errors={errors}
          isRequired={false}
        />

        <Input
          id='lastName'
          type='text'
          label='Last Name'
          register={register}
          registerOptions={{ required: false }}
          errors={errors}
          isRequired={false}
        />

        <Input
          id='email'
          type='email'
          label='Email'
          register={register}
          registerOptions={{ required: true }}
          errors={errors}
          isRequired={true}
        />

        <InputFile
          label='profile pic'
          inputId='profilePic'
          filenameBoxId='picFile'
          btnLabel='select a pic'
          clearPicLabel='clear pic'
          register={register}
          registerOptions={{ required: false }}
          errors={errors}
          setValue={setValue}
          isRequired={false} // for showing the asterisk
        />

        <button
          type='submit'
          className={`p-3 border-[1px] border-slate-500 rounded-md hover:enabled:bg-white hover:enabled:bg-opacity-20 w-full`}
        >
          Submit
        </button>
      </form>
    </div>
  )
}
