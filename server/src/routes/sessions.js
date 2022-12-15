import express from 'express'
import { login, logout } from '../controllers/sessions.js'

// middleware
import { validateLogin } from '../middlewares/validateLogin.js'
import { validateToken } from '../middlewares/validateToken.js'

function getSessionsRouter() {
  const router = express.Router()

  // Endpoint for logging in
  router.post('/sessions', validateLogin, login)

  // Endpoint for logging in
  router.delete('/sessions', validateToken, logout)

  return router
}

export { getSessionsRouter }
