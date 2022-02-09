export {}

declare global {
  type ID = number | string | null
  type Recordable<T = any> = Record<string, T>
  // 分页数据返回的数据结构
  type PageResponse = {
    total: number
    pageSize: number
    current: number
    list: Recordable[]
  }
}
