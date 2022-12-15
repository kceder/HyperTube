import { findByUsername } from '../models/user.js'
// To verify hashed passwords
import { verifyPassword } from '../lib/auth.js'
// To create JSON Web Tokens
import jwt from 'jsonwebtoken'

async function login(req, res) {
  const user = await findByUsername({ username: req.body.username })

  // if the user doesn't exist...
  if (!user) {
    return res.status(401).json({
      message: 'user does not exist',
      error: true,
    })
  }

  const passwordMatch = await verifyPassword(req.body.password, user.password)
  // if the passwords don't match...
  if (!passwordMatch) {
    return res.status(401).json({
      message: 'wrong credentials',
      error: true
    })
  }

  // Generate the access_token
  const accessToken = jwt.sign({
    sub:    user.id
  }, process.env.SECRET_JWT_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXP })

  // Let's extract the expiry time of the Access token from the claim ;-)
  const expiryAccessToken = jwt.verify(accessToken, process.env.SECRET_JWT_KEY).exp

  res.status(200).json({
    message:      'successfully logged in',
    uid:          user.id,
    username:     user.username,
    accessToken:  accessToken,
    profilePic:   user.profilePic
  })
}

async function logout(req, res) {
  res.status(200).json({ message: 'successfully logged out' })
}

export { login, logout }
