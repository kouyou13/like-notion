import { createSupabaseClient } from '../../../lib/supabase'

type Props = {
  debouncedPageTitle: string | null
  pageId: string
}
/**
 * 編集時にページのタイトルを保存
 * @param debouncedPageTitle 保存する用のタイトル
 * @param pageId ページid
 * @return void
 */
const regularlySavePageTitle = async ({ debouncedPageTitle, pageId }: Props) => {
  const supabase = createSupabaseClient()
  if (debouncedPageTitle != null) {
    const { error } = await supabase
      .from('page')
      .update({ title: debouncedPageTitle })
      .eq('id', pageId)
    if (error) {
      console.error(error)
    }
  }
}
export default regularlySavePageTitle
