import express from 'express'
import {
  signUpUser,
  getUser,
  updateUser
} from '../controllers/users.js'
import {
  requestConfirmation,
  confirmUserAccount
} from '../controllers/confirmation.js'
import { validateToken } from '../middlewares/validateToken.js'

function getUsersRouter() {
  const router = express.Router()

  // GET /api/users/confirm   ==> confirm user account.
  router.get('/users/confirm', requestConfirmation)

  // POST /api/users/confirm   ==> confirm user account.
  router.post('/users/confirm', confirmUserAccount)
  
  // GET /api/users/:id   ==> get user profile.
  router.get('/users/:id', validateToken, getUser)
  
  // POST /api/users   ==> create user profile.
  router.post('/users', signUpUser)

  // PUT /api/users/:id   ==> update user profile.
  router.put('/users/:id', validateToken, updateUser)

  return router
}

export { getUsersRouter }
