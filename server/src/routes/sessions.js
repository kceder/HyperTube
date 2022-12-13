import express from 'express'
import { logout } from '../controllers/sessions.js'
import { findUser } from '../models/user.js'
// To verify hashed passwords
import { verifyPassword } from '../lib/auth.js'

// middleware
import passport from 'passport'
import passportLocal from 'passport-local'

const localStrategy = passportLocal.Strategy

// testing
const dummyUser = {
  id: 69,
  username: 'bob',
  password: '1234',
  profilePic: 'some url',
}

/* Within this function we'll:
    1. Invoke the model to find username in DB.
    2. Check if the password match.

The return value of this function is always a CALL to the done function,
only that the arguments we pass will be different:

  1. If the username is not found, or the passwords don't match we'll:
    return done (null, false)
    
  2. If the username is found and the passwords match:
    return done(null, { id: 3, username: 'bob', profilePic: 'someUrl' })
*/
async function verify(username, password, done) {
  const user = await findUser({username})
  if (!user)
    return done(null, false, 'Invalid Credentials')

  const validPwd = await verifyPassword(password, user.password)
  if (!validPwd)
    return done(null, false, 'Wrong Password')

  return done(null, user)
}

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      profilePic: user.profilePic,
    })
  })
})

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user)
  })
})

passport.use(new localStrategy(verify))

function getSessionsRouter() {
  const router = express.Router()

  // Endpoint for logging in
  router.post('/sessions', function (req, res) {
    passport.authenticate('local', function (err, user, info) {
      if (err) return res.status(401).json({ message: err })
      if (user) {
        res.status(200).json({
          message: 'successful authentication',
        })
      } else {
        res.status(401).json({ message: info })
      }
    })(req, res)
  })

  // Endpoint for logging in
  router.delete('/sessions', logout)

  return router
}

export { getSessionsRouter }
