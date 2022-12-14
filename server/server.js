import express from 'express'

import { getUsersRouter } from './src/routes/users.js'
import { getSessionsRouter } from './src/routes/sessions.js'

// Middleware
import cors from 'cors'
import bodyParser from 'body-parser'
import passport from 'passport'
import session from 'express-session'

const app = express()


app.get('/api', (req, res) => {
  res.send('Hello world!\n')
}) // testing shit out

app.use(cors())
app.use(bodyParser.json()) // Content-Type: application-json
app.use(
  session({
    secret: 'secret', // later use something from process.env.SECRET or whatevs
    resave: false,
    saveUninitialized: true,
  }),
)
app.use(passport.initialize())  // initialize passport on every route call.
app.use(passport.session())     // allow passport to use "express-session".

// Routes for creating user accounts, getting user profiles...
app.use('/api', getUsersRouter())
// Routes for creating user sessions, deleting them...
app.use('/api', getSessionsRouter())

//Listen port
const PORT = 3000
app.listen(PORT)
console.log(`Running on port ${PORT}`)
