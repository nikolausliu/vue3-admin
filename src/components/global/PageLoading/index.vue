<template>
  <div v-if="appStore.loading" class="page-loading">
    <spin class="spin" :spinning="true" size="large"></spin>
  </div>
</template>

<script lang="ts" setup>
import { Spin } from 'ant-design-vue'
import { useAppStore } from '@/pinia/modules/app'

const appStore = useAppStore()
</script>

<script lang="ts">
// eslint-disable-next-line import/first
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageLoading',
})
</script>

<style lang="less" scoped>
.page-loading {
  position: absolute;
  // display: none;
  width: 100%;
  height: 100%;
  // TODO: 层级规范
  z-index: 9999;
  background: rgba(255, 255, 255, 0.5);
  .spin {
    position: absolute;
    left: 50%;
    top: 50%;
    // TODO
    transform: translate(-50%, -50%);
  }
}
</style>
