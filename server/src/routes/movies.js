import express from 'express'
import { getListMovies, getMovie, watchMovie } from '../controllers/movies.js'

import { validateToken } from '../middlewares/validateToken.js' // plug this middleware later ;-)

const router = express.Router()
// GET /api/movies   ==> fetch movies from APIs and send to client.
router.get('/movies', validateToken, getListMovies)
// GET /api/movies/:id   ==> fetch a given movie from API and send to client.
router.post('/movies/:id', validateToken, watchMovie)
router.get('/movies/:id', getMovie)

export default router
