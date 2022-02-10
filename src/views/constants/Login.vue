<template>
  <div class="login">
    <div class="login-box">
      <h1>
        <svg-icon class="icon" icon-class="ima-icon-logo-twotone"></svg-icon>
        <span>欢迎登录</span>
      </h1>
      <a-form ref="formRef" layout="vertical" :model="state.form" :rules="state.rules">
        <a-form-item name="userName">
          <a-input v-model:value="state.form.userName" size="large" placeholder="账号" allow-clear>
            <template #prefix>
              <UserOutlined class="form-item-icon" style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="userPwd">
          <a-input-password
            v-model:value="state.form.userPwd"
            size="large"
            type="password"
            placeholder="密码"
            allow-clear
            @pressEnter="handleSubmit"
          >
            <template #prefix>
              <LockOutlined class="form-item-icon" style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button
            class="submit"
            type="primary"
            html-type="submit"
            size="large"
            :disabled="disabled"
            :loading="state.submitLoading"
            @click="handleSubmit"
            >登录</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { getFirstRoutePath } from '@/utils'
import md5 from 'md5'
import { useUserStore } from '@/pinia/modules/user'

export default defineComponent({
  name: 'Login',

  components: {
    UserOutlined,
    LockOutlined,
  },

  setup() {
    const userStore = useUserStore()
    const { replace } = useRouter()
    const { query } = useRoute()

    const state = reactive({
      form: {
        userName: '',
        userPwd: '',
      },
      rules: {
        userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        userPwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      submitLoading: false,
    })

    const formRef = ref()

    const disabled = computed(() => state.form.userName === '' || state.form.userPwd === '')

    const handleSubmit = () => {
      formRef.value
        .validate()
        .then(async () => {
          state.submitLoading = true
          const params = {
            userName: state.form.userName,
            userPwd: md5(state.form.userPwd),
          }
          await userStore.login(params)
          const { redirect } = query
          const firstRoutePath = getFirstRoutePath()
          if (redirect) {
            replace({
              path: (redirect as string) || firstRoutePath,
            })
          } else {
            replace({
              path: firstRoutePath,
            })
          }
          message.success('登录成功!')
        })
        .catch((error: any) => {
          console.log('login error', error)
        })
        .finally(() => {
          state.submitLoading = false
        })
    }

    return {
      state,
      formRef,
      disabled,
      handleSubmit,
    }
  },
})
</script>

<style lang="less" scoped>
.login {
  position: relative;
  height: 100vh;
  background: #2d3a4b;
  &-box {
    position: absolute;
    width: 500px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 50px;
    background: #fff;
    border-radius: 4px;
    h1 {
      text-align: center;
      .icon {
        display: inline-block;
        vertical-align: top;
        margin-right: 10px;
        width: 32px;
        height: 32px;
        font-size: 32px;
        color: @primary-color;
      }
      span {
        display: inline-block;
        vertical-align: top;
        line-height: 32px;
        font-size: 24px;
        // color: #fff;
        color: @primary-color;
      }
    }

    .form-item-icon {
      color: rgba(0, 0, 0, 0.25);
      margin-right: 5px;
    }

    .submit {
      width: 100%;
    }
  }
}
</style>
