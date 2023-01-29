import express from 'express'
// import { validateToken } from '../middlewares/validateToken.js' // plug this middleware later ;-)
import { getStream } from '../controllers/streams.js'

const router = express.Router()

// GET /api/streams/:id   ==> stream a given movie from API and send to client.
// DO NOT ENABLE AUTHORIZATION HERE IF YOU DON'T KNOW HOW TO SEND TOKEN!!!!
router.get('/streams/:id/:quality/:hash', getStream)

export default router
