import pool from "../lib/db.js"

async function findUser({ username }) {
  const query = `SELECT * FROM users WHERE username = $1`
  const values = [ username ]
  const result = await pool.query(query, values)

  // console.log('found user',result.rows[0]) // testing
  const user = result.rows[0]
  return user ?? null 
}

export { findUser }