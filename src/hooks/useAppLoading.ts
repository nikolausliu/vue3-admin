import { inject, onMounted, Ref } from 'vue'

// App.vue里provide了AppLoading true
// 在每个页面onMounted的时候把AppLoading设为false
export default function useAppLoading() {
  const AppLoading = inject('AppLoading') as Ref<boolean>
  onMounted(() => {
    AppLoading.value = false
  })

  return AppLoading
}
