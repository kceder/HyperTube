// To validate incoming data
import { z } from 'zod'

// To hash the Email Tokens before writing them to DB (later to locate them)
import crypto from 'crypto' // No need to install, included in Node.js

// To send emails
import { transporter } from '../lib/mailer.js'

// To confirm the user account (DB)
import {
  confirmUserByEmail,
  findByEmail
} from '/app/src/models/user.js'

// To verify/delete email tokens
import {
  saveToken,
  findTokenByEmail,
  deleteTokenByEmail
} from '/app/src/models/email-token.js'

/**
 * This function receives the user's email and the email_token in the request
 * body and validates them. If any of them are not valid, returns an error
 * response; if they're valid:
 *
 *  1. Checks the DB to verify the email/token combo exists, returning an
 *  error response if it doesn't.
 *  2. Then deletes the token, and set the user account as confirmed.
 *  
 * @param {String} req.query.email
 * @param {String} req.query.token
 * @param {*} res 
 * @returns 
 */
async function confirmUserAccount(req, res) {
  const validationSchema = z.object({
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Must be a valid email' }),
    token: z
      .string()
      .regex(/^[a-z\d]{32}$/, {
        message: '32 lowercase letters and digits',
      })
  })

  // console.log(`req.body: ${JSON.stringify(req.body)}`) // testing
  const { email, token } = req.body
  // console.log(email, token)

  // Let's validate user data
  const validation = validationSchema.safeParse({ email, token})
  if (!validation.success)
    return res.status(400).json({
      error: 'bad request'
    })

  const dBtoken = await findTokenByEmail({ email })
  // console.log(`token_hash: ${dBtoken.token_hash}`) // testing

  // Check if the DB contains a token for that email
  if (!dBtoken || email !== dBtoken.email || token !== dBtoken.token_hash)
    return res.status(400).json({
      error: 'invalid token'
    })

  // Confirm User Account
  const result = await confirmUserByEmail({ email })
  if (!result)
    return res.status(400).json({
      error: 'invalid token'
    })

  // console.log(`result ${JSON.stringify(result)}`) // testing

  // Delete Token from DB
  const tokenDeleted = await deleteTokenByEmail({ email })
  if (tokenDeleted !== 1)
    return res.status(400).json({
      error: 'token does not exist'
    })

  // console.log(`token deleted? ${JSON.stringify(tokenDeleted)}`);
  res.status(200).json({
    message: 'confirmed'
  })
}

async function requestConfirmation(req, res) {
  const validationSchema = z.object({
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Must be a valid email' }),
  })

  // Let's extract the email to a variable (it's sent in a query string)
  const email = req.query.email
  if (!email) {
    console.log('woops')
    return res.status(400).json({
      error: 'bad request'
    })
  }

  // Validate user data (just the email)
  const validation = validationSchema.safeParse({ email })
  if (!validation.success) {
    return res.status(400).json({
      error: 'Bad request'
    })
  }

  // Find the user in the DB (it may not exist)
  const user = await findByEmail({ email })
  if (!user) {
    return res.status(400).json({
      error: 'User does not exist'
    })
  }

  if (user.confirmed) {
    return res.status(400).json({
      error: 'Your account is already confirmed. You can log in!'
    })
  }

  // DELETE ANY PREEXISTING TOKEN! (clumsy user who signs up again)
  await deleteTokenByEmail({ email: email })

  // Generate Email Token Hash
  const emailTokenHash = crypto.randomBytes(16).toString('hex')

  const unixtimeInSeconds = Math.floor(Date.now() / 1000)
  // console.log(unixtimeInSeconds + eval(process.env.EMAIL_TOKEN_EXP)) // test

  // Save the Email token to DB
  const emailTokenCreated = saveToken({
    email: email,
    token_hash: emailTokenHash,
    expires_at: unixtimeInSeconds + eval(process.env.EMAIL_TOKEN_EXP) // 2 days
  })

  // Set the email options,
  const mailOptions = {
    from: process.env.WEBADMIN_EMAIL_ADDRESS,
    to: email,
    subject: 'Confirm your HyperTube account',
    html: `<h1>Welcome to HyperTube!</h1>
    <p>
    Please, click <a href="http://localhost/confirm-account?email=${email}&token=${emailTokenHash}" >here</a> to confirm your account!
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
        message: `Account Confirmation Link sent to ${email}`
      })
    }
  })

  console.log(email)
  // res.status(200).json({
  //   message: `Confirmation email sent to ${email}`
  // })
}

export {
  requestConfirmation,
  confirmUserAccount
}