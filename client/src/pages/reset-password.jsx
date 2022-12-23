import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../components/input'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { showNotif } from '../store/notificationsSlice'

const validationSchema = z.object({
  password: z
  .string()
  .min(5, { message: 'Between 5-10 characters' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
    message: 'Upper and lowercase letters, and digits',
  }),
  password_confirmation: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
      message: 'Upper and lowercase letters, and digits',
    })
  })
.refine((data) => data.password === data.password_confirmation, {
  path: ['password_confirmation'],
  message: "Password don't match",
})

export default function ResetPasswordPage() {
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
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  async function submitHandler(data) {
    // console.log(data) // testing
    dispatch(
      showNotif({
        status: 'loading',
        title: 'updating password',
        message:
          "We're processing your Password Update request",
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
          title: 'error',
          message: parsed.error
        })
      )

      // and redirect
      navigate('/', { replace: true })
    } else {
      // console.log(`password request OK: ${JSON.stringify(parsed.message)}`) // testing!!!

      dispatch(
        showNotif({
          status: 'success',
          title: 'Password has been Updated',
          message: parsed.message
        })
      )

      // and redirect
      navigate('/', { replace: true })
    }
  }

  return (
    <div className='text-white max-w-3xl mx-auto pt-10 pb-20 px-2'>
      <h1 className='text-2xl text-center pb-8'>Enter your New Password</h1>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className='space-y-4'
      >
        <Input
          id='password'
          type='password'
          label='Password'
          register={register}
          registerOptions={{ required: true }}
          errors={errors}
          isRequired={true}
        />

        <Input
          id='password_confirmation'
          type='password'
          label='Password Confirmation'
          register={register}
          registerOptions={{ required: true }}
          errors={errors}
          isRequired={true}
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
