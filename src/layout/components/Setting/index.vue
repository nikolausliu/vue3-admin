<template>
  <div class="setting">
    <div
      v-if="!visible"
      class="setting-button"
      :class="{ 'setting-button--autofold': settingBtnAutoFold }"
      @click="visible = !visible"
    >
      <SettingOutlined class="icon" />
    </div>
    <a-drawer
      v-model:visible="visible"
      class="setting-drawer"
      title="项目配置"
      placement="right"
      :closable="true"
    >
      <div class="setting-drawer__item">
        <span>左侧菜单主题</span>
        <a-switch
          v-model:checked="theme"
          checked-children="暗色"
          un-checked-children="浅色"
        ></a-switch>
      </div>
      <div class="setting-drawer__item">
        <span>顶部导航主题</span>
        <a-switch
          v-model:checked="headerTheme"
          checked-children="暗色"
          un-checked-children="浅色"
        ></a-switch>
      </div>
      <div class="setting-drawer__item">
        <span>悬浮设置按钮自动收起</span>
        <a-switch
          v-model:checked="settingBtnAutoFold"
          checked-children="开"
          un-checked-children="关"
        ></a-switch>
      </div>
      <!-- <a-form :labelCol="{ span: 14 }" labelAlign="left" :colon="false">
        <a-form-item label="左侧菜单主题">
          <a-switch
            v-model:checked="theme"
            checked-children="暗色"
            un-checked-children="浅色"
          ></a-switch>
        </a-form-item>
        <a-form-item label="顶部导航主题">
          <a-switch
            v-model:checked="headerTheme"
            checked-children="暗色"
            un-checked-children="浅色"
          ></a-switch>
        </a-form-item>
        <a-form-item label="设置按钮自动折叠">
          <a-switch
            v-model:checked="settingBtnAutoFold"
            checked-children="是"
            un-checked-children="否"
          ></a-switch>
        </a-form-item>
      </a-form> -->
    </a-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { SettingOutlined } from '@ant-design/icons-vue'
import { Drawer } from 'ant-design-vue'
import { MenuThemeEnum } from '@/enums/menuEnums'
import { HeaderThemeEnum } from '@/enums/headerEnums'
import { useSettingStore } from '@/pinia/modules/setting'

export default defineComponent({
  name: 'Setting',

  components: {
    [Drawer.name]: Drawer,
    SettingOutlined,
  },

  setup() {
    const settingStore = useSettingStore()
    const visible = ref(false)
    const theme = computed({
      get: () => settingStore.menu.theme === MenuThemeEnum.DARK,
      set: (val: boolean) =>
        settingStore.setMenuTheme(val ? MenuThemeEnum.DARK : MenuThemeEnum.LIGHT),
    })
    const headerTheme = computed({
      get: () => settingStore.header.theme === HeaderThemeEnum.DARK,
      set: (val: boolean) =>
        settingStore.setHeaderTheme(val ? HeaderThemeEnum.DARK : HeaderThemeEnum.LIGHT),
    })
    const settingBtnAutoFold = computed({
      get: () => settingStore.panel.autoFold,
      set: (val: boolean) => settingStore.setPanelAutoFold(val),
    })

    return {
      visible,
      theme,
      headerTheme,
      settingBtnAutoFold,
    }
  },
})
</script>

<style lang="less" scoped>
.setting-button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 10;
  right: 0;
  top: 50%;
  width: 34px;
  height: 34px;
  border-radius: 6px 0 0 6px;
  transition: all 0.2s;
  background: @primary-color;
  cursor: pointer;
  &--autofold {
    transform: translate(24px, -50%);
    &:hover {
      transform: translate(0, -50%);
    }
  }
  .icon {
    color: #fff;
  }
}
.setting-drawer {
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0;
  }
}
</style>
<style lang="less">
.setting-drawer {
  .ant-drawer-body {
    padding: 10px;
  }
}
</style>
