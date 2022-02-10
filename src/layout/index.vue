<template>
  <a-layout class="app-layout" :class="{ collapsed: collapsed }">
    <a-layout-sider
      v-model:collapsed="collapsed"
      class="app-sider"
      :class="[`app-sider--${theme}`]"
      :theme="theme"
      collapsible
    >
      <div class="logo">
        <svg-icon class="icon" icon-class="icon-vue"></svg-icon>
        <span>VUE3-ADMIN</span>
      </div>
      <div class="menu-wrap">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          :theme="theme"
          mode="inline"
          @click="handleMenuClick"
        >
          <template v-for="item in menus" :key="item.path + 1">
            <!-- <a-menu-item v-if="item.children.length === 0" :key="item.path">
              <svg-icon :icon-class="item.icon" class="anticon menu-item-icon"></svg-icon>
              <span>{{ item.title }}</span>
            </a-menu-item> -->
            <!-- `:key="item.path + 1"` solve issue `v-if/else branches must use unique keys. vue(29)` -->
            <!-- <sub-menu v-else :key="item.path + 1" :menu-raw="item"></sub-menu> -->
            <sub-menu :menu-raw="item"></sub-menu>
          </template>
        </a-menu>
      </div>
    </a-layout-sider>
    <a-layout class="app-layout-main">
      <a-layout-header class="app-header clearfix" :class="[`app-header--${headerTheme}`]">
        <div class="left-menus clearfix">
          <ArrowLeftOutlined v-if="backVisible" class="back" @click="back" />
          <breadcrumb class="breadcrumb menu-item" />
        </div>
        <div class="right-menus clearfix">
          <a-tooltip placement="bottom">
            <template #title>
              <span>刷新</span>
            </template>
            <div class="menu-item menu-item-icon" @click="refreshRoute">
              <SyncOutlined />
            </div>
          </a-tooltip>
          <user-dropdown class="menu-item" :username="username"></user-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="app-content">
        <page-loading />
        <setting />
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
// custom components
import SubMenu from './components/SubMenu/index.vue'
import UserDropdown from './components/UserDropdown/index.vue'
import Breadcrumb from './components/Breadcrumb/index.vue'
import Setting from './components/Setting/index.vue'
// store
import { useMenusStore } from '@/pinia/modules/menus'
import { useSettingStore } from '@/pinia/modules/setting'
import { useUserStore } from '@/pinia/modules/user'
import { useAppStore } from '@/pinia/modules/app'
// hooks
import useSelectedKeys from '@/hooks/menus/useSelectedKeys'
import useOpenKeys from '@/hooks/menus/useOpenKeys'
import useMenuClick from '@/hooks/menus/useMenuClick'
import useAppBack from '@/hooks/menus/useAppBack'
import { useRefresh } from '@/hooks/usePage'
// assets
import logo from '@/assets/imgs/logo.png'
import logoText from '@/assets/imgs/logo-text.png'

const menusStore = useMenusStore()
const menus = menusStore.menus
const settingStore = useSettingStore()
const theme = computed(() => settingStore.menu.theme)
const headerTheme = computed(() => settingStore.header.theme)
const userStore = useUserStore()
const username = computed(() => (userStore.user.userName as string) || '')
const appStore = useAppStore()
const backVisible = computed(() => appStore.backVisible)

const { selectedKeys } = useSelectedKeys()
const { openKeys } = useOpenKeys()
const { handleMenuClick } = useMenuClick()
const { back } = useAppBack()
const { refreshRoute } = useRefresh()

const collapsed = ref(false)
</script>

<style lang="less" scoped>
.app-layout {
  /* sider */
  .app-sider {
    &--dark {
      background: @layout-sider-background;
      .logo span {
        color: #fff;
      }
    }
    &--light {
      background: @layout-sider-background-light;
      .logo span {
        color: @primary-color;
      }
    }
    .logo {
      height: 32px;
      margin: 16px;
      overflow: hidden;
      // text-align: center;
      .icon {
        display: inline-block;
        vertical-align: top;
        width: 32px;
        height: 32px;
        margin-right: 10px;
        margin-left: 5px;
        color: @primary-color;
      }
      span {
        display: inline-block;
        vertical-align: top;
        color: #fff;
        font-size: 14px;
        line-height: 32px;
        overflow: hidden;
        white-space: nowrap;
        opacity: 1;
        transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
          width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      .logo-icon {
        display: inline-block;
        vertical-align: top;
        width: 32px;
        height: 32px;
        margin-right: 10px;
        margin-left: 5px;
      }
      .logo-text {
        display: inline-block;
        vertical-align: top;
        height: 32px;
        width: auto;
        opacity: 1;
        transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
          width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
    .menu-wrap {
      // 菜单设定一个固定高度以实现滚动
      // 高度计算：100vh - logo高度(32 + 16 + 16) - 菜单折叠器高度(48)
      height: calc(100vh - 64px - 48px);
      // height: 100vh;
      overflow-y: auto;
    }
    .menu-item-icon {
      margin-right: 10px;
    }
    &--dark {
      background: @layout-sider-background;
      .logo span {
        color: #fff;
      }
    }
    &--light {
      background: @layout-sider-background-light;
      .logo span {
        color: @primary-color;
      }
    }
  }

  .app-layout-main {
    height: 100vh;
    overflow-y: auto;
  }

  /* header */
  .app-header {
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    width: calc(100% - @sider-width);
    transition: all 0.2s;
    height: @header-height;
    line-height: @header-height;
    padding: 0;
    background: #fff;
    box-shadow: @box-shadow-btm;
    &--dark {
      background: @layout-header-custom-background;
      color: #fff;
      .right-menus {
        .menu-item {
          &:hover {
            background: @layout-header-custom-background-hover;
          }
        }
      }
    }
    &--light {
      background: @layout-header-custom-background-light;
      color: #333;
      .right-menus {
        .menu-item {
          &:hover {
            background: @layout-header-custom-background-light-hover;
          }
        }
      }
    }
    .left-menus {
      float: left;
      padding: 0 20px;
      .back {
        float: left;
        margin-right: 10px;
        margin-top: 16px;
        color: @primary-color;
        cursor: pointer;
      }
      .menu-item {
        float: left;
      }
    }
    .right-menus {
      float: right;
      padding: 0 20px;
      .menu-item {
        float: left;
        cursor: pointer;
        &.menu-item-icon {
          padding: 0 10px;
        }
      }
    }
  }

  /* content */
  .app-content {
    position: relative;
    margin-top: @header-height;
    padding: @content-padding;
  }

  &.collapsed {
    .app-sider .logo span {
      max-width: 0;
      opacity: 0;
    }
    .app-header {
      width: calc(100% - @sider-collapse-wdith);
    }
  }
}
</style>

<style lang="less">
// 修复浅色主题下1px样式问题
.app-sider {
  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right-color: #fff;
  }
}
.app-header--dark {
  .ant-breadcrumb,
  .ant-breadcrumb-separator {
    color: rgba(255, 255, 255, 0.45);
  }
  .ant-breadcrumb > span:last-child {
    color: rgba(255, 255, 255, 0.65);
  }
}
</style>
