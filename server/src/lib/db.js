import pg from 'pg'

// Sensitive intel kept in environment variables defined in .env
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

dotenv.config({ path: '/app/.env' })
dotenvExpand.expand(dotenv.config({ path: '/app/.env' }))
// console.log(process.env)  // testing

const { Pool } = pg

let pool

if (!pool) {
  pool = new Pool({
    user:     process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD,
    host:     process.env.PGSQL_HOST,
    port:     process.env.PGSQL_PORT,
    database: process.env.PGSQL_DATABASE
  })
}

export default pool
