<template>
  <div class="base-empty">
    <a-empty :image="emptyImage" :description="isError ? errorDescription : emptyDescription" />
    <slot name="opts">
      <a-button
        v-if="isError"
        class="refetch-button"
        type="primary"
        size="small"
        @click="handleRefetch"
        >重新加载</a-button
      >
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { Empty } from 'ant-design-vue'

export default defineComponent({
  name: 'BaseEmpty',

  props: {
    isError: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    errorDescription: {
      type: String as PropType<string>,
      default: '数据加载失败',
    },
    emptyDescription: {
      type: String as PropType<string>,
      default: '暂无数据',
    },
  },

  emits: ['refetch'],

  setup(props, { emit }) {
    const emptyImage = ref(Empty.PRESENTED_IMAGE_SIMPLE)

    function handleRefetch() {
      emit('refetch')
    }

    return {
      emptyImage,
      handleRefetch,
    }
  },
})
</script>

<style lang="less" scoped>
.refetch-button {
  position: relative;
  display: block;
  margin: 0 auto;
  top: -10px;
  font-size: 12px;
}
</style>
