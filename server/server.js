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
import { getPasswordsRouter } from './src/routes/passwords.js'
import { getMoviesRouter } from './src/routes/movies.js'
// import { getStreamsRouter } from './src/routes/streams.js'
import streamsRouter from './src/routes/streams.js'
import commentsRouter from './src/routes/comments.js'
import subtitlesRouter from './src/routes/subtitles.js'

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

// Route for resetting passwords and requesting reset-password emails
app.use('/api', getPasswordsRouter())

// Route for checking usernames (useful for conventional sign up)
app.use('/api', getUsernamesRouter())

// Route for movies (list of them, and individual ones)
app.use('/api', getMoviesRouter())

// Route for movies (list of them, and individual ones)
app.use('/api', streamsRouter)
app.use('/api', commentsRouter)

// Route for comments (get list of them, and create new ones)
app.use('/api', commentsRouter)

// Route for comments (get list of them, and create new ones)
app.use('/api', subtitlesRouter)

//Listen port
const PORT = 3000
app.listen(PORT)
console.log(`Running on port ${PORT}`)
