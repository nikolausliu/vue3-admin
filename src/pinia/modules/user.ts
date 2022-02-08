import { defineStore, storeToRefs } from 'pinia'
import { pinia } from '../index'
// import { MenuRaw } from '@/router/menus'
import { login } from '@/api/member'
// import { isProd } from '@/utils/env'
// import { removeBackslash } from '@/utils'
import { clearPiniaStore } from '@/utils/auth'
import { STORAGE, STORAGE_KEY_USER } from '../enums'
import { initStorageWithState, updateStorage } from '../utils'
// import { useMenusStore } from './menus'

const useStore = defineStore('user', {
  state: () => {
    const state = {
      user: {} as Recordable,
      token: '',
    }
    return initStorageWithState(STORAGE, STORAGE_KEY_USER, state)
  },

  actions: {
    async login(params: Recordable) {
      const res = await login(params)
      const data = res.data.data
      this.user = data as Recordable
      this.token = data.token as string
      updateStorage(STORAGE, STORAGE_KEY_USER, 'user', data)
      updateStorage(STORAGE, STORAGE_KEY_USER, 'token', data.token)
      // 开发环境使用本地模拟的menus，详见 ./menus state
      // 生产环境使用接口返回的menus
      // if (isProd()) {
      //   const roleControlMenu = adminUser.role.roleControlMenu as string
      //   const menus = JSON.parse(removeBackslash(roleControlMenu)) as MenuRaw[]
      //   const menusStore = useMenusStore()
      //   menusStore.setMenus(menus)
      // }
      return data
    },

    logout() {
      this.user = {}
      this.token = ''
      clearPiniaStore()
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        storage: STORAGE,
        key: STORAGE_KEY_USER,
      },
    ],
  },
})

export const useUserStore = () => useStore(pinia)

export const userStoreToRefs = () => {
  const store = useUserStore()
  return storeToRefs(store)
}
