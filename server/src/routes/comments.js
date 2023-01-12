import express from 'express'
import { validateToken } from '../middlewares/validateToken.js' // plug this middleware later ;-)
import { postComment } from '../controllers/streams.js'


const router = express.Router()


router.post('/comments/new-comment', postComment);

export default router
