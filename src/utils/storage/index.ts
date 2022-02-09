export function getItem(storage: Storage, key: string) {
  const item = storage.getItem(key) || ''
  // 对于无法被 JSON.parse 解析的字符串(如 'token')，则直接返回原字符串
  try {
    return JSON.parse(item)
  } catch (e) {
    return item
  }
}

export function setItem(storage: Storage, key: string, val: any) {
  const item = typeof val === 'string' ? (val as string) : JSON.stringify(val)
  storage.setItem(key, item)
}

export function removeItem(storage: Storage, key: string) {
  storage.removeItem(key)
}

export function clear(storage: Storage) {
  storage.clear()
}
