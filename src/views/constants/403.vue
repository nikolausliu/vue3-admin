<template>
  <a-result status="403" title="403" sub-title="抱歉，您无权限访问此页面!">
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
  name: '403',

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
