import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get("cookie")?.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = await params
    const project = await prisma.project.findUnique({ where: { id } })

    if (!project || project.userId !== payload.userId) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const files: Array<{ path: string; content: string }> = JSON.parse(project.files)
    const title = project.title.replace(/[^a-zA-Z0-9-_]/g, "-")

    const { default: archiver } = await import("archiver")

    const archive = archiver("zip", { zlib: { level: 9 } })
    const chunks: Buffer[] = []

    await new Promise<void>((resolve, reject) => {
      archive.on("data", (chunk: Buffer) => chunks.push(chunk))
      archive.on("close", resolve)
      archive.on("error", reject)

      for (const file of files) {
        archive.append(file.content, { name: file.path.replace(/^\//, "") })
      }

      archive.finalize()
    })

    const buffer = Buffer.concat(chunks)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${title}.zip"`,
        "Content-Length": buffer.length.toString(),
      },
    })
  } catch (err) {
    console.error("Download error:", err)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
