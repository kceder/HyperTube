import pg from 'pg'

/* Surprisingly, I have to import dotenv here again (bc dotenvExpand)
** Notice that this time, we don't have to pass the '.env' file to dotenv.
*/
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

dotenvExpand.expand(dotenv.config())
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
