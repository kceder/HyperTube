import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../components/input'

const validationSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email' }),
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

  async function submitHandler(data) {
    console.log(data) // testing

    const response = await fetch(`/api/users/reset?email=${data.email}`, {
      method: 'GET',
    })
    const parsed = await response.json()
    if (parsed.error) {
      console.log(`password request failed: ${JSON.stringify(parsed.error)}`) // show some feedback in modal bro!!!
    } else {
      console.log(`password request OK: ${JSON.stringify(parsed.message)}`) // show some feedback in modal bro!!!
      // and redirect
    }
  }

  return (
    <div className='text-white max-w-3xl mx-auto pt-10 pb-20 px-2'>
      <h1 className='text-2xl text-center pb-8'>Request Password Reset Link</h1>

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
