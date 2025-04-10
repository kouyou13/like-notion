import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const data = await req.json()
  const filePath = path.join(process.cwd(), 'data', 'content.json')

  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
  return NextResponse.json({ message: '保存しました' })
}
