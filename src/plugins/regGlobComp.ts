import { App } from 'vue'

import { globalComponents } from '@/components'

// type Comp = {
//   name?: string
//   __file: string
// }

export function regGlobComp(app: App): App {
  Object.keys(globalComponents).forEach((key) => {
    const component = globalComponents[key].default
    // __file: /path/to/path/file.vue
    // const matcher = component.__file.match(/.*\/(.+)\.vue/)
    // const name = component.name || (matcher && matcher[1]) || ''
    app.component(component.name, component)
  })
  return app
}
