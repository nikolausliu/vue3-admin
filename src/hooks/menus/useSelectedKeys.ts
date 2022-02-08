/**
 * Menu.selectedKeys【当前选中的菜单项 key 数组】
 */
import { unref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMenusStore } from '@/pinia/modules/menus'

export default function useSelectedKeys() {
  const { currentRoute } = useRouter()
  const menusStore = useMenusStore()

  watch(
    () => currentRoute.value,
    () => {
      const path: string = unref(currentRoute).path
      menusStore.setSelected([path])
    },
    { immediate: true }
  )

  const selectedKeys = computed({
    get: () => menusStore.selected,
    set: (val: string[]) => menusStore.setSelected(val),
  })

  return {
    selectedKeys,
  }
}
