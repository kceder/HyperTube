import express from 'express'
import { checkUsername } from '../controllers/usernames.js'

function getUsernamesRouter() {
  const router = express.Router()

  // GET /api/usernames   ==> check username existence.
  router.get('/usernames', checkUsername)

  return router
}

export { getUsernamesRouter }
