import express from 'express'
import { validateToken } from '../middlewares/validateToken.js' // plug this middleware later ;-)
import { postComment } from '../controllers/comments.js'

const router = express.Router()

router.post('/comments', validateToken, postComment)

export default router
