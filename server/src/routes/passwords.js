import express from 'express'
import {
  requestPasswordResetEmail,
  resetPassword
} from '../controllers/passwords.js'

function getPasswordsRouter() {
  const router = express.Router()
  
  // GET /api/users/forgot-password ==> get confirmation link.
  router.get('/forgot-password', requestPasswordResetEmail)

  // POST /api/users/reset-password ==> post new password.
  router.post('/reset-password', resetPassword)

  return router
}

export { getPasswordsRouter }
