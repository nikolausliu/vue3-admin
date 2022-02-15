<template>
  <a-pagination
    v-model:current="localCurrent"
    v-model:pageSize="localPageSize"
    :total="total"
    show-less-items
    show-size-changer
    show-quick-jumper
    :show-total="(total, range) => `共 ${total} 条`"
    @change="handleChange"
    @showSizeChange="handleShowSizeChange"
  />
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import { Pagination } from 'ant-design-vue'

export default defineComponent({
  name: 'BasePagination',

  components: {
    [Pagination.name]: Pagination,
  },

  props: {
    current: {
      type: Number as PropType<number>,
      default: 1,
    },
    pageSize: {
      type: Number as PropType<number>,
      default: 10,
    },
    total: {
      type: Number as PropType<number>,
      default: 0,
    },
  },

  emits: ['update:current', 'update:pageSize', 'change', 'showSizeChange'],

  setup(props, { emit }) {
    const localCurrent = ref(props.current)
    const localPageSize = ref(props.pageSize)

    const handleChange = (page: number, pageSize: number) => {
      emit('update:current', page)
      emit('update:pageSize', pageSize)
      emit('change', { page, pageSize })
    }
    const handleShowSizeChange = (current: number, size: number) => {
      emit('update:current', current)
      emit('update:pageSize', size)
      emit('showSizeChange', { current, size })
    }

    return {
      localCurrent,
      localPageSize,
      handleChange,
      handleShowSizeChange,
    }
  },
})
</script>

<style lang="less" scoped></style>
