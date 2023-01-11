import pool from "../lib/db.js"

async function findMovie({ quality, imdb_id }) {
  console.log('downloads received',quality, imdb_id)
  const query = `SELECT * FROM downloads
  WHERE imdb_id = $1
  AND quality = $2`
  const values = [ imdb_id, quality ]
  const result = await pool.query(query, values)

  console.log('Movie model - found movie', result.rows[0]) // testing
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

  // console.log('Movie model - created movie',result.rows[0]) // testing
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

  // console.log('Movie model - updated movie',result.rows[0]) // testing
  const updatedMovie = result.rows[0]
  return updatedMovie ?? null 
}

export {
  findMovie,
  saveMovie,
  setCompleteMovie
}