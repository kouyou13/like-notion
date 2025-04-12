import fs from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

export async function POST(request: Request) {
  try {
    // リクエストボディをJSONとして解析
    const { pages } = await request.json()

    // 保存先パス
    const filePath = path.join(process.cwd(), 'data', 'contents.json')

    // ディレクトリがなければ作成
    fs.mkdirSync(path.dirname(filePath), { recursive: true })

    // 非同期でファイル書き込み
    await fs.promises.writeFile(filePath, JSON.stringify(pages, null, 2))

    // 正常なレスポンスを返す
    return NextResponse.json({ message: '保存成功' })
  } catch (err) {
    console.error('ファイル書き込みエラー:', err)
    return NextResponse.json({ message: 'エラーが発生しました' }, { status: 500 })
  }
}
