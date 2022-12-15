// Sensitive intel kept in environment variables defined in .env
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

const config = dotenv.config({ path: '/app/.env' })
dotenvExpand.expand(config)
// console.log(process.env)  // testing

import express from 'express'

import { getUsersRouter } from './src/routes/users.js'
import { getSessionsRouter } from './src/routes/sessions.js'

// Middleware
import cors from 'cors'
import bodyParser from 'body-parser'


const app = express()

app.get('/api', (req, res) => {
  res.send('Hello world!\n')
}) // testing shit out

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}))
app.use(bodyParser.json()) // Content-Type: application-json


// Routes for creating user accounts, getting user profiles...
app.use('/api', getUsersRouter())
// Routes for creating user sessions, deleting them...
app.use('/api', getSessionsRouter())

//Listen port
const PORT = 3000
app.listen(PORT)
console.log(`Running on port ${PORT}`)
