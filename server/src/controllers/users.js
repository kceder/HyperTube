// To parse the incoming form
import formidable from 'formidable'

// To validate incoming data
import { z } from 'zod'

// To hash the Email Tokens before writing them to DB (later to locate them)
import crypto from 'crypto' // No need to install, included in Node.js

// To save the pic to the filesystem
import { savePic, deletePic } from '/app/src/lib/picUtils.js'

// To save/delete email tokens
import {
  saveToken,
  deleteTokenByEmail,
} from '/app/src/models/email-token.js'

// To hash passwords before saving them to DB
import { hashPassword } from '/app/src/lib/auth.js'

// To send emails
import { transporter } from '../lib/mailer.js'

// To peek into the content of user uploaded files
import { fileTypeFromFile } from 'file-type'

// To deal with the users table (DB)
import {
  findByUsername,
  findByEmail,
  findByUid,
  createUser,
  writeProfilePic,
  updateUserProfile
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
      .email({ message: 'Must be a valid email' })
      .refine(
        async (email) => {
          const user = await findByEmail({ email })

          return user ? false : true
        },
        { message: 'Email already exists' }
      ),
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
        async (file) => {
          if (!file) return true // if the user didn't submit a file
          // console.log(JSON.stringify(file)) // testing

          const result = await fileTypeFromFile(file.filepath)
          if (!result) return false     // if file is not recognized (undefined)
          const { ext, mime } = result  // if file is recognized
          console.log(`File: ${mime}, ${ext}`) // testing
          if (ACCEPTED_IMAGE_TYPES.includes(mime)) return true
        },
        'Only .jpg, .jpeg, .png and .webp formats are supported.'
      ),
  })

  const validationSchema2 = z
  .object({
    userName: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
        message: '5-10 upper and lowercase letters, and digits',
      }),
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
    profilePic: z
      .any()
      .refine(
        (file) => !file || file.size <= MAX_FILE_SIZE,
        `Max image size is 5MB.`
      )
      .refine(
        async (file) => {
          if (!file) return true // if the user didn't submit a file

          const result = await fileTypeFromFile(file.filepath)
          if (!result) return false     // if file is not recognized (undefined)
          const { ext, mime } = result  // if file is recognized
          // console.log(`File: ${mime}, ${ext}`) // testing
          if (ACCEPTED_IMAGE_TYPES.includes(mime)) return true
        },
        'Only .jpg, .jpeg, .png and .webp formats are supported.'
      ),
  })

// Important! We have to disable bodyParser to parse incoming data as a Form
export const config = { api: { bodyParser: false } }

async function handleProfilePic(oldProfilePic, profilePic, uid) {
  console.log(`handleProfilePic: ${JSON.stringify(profilePic)}`)
  console.log(`handleProfilePic: ${oldProfilePic} - ${uid}`)
  let profilePicUrl = ''
  // Save picture to filesystem
  if (profilePic) {
    console.log('Saving to fs ', profilePic.newFilename) // testing
    try {
      // savePic returns the URL of the saved pic
      profilePicUrl = await savePic(profilePic, uid)
    } catch (error) {
      // console.log('could not save pic', error) // testing
      throw new Error(`couldn't save pic: ${error.stack}`)
    }
    // Delete Old profile pic (if there's one)
    if (oldProfilePic) {
      console.log('oldProfilePic? ', oldProfilePic);
      try {
        deletePic(oldProfilePic)
      } catch (error) {
        console.log(error)
      }
    }
  }

  // Writing the profile picture url to the DB
  if (profilePicUrl) {
    try {
      const result = await writeProfilePic({
        profilePic: profilePicUrl,
        uid: uid
      })
      console.log(result)
    } catch (error) {
      console.log('could not save pic url to DB', error) // testing
      throw new Error(`could not save pic url to DB: ${error}`)
    }
  }
  return profilePicUrl
}

async function signUpUser(req, res) {
  const form = new formidable.IncomingForm()

  form.parse(req, async function (err, fields, files) {
    const profilePic =  files?.profilePic === undefined ? false : files.profilePic

    try {
      // Validate user data (zod)
      const parsedUser = await validationSchema.parseAsync({
        ...fields,
        profilePic: profilePic
      })
    } catch (errors) {
      const firstError = JSON.parse(errors)[0].message
      // console.log(`Errors parsing User: ${JSON.parse(errors)[0].message}`) // testing
      return res.status(400).json({
        error: firstError
      })
    }

    // Let's check that the email doesn't exist in our DB
    const user = await findByEmail({ email: fields.email })
    if (user)
      return res.status(400).json({ error: 'email already exists' })

    let uid
    // Save user intel to DB
    try {
      const hashed_password = await hashPassword(fields.password)
      
      const newUser = {
        username:       fields.userName,
        firstname:      fields.firstName,
        lastname:       fields.lastName,
        email:          fields.email,
        hashed_password,
        profile_pic:    '',
        confirmed:      false
      }

      const createdUser = await createUser(newUser)
      uid = createdUser.id
    } catch (error) {
      return res.status(422).json({
        error: `couldn't create account: ${error.stack}`
      })
    }
    let profilePicUrl
    // Let's try to write the pic to filesystem and DB
    try {
      // We pass false as 1st argument because there's no old pic to delete!
      profilePicUrl = handleProfilePic(false, profilePic, uid)
    } catch(error) {
      return res.status(422).json({
        error: error
      })
    }

    // DELETE ANY PREEXISTING TOKEN! (clumsy user who signs up again)
    await deleteTokenByEmail({ email: fields.email })

    // Generate Email Token Hash
    const emailTokenHash = crypto.randomBytes(16).toString('hex')

    const unixtimeInSeconds = Math.floor(Date.now() / 1000)
    // console.log(unixtimeInSeconds + eval(process.env.EMAIL_TOKEN_EXP)) // test

    // Save the Email token to DB
    const emailTokenCreated = saveToken({
      email: fields.email,
      token_hash: emailTokenHash,
      expires_at: unixtimeInSeconds + eval(process.env.EMAIL_TOKEN_EXP) // 2 days
    })

    // Set the email options,
    const mailOptions = {
      from: process.env.WEBADMIN_EMAIL_ADDRESS,
      to: fields.email,
      subject: 'Confirm your HyperTube account',
      html: `<h1>Welcome to HyperTube!</h1>
      <p>
      Please, click <a href="http://localhost/confirm-account?email=${fields.email}&token=${emailTokenHash}" >here</a> to confirm your account!
      </p>`
    }

    // Send Account Confirmation Email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error) // testing
        res.status(400).json({
          error: `Error sending Account Confirmation Link: ${error}`
        })
      }
      else {
        console.log('Email sent: ' + info.response)// testing
        res.status(200).json({
          message: `Account Confirmation Link sent to ${req.query.email}`
        })
      }
    })

    res.status(200).json({ message: 'user account successfully created' })
  })
}

async function getUser(req, res) {
  const uid = parseInt(req.params.id)
  // console.log(`uid: ${uid}, typeof uid: ${typeof uid}`) // testing
  let user
  try {
    user = await findByUid({ uid })
  } catch (error) {
    return res.status(400).json({ error: 'something went wrong' })
  }
  
  if (!user)
    return res.status(400).json({ error: 'user does not exist' })

  delete user.password // don't send the password in any case

  /* If the requested user is not the one in the access token (that the 
    validateToken middleware hung in the req.uid property) don't send
    the email. */
  if (req.uid !== uid) delete user.email

  return res.status(200).json({ user })
}

async function updateUser(req, res) {
  const uid = parseInt(req.params.id)
  /* If the requested user is not the one in the access token (that the 
    validateToken middleware hung in the req.uid property) don't bother
    to continue. */
  if (req.uid !== uid)
    return res.status(400).json({ error: 'something went wrong' })

  let user
  try {
    user = await findByUid({ uid })
  } catch (error) {
    return res.status(400).json({ error: 'something went wrong' })
  }

  if (!user)
    return res.status(400).json({ error: 'user does not exist' })
  
  const form = new formidable.IncomingForm()
  form.parse(req, async function (err, fields, files) {
    console.log(`fields: ${JSON.stringify(fields)}`) // testing
    const profilePic =  files?.profilePic === undefined ? false : files.profilePic

    if (profilePic) { // <======== TESTING!!!!!!
      console.log('it seems we received: ', profilePic.originalFilename) // testing
      console.log(profilePic?.mimetype) // testing
      console.log(profilePic?.size) // testing
    }

    // Validate user data (zod)
    try {
      const parsedUser = await validationSchema2.parseAsync({
        ...fields,
        profilePic: profilePic
      })
    } catch (errors) {
      const firstError = JSON.parse(errors)[0].message
      console.log(`Errors parsing User: ${JSON.parse(errors)[0].message}`) // testing
      return res.status(400).json({
        error: firstError
      })
    }

    const toBeUpdatedUser = {
      uid,
      username: (user.username === fields.userName) ? user.username : fields.userName,
      firstname: (user.firstname === fields.firstName) ? user.firstname : fields.firstName,
      lastname: (user.lastname === fields.lastName) ? user.lastname : fields.lastName,
      email: (user.email === fields.email) ? user.email : fields.email
    }

    try {
      await updateUserProfile(toBeUpdatedUser)
    } catch (error) {
      return res.status(400).json({ error: 'something went wrong' })
    }
    
    let profilePicUrl
    // Let's try to write the new pic to filesystem and DB (and delete old one)
    try {
      profilePicUrl = await handleProfilePic(user.profile_pic, profilePic, uid)
      // console.log(`profilePicUrl: ${profilePicUrl}`) // testing
    } catch(error) {
      return res.status(422).json({
        error: error
      })
    }
    // If all went OK, let's return a successful response
    return res.status(200).json({
      message: 'user profile successfully updated',
      profilePicUrl
    })
  })
}



export { signUpUser, getUser, updateUser }