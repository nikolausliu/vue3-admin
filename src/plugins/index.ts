import { App } from 'vue'
import { usePinia } from './pinia'
import { installRouter } from './router'
// import { installStore } from './store'
import { installAnt } from './ant'
import { regGlobComp } from './regGlobComp'

import '@/styles/index.less'

export function install(app: App): App {
  usePinia(app)
  console.log(111, 'usePinia')
  installRouter(app)
  // installStore(app)
  installAnt(app)
  regGlobComp(app)
  return app
}
