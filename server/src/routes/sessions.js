import express from 'express'
import { login, logout, oauthGitHub } from '../controllers/sessions.js'

// middleware
import { validateLogin } from '../middlewares/validateLogin.js'
import { validateToken } from '../middlewares/validateToken.js'

function getSessionsRouter() {
  const router = express.Router()

  // Endpoint for logging in
  router.post('/sessions', validateLogin, login)
  
  // Endpoint for logging out
  router.delete('/sessions', validateToken, logout)
  
  // Endpoint for logging in using GitHub OAuth
  router.post('/sessions/oauth/github', oauthGitHub)

  return router
}

export { getSessionsRouter }
