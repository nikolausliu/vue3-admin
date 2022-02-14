<template>
  <div>
    <div class="query-form">
      <a-form layout="inline" :colon="false">
        <a-form-item label="部门名称">
          <a-input
            v-model:value="queryForm.deptName"
            placeholder="请输入部门名称"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="fetchTable">查询</a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="base-table">
      <div class="action group-btn-wrap">
        <a-button type="primary" @click="handleAdd">新增</a-button>
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
              <a-button type="primary" size="small" @click="handleEdit(record)">编辑</a-button>
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
      :title="`${modal.action === 'add' ? '新增' : '编辑'}部门`"
      :mask-closable="false"
      :footer="null"
      width="500px"
      @cancel="handleClose"
    >
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item label="上级部门" v-bind="validateInfos.parentId">
          <a-cascader
            v-model:value="modalForm.parentId"
            placeholder="请选择上级部门"
            :options="table.list"
            :field-names="{ label: 'deptName', value: '_id' }"
            change-on-select
            allow-clear
            style="width: 175px"
          />
          <span style="margin-left: 10px">不选，则直接创建一级部门</span>
        </a-form-item>
        <a-form-item label="部门名称" v-bind="validateInfos.deptName">
          <a-input v-model:value="modalForm.deptName" placeholder="请输入部门名称" allow-clear>
          </a-input>
        </a-form-item>
        <a-form-item label="负责人" v-bind="validateInfos.userId">
          <a-select
            v-model:value="modalForm.userId"
            placeholder="请选择负责人"
            allow-clear
            @change="handleUserChange"
          >
            <a-select-option v-for="user in userList" :key="user.userId" :value="user.userId">{{
              user.userName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="负责人邮箱" v-bind="validateInfos.userEmail">
          <a-input
            v-model:value="modalForm.userEmail"
            placeholder="请输入负责人邮箱"
            allow-clear
            disabled
          >
          </a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 5 }">
          <a-button type="primary" :loading="modal.submitLoading" @click="handleSubmit">
            确定
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Form, message } from 'ant-design-vue'
import api from '@/api'

const columns = [
  {
    key: 'deptName',
    dataIndex: 'deptName',
    title: '部门名称',
    width: '300px',
  },
  {
    key: 'userName',
    dataIndex: 'userName',
    title: '负责人',
  },
  {
    key: 'updateTime',
    dataIndex: 'updateTime',
    title: '更新时间',
  },
  {
    key: 'createTime',
    dataIndex: 'createTime',
    title: '创建时间',
  },
  {
    key: 'action',
    title: '操作',
    align: 'center',
    width: 150,
    slots: { customRender: 'action' },
  },
]
const queryForm = ref({
  detpName: '',
})
const table = reactive({
  list: [] as Recordable[],
  loading: true,
  error: false,
})
const fetchTable = () => {
  table.loading = true
  api
    .getDeptList(queryForm.value)
    .then((res) => {
      table.list = res.data.data
      table.loading = false
      table.error = false
    })
    .catch(() => {
      table.list = []
      tabel.loading = false
      table.error = true
    })
}
const userList = ref<Recordable[]>([])
const fetchUserList = async () => {
  const res = await api.getAllUserList()
  userList.value = res.data.data
}
const handleUserChange = (value: number) => {
  const target = userList.value.find((item) => item.userId === value)
  if (target) {
    modalForm.value.userName = target.userName
    modalForm.value.userEmail = `${target.userName}@gmail.com`
  } else {
    modalForm.value.userName = ''
    modalForm.value.userEmail = ''
  }
}

const modal = reactive({
  visible: false,
  action: 'add', // add | edit
  rules: {
    // parentId: [{ required: true, type: 'array', message: '请输入用户名' }],
    deptName: [{ required: true, message: '请输入部门名称' }],
    userId: [{ required: true, message: '请选择负责人' }],
  },
  submitLoading: false,
})
const modalForm = ref<Recordable>({
  parentId: [],
  deptName: '',
  userId: null,
  userName: '',
  userEmail: '',
})
const { resetFields, validate, validateInfos } = Form.useForm(modalForm, modal.rules)
const handleClose = () => {
  modal.visible = false
  resetFields()
}
const handleAdd = () => {
  modal.visible = true
  modal.action = 'add'
}
const handleEdit = (record: Recordable) => {
  modal.visible = true
  modal.action = 'edit'
  modalForm.value = { ...record }
  modalForm.value.userId = Number(modalForm.value.userId)
  if (modalForm.value.parentId && modalForm.value.parentId[0] === null) {
    modalForm.value.parentId = []
  }
}
const handleDelete = async (record: Recordable) => {
  const res = await api.deptOperate({
    _id: record._id,
    action: 'delete',
  })
  message.success('删除成功')
  fetchTable()
}
const handleSubmit = () => {
  validate()
    .then(async () => {
      modal.submitLoading = true
      const params: Recordable = {
        action: modal.action,
        ...modalForm.value,
      }
      if (!params.parentId.length) {
        params.parentId = [null]
      }
      await api.deptOperate(params)
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
fetchUserList()
</script>

<script lang="ts">
export default {
  name: 'Dept',
}
</script>

<style lang="less" scoped></style>
