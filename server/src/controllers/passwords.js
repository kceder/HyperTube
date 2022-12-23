// To validate incoming data
import { z } from 'zod'

// To hash the Email Tokens before writing them to DB (later to locate them)
import crypto from 'crypto' // No need to install, included in Node.js

// To send emails
import { transporter } from '../lib/mailer.js'

// To deal with the users table (DB)
import { findByEmail } from '/app/src/models/user.js'

// To save/delete email tokens
import { saveToken, deleteTokenByEmail } from '/app/src/models/email-token.js'

/**
 * This function receives the user's email in the query string and validates it.
 * Then checks the DB to verify the user exists:
 * 
 *  - If it doesn't return error response.
 *  - If it does, deletes preexisting email_token, generates and saves a new
 * one, sends it in an email to the user, and returns a success response.
 * 
 * @param {String} req.query.email 
 * @param {*} res 
 * @returns 
 */
async function requestPasswordResetEmail(req, res) {
  const email = req.query.email
  
  // Define a validation schema for the data sent by the user (her email)
  const validationSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Must be a valid email' })
  })

  // Validate user data (zod)
  try {
    const parsedEmail = validationSchema.parse({ email })
  } catch (errors) {
    const firstError = JSON.parse(errors)[0].message
    // console.log(`Errors parsing Email: ${JSON.parse(errors)[0].message}`) // testing
    return res.status(400).json({ error: firstError })
  }

  // Check that the user exists in our DB
  const user = await findByEmail({ email: req.query.email })
  if (!user) {
    return res.status(404).json({ error: 'Email does not exist in our DB' })
  }

  /* Delete old Email token from DB (if any). This can only happen if some user
  requested several tokens using her email address. Only 1 token per email! */
  await deleteTokenByEmail({ email: user.email })

  // Generate Email Token Hash
  const emailTokenHash = crypto.randomBytes(16).toString('hex')

  const unixtimeInSeconds = Math.floor(Date.now() / 1000)
  // console.log(unixtimeInSeconds + eval(process.env.EMAIL_TOKEN_EXP)) // test

  // Write new Email token to DB
  const emailTokenCreated = saveToken({
    email,
    token_hash: emailTokenHash,
    expires_at: unixtimeInSeconds + eval(process.env.EMAIL_TOKEN_EXP) // 2 days
  })

  if (!emailTokenCreated)
    return res.status(200).json({
      error: 'Sorry, there was some issue generating your confirmation link!'
    })
  
  // console.log(`req.hostname: ${req.hostname}`)
  // Set the email options,
  const mailOptions = {
    from: process.env.WEBADMIN_EMAIL_ADDRESS,
    to: email,
    subject: 'Reset your HyperTube password',
    html: `<h1>It seems you want to reset your password.</h1>
    <p>
    Please, click <a href="http://localhost/reset-password?email=${email}&token=${emailTokenHash}" >here</a> to reset your password!
    </p>`
  }

  // Send Account Confirmation Email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error) // testing
      res.status(400).json({
        error: `Error sending Password Reset Link: ${error}`
      })
    }
    else {
      console.log('Email sent: ' + info.response)// testing
      res.status(200).json({
        message: `Password Reset Link sent to ${req.query.email}`
      })
    }
  })
}

/**
 * This function receives the user's email, the email_token and the new
 * password (and password confirmation) in the request body and validates them.
 * If any of them are not valid, returns an error response; if they're valid:
 *
 *  1. Checks the DB to verify the email/token combo exists, returning an
 *  error response if it doesn't.
 *  2. Then deletes the token, and set the user's new password.
 *  
 * @param {String} req.body.email 
 * @param {String} req.body.token 
 * @param {String} req.body.password 
 * @param {String} req.body.password_confirmation 
 * @param {*} res 
 * @returns 
 */
async function resetPassword(req, res) {
  const { email, token, password, password_confirmation } = req.query
  console.log(email, token, password, password_confirmation)
}

export { requestPasswordResetEmail, resetPassword }