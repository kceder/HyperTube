import express from 'express'
import { checkUsername, checkUsernameUid } from '../controllers/usernames.js'

function getUsernamesRouter() {
  const router = express.Router()
  
  // POST /api/usernames   ==> check username existence when updating profile.
  router.post('/usernames', checkUsernameUid)
  
  // GET /api/usernames   ==> check username existence.
  router.get('/usernames', checkUsername)

  return router
}

export { getUsernamesRouter }
