// Sensitive intel kept in environment variables defined in .env
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

const config = dotenv.config({ path: '/app/.env' })
dotenvExpand.expand(config)
// console.log(process.env)  // testing

import express from 'express'

import { getUsersRouter } from './src/routes/users.js'
import { getSessionsRouter } from './src/routes/sessions.js'
import { getUsernamesRouter } from './src/routes/usernames.js'

// Middleware
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
// middleware to serve static files (images, and later our React bundle)
app.use(express.static('public'))

app.get('/api', (req, res) => {
  res.send('Hello world!\n')
}) // testing shit out

app.use(cors())
app.use(bodyParser.json()) // Content-Type: application-json


// Routes for creating user accounts, getting user profiles...
app.use('/api', getUsersRouter())

// Routes for creating user sessions, deleting them...
app.use('/api', getSessionsRouter())

// Route for checking usernames (useful when signing up)
app.use('/api', getUsernamesRouter())

//Listen port
const PORT = 3000
app.listen(PORT)
console.log(`Running on port ${PORT}`)
