<template>
  <div>
    <div class="query-form">
      <a-form layout="inline" :colon="false">
        <a-form-item label="菜单名称">
          <a-input
            v-model:value="queryForm.menuName"
            placeholder="请输入菜单名称"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="菜单状态">
          <a-select
            v-model:value="queryForm.menuState"
            placeholder="请选择菜单状态"
            style="width: 200px"
          >
            <a-select-option :value="1"> 正常 </a-select-option>
            <a-select-option :value="2"> 停用 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="fetchTable">查询</a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="base-table">
      <div class="action">
        <a-button type="primary" @click="handleAdd(1)">新增</a-button>
      </div>
      <a-config-provider>
        <template #renderEmpty>
          <base-empty :is-error="table.error" @click="fetchTable" />
        </template>
        <a-table
          :columns="columns"
          :data-source="table.list"
          :loading="table.loading"
          :pagination="false"
          :scroll="{ x: true }"
          size="small"
          row-key="_id"
        >
          <template #action="{ record }">
            <span class="group-btn-wrap">
              <a-button type="primary" size="small" @click="handleAdd(2, record)">新增</a-button>
              <a-button size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm
                title="确定要删除吗?"
                ok-text="是"
                cancel-text="否"
                @confirm="handleDelete(record)"
              >
                <a-button size="small" danger>删除</a-button>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </a-config-provider>
    </div>
    <a-modal
      v-model:visible="modal.visible"
      :title="`${modal.action === 'add' ? '新增' : '编辑'}菜单`"
      :mask-closable="false"
      :footer="null"
      width="500px"
      @cancel="handleClose"
    >
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-item label="父级菜单" v-bind="validateInfos.parentId">
          <a-cascader
            v-model:value="modalForm.parentId"
            placeholder="请选择父级菜单"
            :options="table.list"
            :field-names="{ label: 'menuName', value: '_id' }"
            change-on-select
            allow-clear
            style="width: 190px"
          />
          <span style="margin-left: 10px">不选，则直接创建一级菜单</span>
        </a-form-item>
        <a-form-item label="菜单类型" v-bind="validateInfos.menuType">
          <a-radio-group v-model:value="modalForm.menuType">
            <a-radio :value="1">菜单</a-radio>
            <a-radio :value="2">按钮</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="菜单名称" v-bind="validateInfos.menuName">
          <a-input v-model:value="modalForm.menuName" placeholder="请输入菜单名称" allow-clear>
          </a-input>
        </a-form-item>
        <a-form-item
          v-if="modalForm.menuType === 2"
          label="权限标志"
          v-bind="validateInfos.menuCode"
        >
          <a-input v-model:value="modalForm.menuCode" placeholder="请输入权限标志" allow-clear>
          </a-input>
        </a-form-item>
        <a-form-item v-if="modalForm.menuType === 1" label="菜单图标" v-bind="validateInfos.icon">
          <a-input v-model:value="modalForm.icon" placeholder="请输入菜单图标" allow-clear>
          </a-input>
        </a-form-item>
        <a-form-item v-if="modalForm.menuType === 1" label="路由地址" v-bind="validateInfos.path">
          <a-input v-model:value="modalForm.path" placeholder="请输入路由地址" allow-clear>
          </a-input>
        </a-form-item>
        <a-form-item
          v-if="modalForm.menuType === 1"
          label="组件路径"
          v-bind="validateInfos.component"
        >
          <a-input v-model:value="modalForm.component" placeholder="请输入组件路径" allow-clear>
          </a-input>
        </a-form-item>
        <a-form-item v-if="modalForm.menuType === 1" label="菜单状态">
          <a-radio-group v-bind="validateInfos.menuState" v-model:value="modalForm.menuState">
            <a-radio :value="1">正常</a-radio>
            <a-radio :value="2">停用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" :loading="modal.submitLoading" @click="handleSubmit">
            确定
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRef } from 'vue'
import { Form, message } from 'ant-design-vue'
import api from '@/api'

const columns = [
  {
    key: 'menuName',
    dataIndex: 'menuName',
    title: '菜单名称',
    width: '200px',
  },
  {
    key: 'icon',
    dataIndex: 'icon',
    title: '图标',
  },
  {
    key: 'menuType',
    dataIndex: 'menuType',
    title: '菜单类型',
  },
  {
    key: 'menuCode',
    dataIndex: 'menuCode',
    title: '权限标志',
  },
  {
    key: 'path',
    dataIndex: 'path',
    title: '路由地址',
  },
  {
    key: 'component',
    dataIndex: 'component',
    title: '组件路径',
  },
  {
    key: 'menuState',
    dataIndex: 'menuState',
    title: '菜单状态',
  },
  {
    key: 'action',
    title: '操作',
    width: 150,
    slots: { customRender: 'action' },
  },
]

const queryForm = ref({
  menuName: '',
  menuState: 1,
})
const table = reactive({
  list: [] as Recordable[],
  loading: true,
  error: false,
  total: 0,
})

const modal = reactive({
  visible: false,
  action: 'add', // add | edit
  rules: {
    menuName: [{ required: true, message: '请输入菜单名称' }],
  },
  submitLoading: false,
})
const modalForm = ref({
  parentId: [],
  menuType: 1,
  menuName: '',
  menuCode: '',
  icon: '',
  path: '',
  component: '',
  menuState: 1,
})

const { resetFields, validate, validateInfos } = Form.useForm(modalForm, modal.rules)

const fetchTable = () => {
  table.loading = true
  api
    .getMenuList(queryForm.value)
    .then((res) => {
      table.loading = false
      table.error = false
      table.list = res.data.data
    })
    .catch(() => {
      table.loading = false
      table.error = true
    })
}

const handleAdd = (type: 1 | 2, record: Recordable = {}) => {
  modal.visible = true
  modal.action = 'add'
  if (type === 2) {
    modalForm.value.parentId = [...record.parentId, record._id].filter((item) => item)
  }
}

const handleEdit = (record: Recordable) => {
  modal.visible = true
  modal.action = 'edit'
  // modalForm.value = { ...record }
  modalForm.value = {
    _id: record._id,
    parentId: record.parentId,
    menuType: record.menuType,
    menuName: record.menuName,
    menuCode: record.menuCode,
    icon: record.icon,
    path: record.path,
    component: record.component,
    menuState: record.menuState,
  }
  if (modalForm.value.parentId && modalForm.value.parentId[0] === null) {
    modalForm.value.parentId = []
  }
}

const handleDelete = (record: Recordable) => {
  api
    .menuSubmit({ _id: record._id, action: 'delete' })
    .then((res) => {
      message.success('删除成功')
      fetchTable()
    })
    .catch(() => {})
}

const handleClose = () => {
  modal.visible = false
  resetFields()
}

const handleSubmit = () => {
  validate()
    .then(async () => {
      console.log(111)
      modal.submitLoading = true
      const params: Recordable = {
        action: modal.action,
        ...modalForm.value,
      }
      if (!params.parentId.length) {
        params.parentId = [null]
      }
      console.log(2, params)
      await api.menuSubmit(params)
      modal.submitLoading = false
      message.success('操作成功')
      handleClose()
      fetchTable()
    })
    .catch((err) => {
      console.log(err)
    })
}

fetchTable()
</script>

<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<style lang="less" scoped></style>
