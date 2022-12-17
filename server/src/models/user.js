import pool from "../lib/db.js"

async function findByUsername({ username }) {
  const query = `SELECT * FROM users WHERE username = $1`
  const values = [ username ]
  const result = await pool.query(query, values)

  console.log('User model - found user',result.rows[0]) // testing
  const user = result.rows[0]
  return user ?? null 
}

async function findByEmail({ email }) {
  const query = `SELECT * FROM users WHERE email = $1`
  const values = [ email ]
  const result = await pool.query(query, values)

  console.log('User model - found user', result.rows[0]) // testing
  const user = result.rows[0]
  return user ?? null 
}

async function createUser(user) {
  const {
    username,
    firstname,
    lastname,
    email
  } = user
  const query = `INSERT INTO users (username, firstname, lastname, email)
  VALUES ($1, $2, $3, $4) RETURNING *`
  const values = [ username, firstname, lastname, email ]
  const result = await pool.query(query, values)

  console.log('User model - created user',result.rows[0]) // testing
  const createdUser = result.rows[0]
  return createdUser ?? null 
}

export { findByUsername, findByEmail, createUser }