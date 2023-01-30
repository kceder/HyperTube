import pool from "../lib/db.js"
import jobDeleteMovies from "./cron.js";

jobDeleteMovies.start();

async function findMovie({ quality, imdb_id }) {
  // console.log('downloads received',quality, imdb_id)
  const query = `SELECT * FROM downloads
  WHERE imdb_id = $1
  AND quality = $2`
  const values = [ imdb_id, quality ]
  const result = await pool.query(query, values)

  // console.log('Downloads model - found movie', result.rows[0]) // testing
  const movie = result.rows[0]
  return movie ?? null 
}

async function saveMovie(movie) {
  const {
    imdb_id,
    quality,
    completed,
    path,
    size,
    last_watched
  } = movie
  const query = `INSERT INTO downloads
  (
    imdb_id,
    quality,
    completed,
    path,
    size,
    last_watched
  )
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`

  const values = [
    imdb_id,
    quality,
    completed,
    path,
    size,
    last_watched
  ]

  const result = await pool.query(query, values)

  console.log('Downloads model - created movie',result.rows[0]) // testing
  const savedMovie = result.rows[0]
  return savedMovie ?? null 
}

async function setCompleteMovie(movie) {
  const { imdb_id, quality } = movie
  const query = `UPDATE downloads
  SET completed =  true
  WHERE imdb_id = $1
  AND quality = $2
  RETURNING *`

  const values = [ imdb_id, quality ]
  const result = await pool.query(query, values)

  // console.log('Downloads model - updated movie',result.rows[0]) // testing
  const updatedMovie = result.rows[0]
  return updatedMovie ?? null 
}

// function to delete movie from db if last_watched is older than 1 month. Using cron job
async function deleteMovies() {
  const query = `DELETE FROM downloads WHERE to_timestamp(last_watched / 1000) < NOW() - INTERVAL '1 month'`
  try {
    const { rows } = await pool.query(query)
    return rows
  } catch (error) {
    console.log(error)
  }
}

export {
  findMovie,
  saveMovie,
  setCompleteMovie,
  deleteMovies
}