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
    email,
    hashed_password
  } = user
  const query = `INSERT INTO users
  (username, firstname, lastname, email, password)
  VALUES ($1, $2, $3, $4, $5) RETURNING *`

  const values = [ username, firstname, lastname, email, hashed_password ]
  const result = await pool.query(query, values)

  console.log('User model - created user',result.rows[0]) // testing
  const createdUser = result.rows[0]
  return createdUser ?? null 
}

async function writeProfilePic(user) {
  const { id, profilePic } = user
  const query = `UPDATE users SET profile_pic = $1 WHERE id = $2`

  const values = [ profilePic, id ]
  const result = await pool.query(query, values)

  console.log('User profile Pic inserted: ', result.rows[0]) // testing
  const createdUser = result.rows[0]
  return createdUser ?? null 
}

export { findByUsername, findByEmail, createUser, writeProfilePic }