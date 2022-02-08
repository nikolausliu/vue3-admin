import { defineStore, storeToRefs } from 'pinia'
import { pinia } from '../index'
import { STORAGE, STORAGE_KEY_APP } from '../enums'
import { initStorageWithState, updateStorage } from '../utils'

const useStore = defineStore('app', {
  state: () => {
    const state = {
      loading: false,
      backVisible: false,
      activePath: '',
    }
    return initStorageWithState(STORAGE, STORAGE_KEY_APP, state)
  },

  actions: {
    setLoading(payload: boolean) {
      this.loading = payload
      // updateStorage(STORAGE, STORAGE_KEY_APP, 'loading', payload)
    },
    setBackVisible(payload: boolean) {
      this.backVisible = payload
      // updateStorage(STORAGE, STORAGE_KEY_APP, 'backVisible', payload)
    },
    setActivePath(payload: string) {
      this.activePath = payload
      // updateStorage(STORAGE, STORAGE_KEY_APP, 'activePath', payload)
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        storage: STORAGE,
        key: STORAGE_KEY_APP,
      },
    ],
  },
})

export const useAppStore = () => {
  const appStore = useStore(pinia)
  appStore.$subscribe((mutation, state) => {
    console.log('appStore.$subscribe', mutation, state)
    STORAGE.setItem(STORAGE_KEY_APP, JSON.stringify(state))
  })
  return appStore
}

export const appStoreToRefs = () => {
  const store = useAppStore()
  return storeToRefs(store)
}
