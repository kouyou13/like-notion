import dayjs from 'dayjs'

import type { Page } from '../../../types'

const calcMinutesSinceEdited = (page: Page | undefined) => {
  if (page?.updatedAt) {
    const now = dayjs()
    const targetPageUpdatedAt = page.updatedAt
    const diff = now.diff(targetPageUpdatedAt) / 1000 //秒単位
    if (diff < 60) {
      // 1分以内
      return 'たった今 編集'
    } else if (diff < 3600) {
      // 1時間以内
      return `${String(Math.trunc(diff / 60))}分前 編集`
    } else if (diff < 86400) {
      // 1日以内
      return `${String(Math.trunc(diff / 3600))}時間前 編集`
    } else {
      // 1日以上前
      return `${String(Math.trunc(diff / 86400))}日前 編集`
    }
  }
  return ''
}
export default calcMinutesSinceEdited
