import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// form validation
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// components
import Input from '../components/input'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { showNotif } from '../store/notificationsSlice'

// homemade i18n
import t from '../i18n/i18n'

export default function ResetPasswordPage() {
  const { activeLanguage } = useSelector(slices => slices.language)


const validationSchema = z.object({
  password: z
    .string()
    .min(5, {
      message: t(activeLanguage, 'resetPasswordPage.passwordInput.regexWarning')
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
      message: t(activeLanguage, 'resetPasswordPage.passwordInput.regexWarning')
      // 'Upper and lowercase letters, and digits',
    }),
    password_confirmation: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
        message: t(activeLanguage, 'resetPasswordPage.confirmPasswordInput.regexWarning')
      })
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ['password_confirmation'],
    message: t(activeLanguage, 'resetPasswordPage.confirmPasswordInput.noMatchWarning')
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: 'all',
    resolver: zodResolver(validationSchema),
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  async function submitHandler(data) {
    // console.log(data) // testing
    dispatch(
      showNotif({
        status: 'loading',
        message:
          t(activeLanguage, 'resetPasswordPage.notification.loading')
      }),
    )

    const response = await fetch(`/api/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email:                  email,
        token:                  token,
        password:               data.password,
        password_confirmation:  data.password_confirmation
      })
    })
    const parsed = await response.json()
    if (parsed.error) {
      // console.log(`password request failed: ${JSON.stringify(parsed.error)}`) // testing!!!

      dispatch(
        showNotif({
          status: 'error',
          message: t(activeLanguage, 'resetPasswordPage.notification.error')
        })
      )

      // and redirect
      navigate('/', { replace: true })
    } else {
      // console.log(`password request OK: ${JSON.stringify(parsed.message)}`) // testing!!!

      dispatch(
        showNotif({
          status: 'success',
          message: t(activeLanguage, 'resetPasswordPage.notification.success')
        })
      )

      // and redirect
      navigate('/', { replace: true })
    }
  }

  return (
    <div className='text-white max-w-3xl mx-auto pt-10 pb-20 px-2'>
      <h1 className='text-2xl text-center pb-8'>
        {t(activeLanguage, 'resetPasswordPage.title')}
      </h1>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className='space-y-4'
      >
        <Input
          id='password'
          type='password'
          label={t(activeLanguage, 'resetPasswordPage.passwordInput.label')}
          register={register}
          registerOptions={{ required: true }}
          errors={errors}
          isRequired={true}
        />

        <Input
          id='password_confirmation'
          type='password'
          label={t(activeLanguage, 'resetPasswordPage.confirmPasswordInput.label')}
          register={register}
          registerOptions={{ required: true }}
          errors={errors}
          isRequired={true}
        />

        <button
          type='submit'
          className={`p-3 border-[1px] border-slate-500 rounded-md hover:enabled:bg-white hover:enabled:bg-opacity-20 w-full`}
        >
          {t(activeLanguage, 'resetPasswordPage.submitBtn')}
        </button>
      </form>
    </div>
  )
}
