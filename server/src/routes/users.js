import express from 'express'
import { createUser } from '../controllers/users.js'

function getUsersRouter() {
  const router = express.Router()

  // POST /api/users   ==> create user profile.
  router.post('/users', createUser)

  return router
}

export { getUsersRouter }
