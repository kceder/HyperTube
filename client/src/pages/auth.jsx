import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../components/input'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
// redux
import { useSelector, useDispatch } from 'react-redux'
import { logIn } from '../store/authSlice'
import { showNotif } from '../store/notificationsSlice'

// homemade i18n
import t from '../i18n/i18n'

export default function AuthPage() {
  const { activeLanguage } = useSelector(slices => slices.language)
  
  const validationSchema = z.object({
    userName: z
      .string()
      .min(1, { message: t(activeLanguage, 'logInPage.usernameInput.min') })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
        // message: '5-10 upper and lowercase letters, and digits',
        message: t(activeLanguage, 'logInPage.usernameInput.regex')
      }),
    password: z
      .string()
      .min(5, { message: t(activeLanguage, 'logInPage.passwordInput.min') })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
        // message: 'Upper and lowercase letters, and digits'
        message: t(activeLanguage, 'logInPage.passwordInput.regex')
      }),
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    mode: 'all',
    resolver: zodResolver(validationSchema),
  })

  const navigate = useNavigate()
  // Redux
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector(slices => slices.auth)

  React.useEffect(() => {
    if (isLoggedIn)
      navigate('/', { replace: true })
  }, [])

  async function submitHandler(data) {
    // console.log(data.userName, data.password) // testing

    async function sendRequest() {
      dispatch(
        showNotif({
          status: 'loading',
          message: t(activeLanguage, 'logInPage.notification.loading')
        }),
      )
      const result = await fetch('api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.userName,
          password: data.password
        }),
        // credentials: 'include'
      })
      // console.log(result) // testing
      const parsed = await result.json()
      // console.log(parsed) // testing

      if (!parsed.error) {
        // Let's clear the input fields (unnecessary if we redirect...)
        if (parsed.unconfirmed) {
          // Show notification
          dispatch(
            showNotif({
              status: 'success',
              message: t(activeLanguage, 'logInPage.notification.unconfirmed')
            }),
          )
        } else {
          setValue('userName', '')
          setValue('password', '')
          console.log(parsed.message)
          // Show notification
          dispatch(
            showNotif({
              status: 'success',
              message: t(activeLanguage, 'logInPage.notification.success')
            }),
          )
          // set global state
          dispatch(logIn({
            uid: parsed.uid,
            username: parsed.username,
            profilePic: parsed.profilePic,
            accessToken: parsed.accessToken
          }))
        }
        // And redirect the user to the main page
        navigate('/', { replace: true })
      } else {
        console.log(parsed.error) // testing

        // Show notification
        dispatch(
          showNotif({
            status: 'error',
            message: t(activeLanguage, 'logInPage.notification.error')
          })
        )
        setValue('password', '')
      }
    }
    sendRequest()
  }

  // Let's build the 42 OAuth url string here (it's long AF)
  let fortyTwoUrl = `${import.meta.env.VITE_FORTY_TWO_OAUTH_BASE_URL}?`
  fortyTwoUrl += `client_id=${import.meta.env.VITE_FORTY_TWO_CLIENT_ID}&`
  fortyTwoUrl += `redirect_uri=${import.meta.env.VITE_FORTY_TWO_REDIRECT}&`
  fortyTwoUrl += `response_type=code&`
  fortyTwoUrl += `scope=public`

  return (
    <div className='text-white max-w-4xl mx-auto pt-10 pb-20 px-2'>
      <h1 className='text-2xl text-center pb-8'>
        {t(activeLanguage, 'logInPage.title')}
      </h1>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className='space-y-4 flex flex-col items-center md:max-w-[80%] mx-auto'
        id='login'
      >
        <Input
          id='userName'
          type='text'
          label={t(activeLanguage, 'logInPage.usernameInput.label')}
          register={register}
          registerOptions={{ required: true }}
          errors={errors}
          isRequired={true}
        />

        <Input
          id='password'
          type='password'
          label={t(activeLanguage, 'logInPage.passwordInput.label')}
          register={register}
          registerOptions={{ required: true }}
          errors={errors}
          isRequired={true}
        />

        <button
          type='submit'
          disabled={!isValid}
          className={`p-3 border-[1px] border-slate-500 rounded-md hover:enabled:bg-white hover:enabled:bg-opacity-20 disabled:cursor-not-allowed w-[90%]`}
        >
          {isValid ?
          t(activeLanguage, 'logInPage.submitBtn.submitForm')
          : 
          t(activeLanguage, 'logInPage.submitBtn.fillForm')}
        </button>
      </form>

      <div className='flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0 md:max-w-[80%] mx-auto pt-8 px-6 text-center'>
        <Link to='/sign-up' className='hover:scale-110 hover:cursor-pointer hover:underline hover:underline-offset-4 md:self-start'>Create Account?</Link>
        <div className='flex flex-col space-y-6 md:text-right'>
          <Link to='/forgot-password' className='hover:scale-110 hover:cursor-pointer hover:underline hover:underline-offset-4'>Forgot your Password?</Link>
          <Link to='/request-confirmation' className='hover:scale-110 hover:cursor-pointer hover:underline hover:underline-offset-4'>Need Confirmation Email?</Link>
        </div>
      </div>

      <div className='inline-flex justify-center items-center w-full space-x-2 my-4'>
        <hr className='inline my-8 w-[40%] h-1 bg-gray-200 rounded border-0 dark:bg-gray-700' />
        <p>or</p>
        <hr className='inline my-8 w-[40%] h-1 bg-gray-200 rounded border-0 dark:bg-gray-700' />
      </div>

      <div className='space-y-4 md:max-w-[80%] mx-auto'>
        <a
          className='border border-gray-700 rounded-md flex p-4 space-x-4 items-center justify-center hover:cursor-pointer hover:bg-white hover:bg-opacity-20 group'
          href={fortyTwoUrl}       
        >
          <img
            src='/assets/42.svg'
            alt='github'
            className='inline group-hover:scale-125'
            width={32}
            height={32}
          />
          <p className='py-3 group-hover:underline group-hover:underline-offset-4'>
            {t(activeLanguage, 'logInPage.42Access')}
          </p>
        </a>

        <a
          className='border border-gray-700 rounded-md flex p-4 space-x-4 items-center justify-center hover:cursor-pointer hover:bg-white hover:bg-opacity-20 group'
          href={`${import.meta.env.VITE_GITHUB_OAUTH_URL}${import.meta.env.VITE_GITHUB_CLIENT_ID}`}
        >
          <img
            src='/assets/github.svg'
            alt='github'
            className='inline group-hover:scale-125'
            width={32}
            height={32}
          />
          <p className='py-3 group-hover:underline group-hover:underline-offset-4'>
          {t(activeLanguage, 'logInPage.GHAccess')}
          </p>
        </a>
      </div>
    </div>
  )
}
