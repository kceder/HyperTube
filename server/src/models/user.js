import pool from "../lib/db.js"

async function findByUsername({ username }) {
  const query = `SELECT * FROM users WHERE username = $1`
  const values = [ username ]
  const result = await pool.query(query, values)

  // console.log('User model - found user',result.rows[0]) // testing
  const user = result.rows[0]
  return user ?? null 
}

async function findByEmail({ email }) {
  const query = `SELECT * FROM users WHERE email = $1`
  const values = [ email ]
  const result = await pool.query(query, values)

  // console.log('User model - found user', result.rows[0]) // testing
  const user = result.rows[0]
  return user ?? null 
}

async function findByUid({ uid }) {
  const query = `SELECT * FROM users WHERE id = $1`
  const values = [ uid ]
  const result = await pool.query(query, values)

  // console.log('User model - found user', result.rows[0]) // testing
  const user = result.rows[0]
  return user ?? null 
}

async function createUser(user) {
  const {
    username,
    firstname,
    lastname,
    email,
    hashed_password,
    profile_pic,
    confirmed
  } = user
  const query = `INSERT INTO users
  (username, firstname, lastname, email, password, profile_pic, confirmed)
  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`

  const values = [
    username,
    firstname,
    lastname,
    email,
    hashed_password,
    profile_pic,
    confirmed
  ]

  const result = await pool.query(query, values)

  // console.log('User model - created user',result.rows[0]) // testing
  const createdUser = result.rows[0]
  return createdUser ?? null 
}

async function updateUserProfile(user) {
  const {
    username,
    firstname,
    lastname,
    email,
    confirmed,
    uid
  } = user
  const query = `UPDATE users
  SET username =  $1,
      firstname = $2,
      lastname =  $3,
      email =     $4,
      confirmed = $5
  WHERE id = $6
  RETURNING *`

  const values = [ username, firstname, lastname, email, confirmed, uid ]
  const result = await pool.query(query, values)

  // console.log('User model - created user',result.rows[0]) // testing
  const updatedUser = result.rows[0]
  return updatedUser ?? null 
}

async function confirmUserByEmail({ email }) {
  const query = `UPDATE users
  SET confirmed = true
  WHERE email = $1
  RETURNING *`

  const values = [ email ]
  const result = await pool.query(query, values)

  // console.log('User model - created user',result.rows[0]) // testing
  const updatedUser = result.rows[0]
  return updatedUser ?? null 
}

async function updatePasswordByEmail({ email, password }) {
  const query = `UPDATE users
  SET password = $1
  WHERE email = $2
  RETURNING *`

  const values = [ password, email ]
  const result = await pool.query(query, values)

  // console.log('User model - updated password',result.rows[0]) // testing
  const updatedUser = result.rows[0]
  return updatedUser ?? null 
}

async function writeProfilePic(user) {
  const { uid, profilePic } = user
  const query = `UPDATE users SET profile_pic = $1 WHERE id = $2`

  const values = [ profilePic, uid ]
  const result = await pool.query(query, values)

  // console.log('User profile Pic inserted: ', result.rows[0]) // testing
  const createdUser = result.rows[0]
  return createdUser ?? null 
}

export {
  findByUsername,
  findByEmail,
  findByUid,
  createUser,
  updateUserProfile,
  updatePasswordByEmail,
  writeProfilePic,
  confirmUserByEmail
}