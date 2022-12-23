// To validate incoming data
import { z } from 'zod'

// To hash the Email Tokens before writing them to DB (later to locate them)
import crypto from 'crypto' // No need to install, included in Node.js

// To send emails
import { transporter } from '../lib/mailer.js'

// To deal with the users table (DB)
// import { updatePassword } from '/app/src/models/user.js'

// To verify/delete email tokens
import {
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
 * @param {String} req.query.email_token
 * @param {*} res 
 * @returns 
 */
async function confirmUserAccount(req, res) {
  const { email, email_token } = req.query
  console.log(email, token)
}

export { confirmUserAccount }