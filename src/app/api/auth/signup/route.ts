import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword, generateToken } from "@/lib/auth"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const hashed = await hashPassword(password)
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    })

    const token = generateToken({ userId: user.id, email: user.email })

    const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email }, token })
    res.cookies.set("token", token, { httpOnly: false, secure: false, sameSite: "lax", maxAge: 604800, path: "/" })
    return res
  } catch (err) {
    console.error("Signup error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
