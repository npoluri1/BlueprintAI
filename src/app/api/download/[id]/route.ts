import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import JSZip from "jszip"

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

    const zip = new JSZip()
    for (const file of files) {
      const cleanPath = file.path.replace(/^\//, "")
      zip.file(cleanPath, file.content)
    }

    const u8 = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE", compressionOptions: { level: 9 } })
    const buf = Buffer.from(u8)

    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${title}.zip"`,
        "Content-Length": buf.length.toString(),
      },
    })
  } catch (err) {
    console.error("Download error:", err)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
