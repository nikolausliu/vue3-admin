import { defineStore, storeToRefs } from 'pinia'
import { pinia } from '../index'
import { clearPiniaStore } from '@/utils/auth'
import { STORAGE, STORAGE_KEY_USER } from '../enums'
import { initStorageWithState, updateStorage } from '../utils'
import api from '@/api'

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
      const res = await api.login(params)
      const data = res.data.data as Recordable
      this.user = data
      this.token = data.token as string
      updateStorage(STORAGE, STORAGE_KEY_USER, 'user', data)
      updateStorage(STORAGE, STORAGE_KEY_USER, 'token', data.token)
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
