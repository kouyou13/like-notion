import fs from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

export const runtime = 'nodejs'

export function GET() {
  try {
    // ファイルの保存先パス
    const filePath = path.join(process.cwd(), 'data', 'contents.json')

    // ファイルが存在しない場合は初期データを返す
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ pages: [] })
    }

    // ファイルが存在する場合、データを読み込み
    const pages = fs.readFileSync(filePath, 'utf-8')
    return NextResponse.json({ pages: JSON.parse(pages) })
  } catch (err) {
    console.error('ファイル読み込みエラー:', err)
    return NextResponse.json({ pages: [] }, { status: 500 })
  }
}
