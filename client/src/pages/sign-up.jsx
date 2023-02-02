// form and form validation
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// components
import Input from '../components/input'
import InputFile from '../components/input-file'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { showNotif } from '../store/notificationsSlice'
import { useNavigate } from 'react-router-dom'

// homemade i18n
import t from '../i18n/i18n'

const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export default function SignUpPage() {
  const { activeLanguage } = useSelector((slices) => slices.language)

  const validationSchema = z
    .object({
      userName: z
        .string()
        .min(1, {
          message: t(activeLanguage, 'signUpPage.userNameInput.minWarning'),
        })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
          message: t(activeLanguage, 'signUpPage.userNameInput.regexWarning'),
        })
        .refine(
          async (userName) => {
            const resp = await fetch(`/api/usernames?username=${userName}`)
            const data = await resp.json()
            const usernameExists = data.message
            // console.log('usernameExists? '+ usernameExists)
            return !usernameExists
          },
          {
            message: t(
              activeLanguage,
              'signUpPage.userNameInput.alreadyExists',
            ),
          },
        ),
      firstName: z
        .string()
        .min(1, {
          message: t(activeLanguage, 'signUpPage.firstNameInput.minWarning'),
        })
        .max(30, {
          message: t(activeLanguage, 'signUpPage.firstNameInput.maxWarning'),
        })
        .regex(/^[A-Za-z\ ]*$/, {
          message: t(activeLanguage, 'signUpPage.firstNameInput.regexWarning'),
        }),
      lastName: z
        .string()
        .min(1, {
          message: t(activeLanguage, 'signUpPage.lastNameInput.minWarning'),
        })
        .max(30, {
          message: t(activeLanguage, 'signUpPage.lastNameInput.maxWarning'),
        })
        .regex(/^[A-Za-z\ ]*$/, {
          message: t(activeLanguage, 'signUpPage.lastNameInput.regexWarning'),
        }),
      email: z
        .string()
        .min(1, {
          message: t(activeLanguage, 'signUpPage.emailInput.minWarning'),
        })
        .email({
          message: t(activeLanguage, 'signUpPage.emailInput.validEmailWarning'),
        }),
      password: z
        .string()
        .min(5, {
          message: t(activeLanguage, 'signUpPage.passwordInput.minWarning'),
        })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
          message: t(activeLanguage, 'signUpPage.passwordInput.regexWarning'),
        }),
      confirmPassword: z
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
          message: t(
            activeLanguage,
            'signUpPage.confirmPasswordInput.regexWarning',
          ),
        }),
      profilePic: z
        .any()
        .refine((files) => {
          // console.log('file list', files, files.length)
          if (files.length === 0) return true
          else if (files.length && files[0].size <= MAX_FILE_SIZE) return true
          else return false
        }, t(activeLanguage, 'signUpPage.pictureInput.maxSizeWarning'))
        .refine((files) => {
          if (files.length === 0) return true
          else if (files.length && ACCEPTED_IMAGE_TYPES.includes(files[0].type))
            return true
          else return false
        }, t(activeLanguage, 'signUpPage.pictureInput.filetypeWarning')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t(
        activeLanguage,
        'signUpPage.confirmPasswordInput.matchWarning',
      ),
    })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    clearErrors,
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
        message: t(activeLanguage, 'signUpPage.notification.loading'),
      }),
    )
    // console.log(data)
    const formData = new FormData()
    formData.append('userName', data.userName)
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('email', data.email)
    formData.append('password', data.password)

    /* If the user added a profile picture, 'data.profilePic' is a FileList 
      array (truthy value). Otherwise it's a falsey empty string. */
    if (data.profilePic[0]) {
      // Add the profile pic at the end of the form.
      formData.append('profilePic', data.profilePic[0])
      // console.log('submitting',data.profilePic[0]) // testing
    }

    const response = await fetch('/api/users', {
      method: 'POST',
      body: formData,
    })
    const parsed = await response.json()
    if (parsed.error) {
      console.log(`sign-up failed: ${JSON.stringify(parsed.error)}`) // testing!!!
      dispatch(
        showNotif({
          status: 'error',
          message: t(activeLanguage, 'signUpPage.notification.error'),
        }),
      )
    } else {
      // console.log(`sign-up OK: ${JSON.stringify(parsed.message)}`) // testing!!!
      dispatch(
        showNotif({
          status: 'success',
          message: t(activeLanguage, 'signUpPage.notification.success'),
        }),
      )
      // and redirect
      navigate('/', { replace: true })
    }
  }

  // console.log(watch('profilePic')) // we can watch input content on 'change' events
  // console.log(errors) // testing
  return (
    <div className='text-white w-[18rem] md:w-[22rem] mx-auto pt-5 pb-2 px-2'>
      <h1 className='text-xl text-center pb-5'>
        {t(activeLanguage, 'signUpPage.title')}
      </h1>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className='space-y-4'
      >
        <Input
          id='userName'
          type='text'
          label={t(activeLanguage, 'signUpPage.userNameInput.label')}
          register={register}
          registerOptions={{ required: true }}
          errors={errors}
          isRequired={true} // for showing the asterisk
        />

        <Input
          id='firstName'
          type='text'
          label={t(activeLanguage, 'signUpPage.firstNameInput.label')}
          register={register}
          registerOptions={{ required: false }}
          errors={errors}
          isRequired={true}
        />

        <Input
          id='lastName'
          type='text'
          label={t(activeLanguage, 'signUpPage.lastNameInput.label')}
          register={register}
          registerOptions={{ required: false }}
          errors={errors}
          isRequired={true}
        />

        <Input
          id='email'
          type='email'
          label={t(activeLanguage, 'signUpPage.emailInput.label')}
          register={register}
          registerOptions={{ required: true }}
          errors={errors}
          isRequired={true}
        />

        <Input
          id='password'
          type='password'
          label={t(activeLanguage, 'signUpPage.passwordInput.label')}
          register={register}
          registerOptions={{ required: true }}
          errors={errors}
          isRequired={true}
        />

        <Input
          id='confirmPassword'
          type='password'
          label={t(activeLanguage, 'signUpPage.confirmPasswordInput.label')}
          register={register}
          registerOptions={{ required: true }}
          errors={errors}
          isRequired={true}
        />

        <InputFile
          label={t(activeLanguage, 'signUpPage.pictureInput.label')}
          inputId='profilePic'
          noFilePlaceholder={t(
            activeLanguage,
            'signUpPage.pictureInput.noFilePlaceholder',
          )}
          btnLabel={t(activeLanguage, 'signUpPage.pictureInput.btnLabel')}
          clearPicLabel={t(
            activeLanguage,
            'signUpPage.pictureInput.clearPicLabel',
          )}
          register={register}
          registerOptions={{ required: false }}
          errors={errors}
          setValue={setValue}
          isRequired={false} // for showing the asterisk
        />

        <button
          type='submit'
          disabled={!isValid}
          className={`p-3 border-[1px] border-slate-500 rounded-md hover:enabled:bg-white hover:enabled:bg-opacity-20 disabled:cursor-not-allowed w-full`}
        >
          {isValid
            ? t(activeLanguage, 'signUpPage.submitBtn.submitForm')
            : t(activeLanguage, 'signUpPage.submitBtn.fillForm')}
        </button>
      </form>
    </div>
  )
}
