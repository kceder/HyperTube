import pool from '/app/src/lib/db.js'

async function checkUsername(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Allowed methods: GET' })
  }
  // console.log(`yeppp ${req.query.username}`)
  // console.log(`PGSQL_HOST: ${process.env.PGSQL_HOST}`)
  // console.log(`PGSQL_DATABASE: ${process.env.PGSQL_DATABASE}`)
  // console.log(`PGSQL_USER: ${process.env.PGSQL_USER}`)
  // console.log(`PGSQL_PASSWORD: ${process.env.PGSQL_PASSWORD}`)

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
export { checkUsername }