// To verify JSON Web Tokens
import jwt from 'jsonwebtoken'

const validateToken = (req, res, next) => {
  const authHeader = req?.headers?.authorization
  // console.log(`validateToken middleware: ${req.headers.authorization}`)

  if (authHeader) {
    const [key, accessToken] = authHeader.split(' ');

    // Check the header for the Access token.
    if (key !== 'Bearer') {
      return res.status(400).json({ message: 'bad request' })
    }

    try {
      jwt.verify(accessToken, process.env.SECRET_JWT_KEY)
      next()
    } catch (error) {
      res.status(403).json({ message: error })
    }
  } else {
    res.status(400).json({ message: 'bad request'})
  }
}

export { validateToken }