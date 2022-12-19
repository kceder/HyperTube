// To validate incoming data
import { z } from 'zod'

// To send emails
import { transporter } from '../lib/mailer.js'

// To deal with the users table (DB)
import { findByEmail } from '/app/src/models/user.js'

async function getEmail(req, res) {
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
    return res.status(404).json({ error: 'user does not exist' })
  }

  // Generate email token
  const emailTokenHash = 'supmadafaka' // some hard-coded bullshit for now

  console.log(`req.hostname: ${req.hostname}`)
  // Set the email options,
  const mailOptions = {
    from: process.env.WEBADMIN_EMAIL_ADDRESS,
    to: email,
    subject: 'Reset your HyperTube password',
    html: `<h1>It seems you want to reset your password.</h1>
    <p>
    Please, click <a href="http://localhost/reset/${email}/${emailTokenHash}" >here</a> to reset your password!
    </p>`
  }
  
  // Send Account Confirmation Email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error)
    else console.log('Email sent: ' + info.response)
  })
  // Send email with link to form with 2 password fields

  res.status(200).json({
    message: `password reset to ${req.query.email}`
  })
}

export { getEmail }