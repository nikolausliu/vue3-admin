<template>
  <a-range-picker
    v-model:value="value"
    :format="format"
    :value-format="format"
    :placeholder="placeholder"
    :show-time="showTime"
    :style="style"
    allow-clear
    @change="handleChange"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { getDefaultStartTime, getDefaultEndTime } from '@/utils/time'

const props = withDefaults(
  defineProps<{
    start: string
    end: string
    showTime?: boolean | object
    format?: string
    placeholder?: [string, string]
    style?: object | null
  }>(),
  {
    start: '',
    end: '',
    /**
     * 是否精确到时分秒。showTime和format需要联动使用
     * 默认值是 ['00:00:00', '23:59:59']，即精确到秒。如果使用默认值，同时 format也使用默认值
     * 如果需要精确到天，则需要设置为false，同时 format使用 'YYYY-MM-DD'
     * 同样支持设置精确到时或分，注意和format搭配使用即可
     */
    showTime: () => ({
      defaultValue: [getDefaultStartTime(), getDefaultEndTime()],
    }),
    /**
     * 格式遵循ant-design-vue文档，需要和showTime参数搭配使用。常用的枚举值有：
     * YYYY-MM-DD HH:mm:ss 精确到秒
     * YYYY-MM-DD 精确到天
     */
    format: 'YYYY-MM-DD HH:mm:ss',
    placeholder: () => ['开始时间', '结束时间'],
    // 如果想清空默认样式，设置 :style="null"
    style: () => ({
      width: '350px',
    }),
  }
)

const emit = defineEmits(['update:start', 'update:end', 'change'])

const value = ref([] as string[])

const handleChange = (date: string[]) => {
  emit('update:start', date[0] || '')
  emit('update:end', date[1] || '')
  emit('change', date)
}

watch(
  [() => props.start, () => props.end],
  (newVal) => {
    value.value = newVal
  },
  {
    immediate: true,
  }
)
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RangePicker',
})
</script>

<style lang="less" scoped></style>
