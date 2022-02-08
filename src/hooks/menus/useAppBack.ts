/**
 * 项目初始架构的设计是左侧菜单的选中状态根据currentRoute的path值来设置
 * 考虑这样一个场景：/list 页面内包含列表，新增，编辑。如果把所有功能都放在这一个页面内，这个页面的代码会非常多
 * 所以倾向于把 /list 页面拆分成3个： /list,/list/create,/list/edit/:id(或/list/edit?id=)
 * 但是基于最初的设计，当访问/list/create或/list/edit时，左侧菜单就无法保持选中状态了
 * 这个hook用来在这些需要的页面中调用来设置正确的菜单选中状态
 * 用法：在create或edit页面的setup中直接 useMutateSelectedMenu()即可
 * 同时，把返回按钮的逻辑也在这里处理了
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/pinia/modules/app'
import { useMenusStore } from '@/pinia/modules/menus'

export default function useAppBack() {
  const appStore = useAppStore()
  const menusStore = useMenusStore()
  const { push } = useRouter()
  const back = () => {
    push({
      path: appStore.activePath,
    })
  }
  onMounted(() => {
    menusStore.setSelected([appStore.activePath])
  })

  return {
    back,
  }
}
