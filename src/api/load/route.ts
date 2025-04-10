import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'content.json')

  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return NextResponse.json(JSON.parse(content))
  } catch (e) {
    return NextResponse.json([], { status: 200 })
  }
}
