import pool from '/app/src/lib/db.js'

async function checkUsername(req, res) {
  // if (req.method !== 'GET')
  //   return res.status(405).json({ message: 'Allowed methods: GET' })

  const query = `SELECT * FROM users WHERE username = $1`
  const values = [ req.query.username ]

  try {
    const result = await pool.query(query, values)
    // console.log(result.rows[0]) // { name: 'bob', email: 'bob@gmail.com', ... }

    res.status(200).json({ message: result.rows.length > 0 })
  } catch (err) {
    console.log(err.stack)
    res.status(500).json({ message: err.stack })
  }
}

async function checkUsernameUid(req, res) {
  const { username, uid } = req.body
  const query = `SELECT * FROM users WHERE username = $1 AND id != $2`
  const values = [ username, uid ]

  try {
    const result = await pool.query(query, values)
    // console.log(result.rows[0]) // { name: 'bob', email: 'bob@gmail.com', ... }

    res.status(200).json({ message: result.rows.length > 0 })
  } catch (err) {
    console.log(err.stack)
    res.status(500).json({ message: err.stack })
  }
}
export { checkUsername, checkUsernameUid }