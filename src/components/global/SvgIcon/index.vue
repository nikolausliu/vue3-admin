<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { props } from './props'
import '@/assets/fonts/iconfont'
export default defineComponent({
  name: 'SvgIcon',

  props,

  setup(props) {
    const iconName = computed(() => `#${props.iconClass}`)

    return {
      iconName,
    }
  },
})
</script>

<style lang="less" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
