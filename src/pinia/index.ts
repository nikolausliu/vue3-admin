import { createPinia } from 'pinia'
// import { watch } from 'vue'
// import piniaPersist from './plugins/piniaPersist'

export const pinia = createPinia()

// watch(
//   pinia.state,
//   (state) => {
//     console.log('===pinia状态改变啦===')
//     // persist the whole state to the local storage whenever it changes
//     localStorage.setItem('piniaState', JSON.stringify(state))
//   },
//   { deep: true }
// )
console.log('pinia', pinia)
// store.use(piniaPersist)
