<template>
  <div class="user-dropdown">
    <a-dropdown>
      <div class="user">
        <a-avatar class="avatar" :size="26">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        <span class="username">{{ username }}</span>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="logout"> <PoweroffOutlined />退出登录 </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Dropdown, Menu, Avatar } from 'ant-design-vue'
import { UserOutlined, PoweroffOutlined } from '@ant-design/icons-vue'
import useModal from '@/hooks/useModal'
import { useUserStore } from '@/pinia/modules/user'

export default defineComponent({
  name: 'UserDropdown',

  components: {
    [Dropdown.name]: Dropdown,
    [Menu.name]: Menu,
    [Menu.Item.name]: Menu.Item,
    [Avatar.name]: Avatar,
    UserOutlined,
    PoweroffOutlined,
  },

  props: {
    username: {
      type: String as PropType<string>,
      default: '',
    },
  },

  setup() {
    const userStore = useUserStore()
    console.log('userStore in userDropDown', userStore)
    const { push } = useRouter()
    const route = useRoute()
    const { confirm } = useModal()
    function logout() {
      confirm({
        title: '温馨提示',
        content: '确认退出登陆吗？',
      })
        .then(() => {
          userStore.logout()
          push({
            path: '/login',
            query: {
              redirect: route.fullPath,
            },
          })
        })
        .catch(() => {})
    }

    return {
      logout,
    }
  },
})
</script>

<style lang="less" scoped>
.user {
  padding: 0 10px;
  cursor: pointer;
  .username {
    margin-left: 10px;
  }
}
</style>
