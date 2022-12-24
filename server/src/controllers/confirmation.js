// To validate incoming data
import { z } from 'zod'

// To confirm the user account (DB)
import { confirmUserByEmail } from '/app/src/models/user.js'

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

export { confirmUserAccount }