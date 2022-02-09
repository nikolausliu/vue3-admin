<template>
  <a-config-provider :locale="locale" :auto-insert-space-in-button="false">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
// 支持时间类组件的语言设置，另外使用vite需要额外`yarn add moment`
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
moment.locale('zh-cn')

export default defineComponent({
  name: 'App',

  setup() {
    const locale = ref(zhCN)

    return {
      locale,
    }
  },
})
</script>
<style lang="less">
// 针对ant design UI的bug处理
// .ant-form-item-label{
//   line-height: 40px;
// }
.ant-form-inline .ant-form-item {
  margin-bottom: 10px !important;
}
// modal弹框全屏
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
// 全局的disabled样式 和ant一致
.disabled {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}
</style>
