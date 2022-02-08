import { getItem, setItem } from '@/utils/storage'
import { PropertyPath } from 'lodash'
import { set } from 'lodash-es'

export function initStorageWithState<T extends Recordable>(
  storage: Storage,
  key: string,
  state: T
) {
  // 如果 storage 里还没有存储 state,则把 初始state 存储到storage
  const item = getItem(storage, key)
  if (item === '') {
    setItem(storage, key, state)
  }
  Object.keys(state).forEach((k) => {
    // @ts-ignore
    state[k] = getItem(storage, key)[k]
  })
  return state
}

export function updateStorage<T = any>(
  storage: Storage,
  key: string,
  path: PropertyPath,
  payload: T
) {
  const item = getItem(storage, key)
  // item[k] = payload
  // assignViaPaths(item, path, payload)
  set(item, path, payload)
  setItem(storage, key, item)
}
