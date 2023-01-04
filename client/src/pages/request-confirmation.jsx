import React from 'react'
import { useNavigate } from 'react-router-dom'

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

export default function RequestConfirmationPage() {
  const { activeLanguage } = useSelector(slices => slices.language)
  
  const validationSchema = z.object({
    email: z
      .string()
      .min(1, {
        message: t(activeLanguage, 'requestConfirmationLinkPage.emailInput.minWarning')
      })
      .email({
        message: t(activeLanguage, 'requestConfirmationLinkPage.emailInput.validEmailWarning')
      })
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

  async function submitHandler(data) {
    // console.log(data) // testing
    dispatch(
      showNotif({
        status: 'loading',
        message:
        t(activeLanguage, 'requestConfirmationLinkPage.notification.loading')
      }),
    )

    const response = await fetch(`/api/users/confirm?email=${data.email}`)
    const parsed = await response.json()
    if (parsed.error) {
      // console.log(`password request failed: ${JSON.stringify(parsed.error)}`) // testing!!!

      dispatch(
        showNotif({
          status: 'error',
          message: t(activeLanguage, 'requestConfirmationLinkPage.notification.error')
        })
      )
    } else {
      // console.log(`password request OK: ${JSON.stringify(parsed.message)}`) // testing!!!

      dispatch(
        showNotif({
          status: 'success',
          message: t(activeLanguage, 'requestConfirmationLinkPage.notification.success')
        })
      )
    }
    // redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate('/', { replace: true })
    }, 3000)

    // Cleanup function (so we don't end up with multiple timers on)
    return () => clearTimeout(timer)
  }

  return (
    <div className='text-white max-w-3xl mx-auto pt-10 pb-20 px-2'>
      <h1 className='text-2xl text-center pb-8 capitalize'>
        {t(activeLanguage, 'requestConfirmationLinkPage.title')}
      </h1>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className='space-y-4'
      >
        <Input
          id='email'
          type='email'
          label={t(activeLanguage, 'requestConfirmationLinkPage.emailInput.label')}
          placeholder={t(activeLanguage, 'requestConfirmationLinkPage.emailInput.placeholder')}
          register={register}
          registerOptions={{ required: true }}
          errors={errors}
          isRequired={true}
        />

        <button
          type='submit'
          className={`p-3 border-[1px] border-slate-500 rounded-md hover:enabled:bg-white hover:enabled:bg-opacity-20 w-full`}
        >
          {t(activeLanguage, 'requestConfirmationLinkPage.submitBtn')}
        </button>
      </form>
    </div>
  )
}
