import { App } from 'vue'
import { pinia } from '@/pinia'

export function usePinia(app: App): App {
  app.use(pinia)
  return app
}
