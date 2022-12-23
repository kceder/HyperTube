import pool from "../lib/db.js"

async function saveToken({ email, token_hash, expires_at }) {
  const query = `INSERT INTO email_tokens
  (email, token_hash, expires_at)
  VALUES ($1, $2, $3) RETURNING *`

  const values = [ email, token_hash, expires_at ]
  const result = await pool.query(query, values)

  // console.log('Token model -',result.rows[0]) // testing
  const tokenEmail = result.rows[0].email
  return tokenEmail ?? null 
}

async function deleteTokenByEmail({ email }) {
  const query = `DELETE FROM email_tokens WHERE email = $1`

  const values = [ email ]
  const result = await pool.query(query, values)

  // console.log('Token model - deleted tokens: ', result.rowCount) // testing
  return result.rowCount
}

async function findTokenByEmail({ email }) {
  const query = `SELECT * FROM email_tokens WHERE email = $1`
  const values = [ email ]
  const result = await pool.query(query, values)

  // console.log('Token model - ', result) // testing
  if (result.rows.length)
    return result.rows[0]
  // If no email was found:
  return false
}

export {
  saveToken,
  findTokenByEmail,
  deleteTokenByEmail
}