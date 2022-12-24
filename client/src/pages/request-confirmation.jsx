import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../components/input'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { showNotif } from '../store/notificationsSlice'

const validationSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email' }),
})

export default function RequestConfirmationPage() {
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
        title: 'requesting email',
        message:
          "We're processing your Confirmation Link request",
      }),
    )

    const response = await fetch(`/api/users/confirm?email=${data.email}`)
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
    } else {
      // console.log(`password request OK: ${JSON.stringify(parsed.message)}`) // testing!!!

      dispatch(
        showNotif({
          status: 'success',
          title: 'Confirmation Link Sent',
          message: parsed.message
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
      <h1 className='text-2xl text-center pb-8'>Request a Comfirmation Link</h1>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className='space-y-4'
      >
        <Input
          id='email'
          type='email'
          label='Email'
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
