import fs from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

export function GET() {
  try {
    // ファイルの保存先パス
    const filePath = path.join(process.cwd(), 'data', 'contents.json')

    // ファイルが存在しない場合は初期データを返す
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ blocks: [] })
    }

    // ファイルが存在する場合、データを読み込み
    const blocks = fs.readFileSync(filePath, 'utf-8')
    return NextResponse.json({ blocks: JSON.parse(blocks) })
  } catch (err) {
    console.error('ファイル読み込みエラー:', err)
    return NextResponse.json({ blocks: [] }, { status: 500 })
  }
}
