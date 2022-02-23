import { RouteRecordRaw } from 'vue-router'

/**
 * 获取权限菜路由中的第一个路由path
 */
export function getFirstRoutePath(): string {
  // const menusStore = useMenusStore()
  // console.log(1, 'menusStore', menusStore, menusStore.menus)
  // const menus = menusStore.menus
  // if (!menus.length) {
  //   return ''
  // }
  // const recursive = (m: MenuRaw[]): string => {
  //   const first = m[0]
  //   const children = first.children
  //   if (children.length) {
  //     return recursive(children)
  //   } else {
  //     return first.path
  //   }
  // }
  // return recursive(menus)
  return '/system/menu'
}

export function generateRoute(menuList: Recordable[]) {
  const routes: RouteRecordRaw[] = []
  const deepList = (list: Recordable[]) => {
    while (list.length) {
      const item = list.pop() as Recordable
      if (item.action) {
        routes.push({
          name: item.component,
          path: item.path,
          meta: {
            title: item.menuName,
          },
          component: item.component,
        })
      }
      if (item.children && !item.action) {
        deepList(item.children)
      }
    }
  }
  deepList(menuList)
  return routes
}

export function getKeys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof T>
}

export function formateDate(date: Date, rule: string): string {
  let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, date.getFullYear() + '')
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  getKeys(o).forEach((k) => {
    if (new RegExp(`(${k})`).test(fmt)) {
      const val = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? val : ('00' + val).substr(val.length))
    }
  })
  return fmt
}
