import bcrypt from 'bcryptjs'
const { hash, compare } = bcrypt

export async function hashPassword(password) {
  return await hash(password, 12) // 12 for salting
}

export async function verifyPassword(password, hashedPassword) {
  return await compare(password, hashedPassword)
}
