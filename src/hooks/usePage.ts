import { unref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

/**
 * 刷新当前路由
 * see /src/views/constant/Redirect.vue
 */
export function useRefresh() {
  const { currentRoute, replace } = useRouter()
  const route = useRoute()

  function refreshRoute() {
    replace({
      path: `/redirect${unref(currentRoute).fullPath}`,
      query: route.query,
    })
  }
  return {
    refreshRoute,
  }
}
