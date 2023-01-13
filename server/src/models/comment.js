import pool from "../lib/db.js"

async function getComments({ imdb_id }) {
  // console.log('downloads received',quality, imdb_id)
  const query = `SELECT comments.id, comments.created_at, comments.comment, users.username
  FROM comments
  INNER JOIN users
          ON users.id = comments.user_id
  WHERE comments.imdb_id = $1
  ORDER BY comments.created_at DESC`

  const values = [ imdb_id ]
  const result = await pool.query(query, values)

  // console.log('Comment model', result.rows) // testing
  const comments = result.rows
  return comments ?? null 
}

async function createComment(commentData) {
  const {
    user_id,
    imdb_id,
    comment,
    created_at
  } = commentData

  const query = `INSERT INTO comments
  (
    user_id,
    imdb_id,
    comment,
    created_at
  )
  VALUES ($1, $2, $3, $4) RETURNING *`

  const values = [
    user_id,
    imdb_id,
    comment,
    +new Date()
  ]

  const result = await pool.query(query, values)
  // console.log('Comment model - created comment',result.rows[0]) // testing
  const createdComment = result.rows[0]
  return createdComment ?? null 
}

export {
  getComments,
  createComment
}