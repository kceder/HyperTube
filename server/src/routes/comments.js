import express from 'express'
import { validateToken } from '../middlewares/validateToken.js' // plug this middleware later ;-)
import {
  getCommentList,
  postComment
} from '../controllers/comments.js'

const router = express.Router()

router.get('/comments', getCommentList)
router.post('/comments/new-comment', postComment) // 🤛 not RESTful 

export default router
