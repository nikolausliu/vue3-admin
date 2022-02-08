/**
 * Menu.openKeys【当前展开的 SubMenu 菜单项 key 数组】
 */
import { computed, unref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMenusStore } from '@/pinia/modules/menus'

export default function useOpenKeys() {
  const menusStore = useMenusStore()
  const openKeys = computed({
    get: () => menusStore.opened,
    set: (val: string[]) => menusStore.setOpened(val),
  })

  /**
   * 根据当前path寻找其所有祖先path组成的数组，这个数组就是openKeys
   * 比如/nested/nested2/nested2-1对应的菜单路径是 嵌套菜单 > 菜单2 > 菜单2-1
   * 我们需要拿到['/nested', '/nested/nested2']，即 [嵌套菜单, 菜单2]
   * 注意：这种写法要奏效，路由定义时必须按照一定规则来写
   * @param path 当前path 如/nested/nested2/nested2-1
   */
  function getPathParents(path: string): string[] {
    // /nested/nested2/nested2-1 => ['/nested', '/nested/nested2', '/nested/nested2/nested2-1']
    const arr = path
      .split('/')
      .slice(1)
      .map((item) => `/${item}`)
    if (arr.length === 1) {
      // ['/home'] => ['/']
      return ['/']
    } else {
      // ['/nested', '/nested/nested2', '/nested/nested2/nested2-1'] => ['/nested', '/nested/nested2']
      const res: string[] = []
      arr.reduce((acc, prev) => {
        res.push(acc)
        return acc + prev
      })
      return res
    }
  }

  const { currentRoute } = useRouter()
  watch(
    () => currentRoute.value,
    () => {
      const path: string = unref(currentRoute).path
      const parents: string[] = getPathParents(path)
      openKeys.value = parents
    },
    { immediate: true }
  )

  return {
    openKeys,
  }
}
