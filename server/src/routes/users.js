import express from 'express'
import {
  signUpUser,
  getUser,
  updateUser
} from '../controllers/users.js'
import { getEmail } from '../controllers/reset-and-confirmation.js'
import { validateToken } from '../middlewares/validateToken.js'

function getUsersRouter() {
  const router = express.Router()
  
  // GET /api/users/reset ==> get confirmation link.
  router.get('/users/reset', getEmail)

  // GET /api/users/:id   ==> get user profile.
  router.get('/users/:id', validateToken, getUser)
  
  // POST /api/users   ==> create user profile.
  router.post('/users', signUpUser)

  // PUT /api/users/:id   ==> update user profile.
  router.put('/users/:id', validateToken, updateUser)

  return router
}

export { getUsersRouter }
