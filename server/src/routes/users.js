import express from 'express'
import { signUpUser } from '../controllers/users.js'

function getUsersRouter() {
  const router = express.Router()

  // POST /api/users   ==> create user profile.
  router.post('/users', signUpUser)

  return router
}

export { getUsersRouter }
