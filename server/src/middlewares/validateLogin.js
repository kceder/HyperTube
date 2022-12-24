import { z } from 'zod'

const validationSchema = z.object({
  userName: z
    .string()
    .min(1, { message: 'Username is required' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
      message: '5-10 upper and lowercase letters, and digits',
    }),
  password: z
    .string()
    .min(5, { message: 'Between 5-10 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,10}$/, {
      message: 'Upper and lowercase letters, and digits',
    }),
})

function validateLogin(req, res, next) {
  // console.log(`validateLogin middleware: ${JSON.stringify(req.body)}`) // testing
  try {
    validationSchema.parse({
      userName: req.body.username,
      password: req.body.password
    })
    next()
  } catch (error) {
    // console.log(`validateLogin middleware: ${JSON.stringify(error)}`) // testing
    return res.status(400).json({ error: 'bad request' })
  } 
}

export { validateLogin }
