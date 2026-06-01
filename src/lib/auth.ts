import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "naga-siva-dev-secret-key-2026"

export interface JwtPayload {
  userId: string
  email: string
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export function getTokenFromCookies(): string | null {
  if (typeof document === "undefined") return null
  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name === "token") return value
  }
  return null
}

export function setTokenCookie(token: string): void {
  if (typeof document === "undefined") return
  document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`
}

export function removeTokenCookie(): void {
  if (typeof document === "undefined") return
  document.cookie = "token=; path=/; max-age=0; SameSite=Lax"
}
