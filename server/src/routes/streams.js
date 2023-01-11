import express from 'express'
import { validateToken } from '../middlewares/validateToken.js' // plug this middleware later ;-)
import { getStream } from '../controllers/streams.js'


const router = express.Router()

// GET /api/streams/:id   ==> stream a given movie from API and send to client.
router.get('/streams/:id/:quality/:hash', getStream)

export default router
