<template>
  <a-breadcrumb class="breadcrumb">
    <!-- a-breadcrumb只接受a-breadcrumb-item为子组件，所以要做动画只能自己实现面包屑组件 -->
    <!-- <transition-group name="breadcrumb"> -->
    <a-breadcrumb-item
      v-for="(item, index) in breadcrumbList"
      :key="item.path"
      :class="{ islink: index !== breadcrumbList.length - 1 }"
      @click="handleClick(item)"
    >
      <span>{{ item.meta.title }}</span>
    </a-breadcrumb-item>
    <!-- </transition-group> -->
  </a-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, unref, computed } from 'vue'
import { Breadcrumb } from 'ant-design-vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Breadcrumb',

  components: {
    [Breadcrumb.name]: Breadcrumb,
    [Breadcrumb.Item.name]: Breadcrumb.Item,
  },

  setup() {
    const { currentRoute, push } = useRouter()

    const breadcrumbList = computed(() => {
      const matched = [...unref(currentRoute).matched]
      // 把面包屑 `异常 / 404` 处理成 `404`
      const exceptionIndex = matched.findIndex((item) => item.name === 'exception')
      if (exceptionIndex > -1) {
        matched.splice(exceptionIndex, 1)
      }
      return matched
    })

    // TODO: any
    function handleClick(item: any) {
      push({
        path: item.path,
      })
    }

    return {
      breadcrumbList,
      handleClick,
    }
  },
})
</script>

<style lang="less" scoped>
.breadcrumb {
  line-height: @header-height;
  .islink {
    cursor: pointer;
    &:hover {
      span {
        color: @link-color;
      }
    }
  }
}
</style>
