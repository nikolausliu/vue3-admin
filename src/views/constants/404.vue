<template>
  <a-result status="404" title="404" sub-title="抱歉，您访问的页面不存在!">
    <template #extra>
      <a-button type="primary" @click="goHome">返回首页</a-button>
    </template>
  </a-result>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Result } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { getFirstRoutePath } from '@/utils'

export default defineComponent({
  name: '404',

  components: {
    [Result.name]: Result,
  },

  setup() {
    const { replace } = useRouter()
    function goHome() {
      const firstRoutePath = getFirstRoutePath()
      replace({
        path: firstRoutePath,
      })
    }

    return {
      goHome,
    }
  },
})
</script>
