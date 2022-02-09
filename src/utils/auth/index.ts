import { useUserStore } from '@/pinia/modules/user'
import {
  STORAGE,
  STORAGE_KEY_APP,
  STORAGE_KEY_MENUS,
  STORAGE_KEY_SETTING,
  STORAGE_KEY_USER,
} from '@/pinia/enums'

export function getPiniaToken(): string {
  return useUserStore().token
  // const user = STORAGE.getItem(STORAGE_KEY_USER)
  // if (user === null) return ''
  // return (JSON.parse(user)?.token as string) || ''
}

export function clearPiniaStore(
  storage: Storage = STORAGE,
  keys: string[] = [STORAGE_KEY_APP, STORAGE_KEY_MENUS, STORAGE_KEY_SETTING, STORAGE_KEY_USER]
) {
  keys.forEach((key) => {
    storage.removeItem(key)
  })
}
