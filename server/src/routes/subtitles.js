import express from 'express'
import { getSubtitles } from '../controllers/subtitles.js'

import { validateToken } from '../middlewares/validateToken.js' // plug this middleware later ;-)

const router = express.Router()

// GET /api/subtitles/:id   ==> fetch a given movie subtitles from OpenSubtitles
router.get('/subtitles/:id', getSubtitles)

export default router
