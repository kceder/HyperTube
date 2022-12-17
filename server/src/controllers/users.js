// To parse the incoming form
import formidable from 'formidable'

// To validate incoming data
import { z } from 'zod'

// To save the pic to the filesystem
import { savePic } from '/app/src/lib/picUtils.js'

// To hash passwords before saving them to DB
import { hashPassword } from '/app/src/lib/auth.js'

// To create a user, insert profile pic, and check if username already exists
import {
  findByUsername,
  createUser,
  writeProfilePic
} from '/app/src/models/user.js'

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
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
        message: '5-10 upper and lowercase letters, and digits',
      })
      .refine(
        async (userName) => {
          const user = await findByUsername({ username: userName })

          return user ? false : true
        },
        { message: 'Username already taken' }
      ),
    firstName: z
      .string()
      .min(1, { message: 'First Name is required' })
      .max(30, { message: 'Maximum 30 characters' })
      .regex(/^[a-zA-Z\s]+$/, { message: 'Only letters and spaces' }),
    lastName: z
      .string()
      .min(1, { message: 'Last Name is required' })
      .max(30, { message: 'Maximum 30 characters' })
      .regex(/^[a-zA-Z\s]+$/, { message: 'Only letters and spaces' }),
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
    profilePic: z
      .any()
      .refine(
        (file) => !file || file.size <= MAX_FILE_SIZE,
        `Max image size is 5MB.`
      )
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.mimetype),
        'Only .jpg, .jpeg, .png and .webp formats are supported.'
      ),
  })
  
// Important! We have to disable bodyParser to parse incoming data as a Form
export const config = { api: { bodyParser: false } }

async function signUpUser(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method not allowed'})
  }

  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    // console.log(fields) // testing
    const profilePic =  files?.profilePic === undefined ? false : files.profilePic
    // console.log('it seems we received: ',files.profilePic.originalFilename) // testing
    // console.log(files.profilePic?.mimetype) // testing
    // console.log(files.profilePic?.size) // testing

    try {
      // Validate user data (zod)
      const parsedUser = await validationSchema.parseAsync({
        ...fields,
        profilePic: profilePic
      })
      // console.log(`parsedUser: ${JSON.stringify(parsedUser)}`) // testing
    } catch (errors) {
      // console.log(`Errors parsing User: ${errors}`) // testing
      return res.status(400).json({
        message: JSON.stringify(errors)
      })
    }

    let uid
    // Save user intel to DB
    try {
      const hashed_password = await hashPassword(fields.password)
      
      const newUser = {
        username: fields.userName,
        firstname: fields.firstName,
        lastname: fields.lastName,
        email: fields.email,
        hashed_password
      }

      const createdUser = await createUser(newUser)
      uid = createdUser.id
      // console.log(createdUser)  // testing
    } catch (error) {
      // console.log(error.stack) // testing
      return res.status(422).json({
        message: `couldn't create account: ${error.stack}`
      })
    }
    let profilePicUrl = ''
    // Save picture to filesystem
    if (profilePic) {
      // console.log('Saving to fs ', profilePic.newFilename) // testing
      try {
        // savePic returns the URL of the saved pic
        profilePicUrl = await savePic(profilePic, uid)
      } catch (error) {
        // console.log('could not save pic', error) // testing
        return res.status(422).json({
          message: `couldn't save pic: ${error.stack}`
        })
      }
    }

    // Writing the profile picture url to the DB
    if (profilePicUrl) {
      try {
        const result = await writeProfilePic({
          profilePic: profilePicUrl,
          id: uid
        })
        console.log(result)
      } catch (error) {
        console.log('could not save pic url to DB', error) // testing
        return res.status(422).json({
          message: 'could not save user profile to DB'
        })
      }
    }
    res.status(200).json({ message: 'user account successfully created' })
  })
}

export { signUpUser }