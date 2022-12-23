import express from 'express'
import { requestPasswordResetEmail } from '../controllers/passwords.js'

function getPasswordsRouter() {
  const router = express.Router()
  
  // GET /api/users/reset ==> get confirmation link.
  router.get('/forgot-password', requestPasswordResetEmail)

  return router
}

export { getPasswordsRouter }
