<template>
  <a-sub-menu :key="menuRaw.path">
    <template #title>
      <span>
        <svg-icon
          v-if="menuRaw.icon"
          :icon-class="menuRaw.icon"
          class="anticon menu-item-icon"
        ></svg-icon>
        <span>{{ menuRaw.title }}</span>
      </span>
    </template>
    <template v-for="item in menuRaw.children">
      <a-menu-item v-if="item.children.length === 0" :key="item.path">{{ item.title }}</a-menu-item>
      <template v-else>
        <!-- 递归组件 -->
        <sub-menu :key="item.path" :menu-raw="item"></sub-menu>
      </template>
    </template>
  </a-sub-menu>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { props } from './props'
import { Menu } from 'ant-design-vue'
// import { useRouter, RouteRecordRaw, RouteMeta } from 'vue-router'

export default defineComponent({
  name: 'SubMenu',

  components: {
    [Menu.SubMenu.name]: Menu.SubMenu,
    [Menu.Item.name]: Menu.Item,
  },

  props,

  setup(props) {
    const localMenuRaw = ref(props.menuRaw)
    // const { getRoutes } = useRouter()
    // const calcKey = (path: string): string => {
    //   const routes = getRoutes()
    //   const route = routes.find((r) => r.path === path) as RouteRecordRaw
    //   return ((route.meta as RouteMeta).activePath as string) || route.path
    // }
    // console.log("localMenuRaw:",localMenuRaw)
    return {
      localMenuRaw,
      // calcKey,
    }
  },
})
</script>

<style lang="less" scoped>
.menu-item-icon {
  margin-right: 10px;
}
</style>
