import { defineStore, storeToRefs } from 'pinia'
import { pinia } from '../index'
import menus from '@/router/menus'
// import { isProd } from '@/utils/env'
import { STORAGE, STORAGE_KEY_MENUS } from '../enums'
import { initStorageWithState, updateStorage } from '../utils'

type Menus = typeof menus

const useStore = defineStore('menus', {
  state: () => {
    const state = {
      // 开发环境使用本地模拟的menus，方便开发新菜单
      // 生产环境使用接口返回的menus(详见 ./user action)
      // menus: isProd() ? [] : menus,
      menus,
      selected: [] as string[],
      opened: [] as string[],
    }
    return state
    // return initStorageWithState(STORAGE, STORAGE_KEY_MENUS, state)
  },

  actions: {
    setMenus(payload: Menus) {
      this.menus = payload
      // updateStorage(STORAGE, STORAGE_KEY_MENUS, 'menus', payload)
    },

    setSelected(payload: string[]) {
      this.selected = payload
      // updateStorage(STORAGE, STORAGE_KEY_MENUS, 'selected', payload)
    },

    setOpened(payload: string[]) {
      this.opened = payload
      // updateStorage(STORAGE, STORAGE_KEY_MENUS, 'opened', payload)
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        storage: STORAGE,
        key: STORAGE_KEY_MENUS,
      },
    ],
  },
})

export const useMenusStore = () => useStore(pinia)

export const menusStoreToRefs = () => {
  const store = useMenusStore()
  return storeToRefs(store)
}
