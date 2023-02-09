import express from 'express'
import { getUser } from '../controllers/users.js'

import { validateToken } from '../middlewares/validateToken.js'

const router = express.Router()

// GET /api/users/:id   ==> get user profile.
router.get('/user-profile/:id', validateToken, getUser)

export default router
