import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyPassword, generateToken } from "@/lib/auth"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = generateToken({ userId: user.id, email: user.email })

    const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email }, token })
    res.cookies.set("token", token, { httpOnly: false, secure: false, sameSite: "lax", maxAge: 604800, path: "/" })
    return res
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
