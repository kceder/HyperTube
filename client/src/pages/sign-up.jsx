import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../components/input'
import { XCircleIcon } from '@heroicons/react/24/outline'
import { useDispatch } from 'react-redux'
import { showNotif } from '../store/notificationsSlice'
import { useNavigate } from 'react-router-dom'

const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

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
          const resp = await fetch(`/api/usernames?username=${userName}`)
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
    password: z
      .string()
      .min(5, { message: 'Between 5-10 characters' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
        message: 'Upper and lowercase letters, and digits',
      }),
    confirmPassword: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
        message: 'Upper and lowercase letters, and digits',
      }),
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
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Password don't match",
  })

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue
  } = useForm({
    mode: 'all',
    resolver: zodResolver(validationSchema),
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function submitHandler(data) {
    dispatch(
      showNotif({
        status: 'loading',
        title: 'signing up',
        message: "We're signing you up"
      })
    )
    // console.log(data)
    const formData = new FormData()
    formData.append('userName', data.userName)
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('email', data.email)
    formData.append('password', data.password)

    // console.log('data.profilePic is an '+ data.profilePic) // testing  
    /* If the user added a profile picture, 'data.profilePic' is a FileList 
      array (truthy value). Otherwise it's a falsey empty string. */
    if (data.profilePic) {
      // Add the profile pic at the end of the form.
      formData.append('profilePic', data.profilePic[0])
      // console.log(data.profilePic[0]) // testing
    }
    
    const response = await fetch('/api/users', {
      method: 'POST',
      body: formData
    })
    const parsed = await response.json()
    if (parsed.error) {
      // console.log(`sign-up failed: ${JSON.stringify(parsed.error)}`) // testing!!!
      dispatch(
        showNotif({
          status: 'error',
          title: 'error',
          message: parsed.error
        }),
      )
    } else {
      // console.log(`sign-up OK: ${JSON.stringify(parsed.message)}`) // testing!!!
      dispatch(
        showNotif({
          status: 'success',
          title: 'success',
          message: parsed.message
        }),
      )
      // and redirect
      navigate('/', { replace: true })
    }
  }

  // console.log(watch('userName')) // we can watch input content on 'change' events
  // console.log(errors?.userName?.message) // testing
  return (
    <div className='text-white max-w-4xl mx-auto pt-10 pb-20 px-2'>
      <h1 className='text-2xl text-center pb-8'>Sign Up</h1>

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
          id='confirmPassword'
          type='password'
          label='Confirm Password'
          register={register}
          registerOptions={{ required: true }}
          errors={errors}
          isRequired={true}
        />

        <div className='relative'>
          <Input
            id='profilePic'
            type='file'
            label='Profile Picture'
            register={register}
            registerOptions={{ required: false }}
            errors={errors}
            isRequired={false}
          />
          <button
            className='absolute top-2 right-4 text-gray-400'
            onClick={(e) => {
              e.preventDefault()
              setValue('profilePic', '')
            }}
          >
            <div className='group'>
              <XCircleIcon className='inline w-4 mx-1 -mt-1 group-hover:text-red-500' />
              <span className='group-hover:text-white'>clear pic</span>
            </div>
          </button>
        </div>

        <button
          type='submit'
          disabled={!isValid}
          className={`p-3 border-[1px] border-slate-500 rounded-md hover:enabled:bg-white hover:enabled:bg-opacity-20 disabled:cursor-not-allowed w-full`}
        >
          {isValid ? 'Submit' : 'Please, fill the form'}
        </button>
      </form>
    </div>
  )
}
