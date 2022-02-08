import { defineStore, storeToRefs } from 'pinia'
import { pinia } from '../index'
import setting from '@/settings'
import { MenuThemeEnum } from '@/enums/menuEnums'
import { HeaderThemeEnum } from '@/enums/headerEnums'
import { STORAGE, STORAGE_KEY_SETTING } from '../enums'
import { initStorageWithState, updateStorage } from '../utils'

const useStore = defineStore('setting', {
  state: () => {
    const state = {
      menu: {
        theme: setting.menu.theme,
      },
      header: {
        theme: setting.header.theme,
      },
      panel: {
        autoFold: setting.panel.autoFold,
      },
    }
    return initStorageWithState(STORAGE, STORAGE_KEY_SETTING, state)
  },

  actions: {
    setMenuTheme(payload: MenuThemeEnum) {
      this.menu.theme = payload
      // updateStorage(STORAGE, STORAGE_KEY_SETTING, ['menu', 'theme'], payload)
      updateStorage(STORAGE, STORAGE_KEY_SETTING, 'menu.theme', payload)
    },
    setHeaderTheme(payload: HeaderThemeEnum) {
      this.header.theme = payload
      updateStorage(STORAGE, STORAGE_KEY_SETTING, ['header', 'theme'], payload)
    },
    setPanelAutoFold(payload: boolean) {
      this.panel.autoFold = payload
      updateStorage(STORAGE, STORAGE_KEY_SETTING, ['panel', 'autoFold'], payload)
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        storage: STORAGE,
        key: STORAGE_KEY_SETTING,
      },
    ],
  },
})

export const useSettingStore = () => useStore(pinia)

export const settingStoreToRefs = () => {
  const store = useSettingStore()
  return storeToRefs(store)
}
