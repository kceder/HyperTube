import express from 'express'
import {
  getListMovies,
} from '../controllers/movies.js'

import { validateToken } from '../middlewares/validateToken.js'

function getMoviesRouter() {
  const router = express.Router()

  // GET /api/movies   ==> fetch movies from APIs and send to client.
  router.get('/movies', getListMovies)

  return router
}

export { getMoviesRouter }
