<template>
  <div>
    <div class="query-form">
      <a-form layout="inline" :colon="false">
        <a-form-item label="用户ID">
          <a-input
            v-model:value="queryForm.userId"
            placeholder="请输入用户ID"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="用户名称">
          <a-input
            v-model:value="queryForm.userName"
            placeholder="请输入用户名称"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="queryForm.state" placeholder="请选择状态" style="width: 200px">
            <a-select-option :value="0"> 所有 </a-select-option>
            <a-select-option :value="1"> 在职 </a-select-option>
            <a-select-option :value="2"> 离职 </a-select-option>
            <a-select-option :value="3"> 试用期 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="fetchTable">查询</a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="base-table">
      <div class="action group-btn-wrap">
        <a-button type="primary" @click="handleAdd">新增</a-button>
        <a-button danger :disabled="!checkedUserIds.length" @click="handlePatchDelete"
          >批量删除</a-button
        >
      </div>
      <a-config-provider>
        <template #renderEmpty>
          <base-empty :is-error="table.error" @click="fetchTable" />
        </template>
        <a-table
          :columns="columns"
          :data-source="table.list"
          :row-selection="rowSelection"
          :loading="table.loading"
          :pagination="false"
          :scroll="{ x: true }"
          size="small"
          row-key="_id"
        >
          <template #role="{ record }">
            {{ roleMap[record.role] }}
          </template>
          <template #state="{ record }">
            {{ stateMap[record.state] }}
          </template>
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
      :title="`${modal.action === 'add' ? '新增' : '编辑'}用户`"
      :mask-closable="false"
      :footer="null"
      width="500px"
      @cancel="handleClose"
    >
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-item label="用户名" v-bind="validateInfos.userName">
          <a-input
            v-model:value="modalForm.userName"
            placeholder="请输入用户名"
            allow-clear
            :disabled="modal.action === 'edit'"
          >
          </a-input>
        </a-form-item>
        <a-form-item label="邮箱" v-bind="validateInfos.userEmail">
          <a-input
            v-model:value="modalForm.userEmail"
            placeholder="邮箱"
            allow-clear
            :disabled="modal.action === 'edit'"
          >
          </a-input>
        </a-form-item>
        <a-form-item label="手机号" v-bind="validateInfos.mobile">
          <a-input v-model:value="modalForm.mobile" placeholder="手机号" allow-clear> </a-input>
        </a-form-item>
        <a-form-item label="岗位" v-bind="validateInfos.job">
          <a-input v-model:value="modalForm.job" placeholder="岗位" allow-clear> </a-input>
        </a-form-item>
        <a-form-item label="状态" v-bind="validateInfos.state">
          <a-radio-group v-model:value="modalForm.state">
            <a-radio :value="1">在职</a-radio>
            <a-radio :value="2">离职</a-radio>
            <a-radio :value="3">试用期</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="系统角色" v-bind="validateInfos.roleList">
          <a-select
            v-model:value="modalForm.roleList"
            mode="multiple"
            placeholder="请选择系统角色"
            allow-clear
          >
            <a-select-option v-for="role in roleList" :key="role._id" :value="role._id">{{
              role.roleName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="部门" v-bind="validateInfos.deptId">
          <a-cascader
            v-model:value="modalForm.deptId"
            placeholder="请选择部门"
            :options="deptList"
            :field-names="{ label: 'deptName', value: '_id' }"
            change-on-select
            allow-clear
          />
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
import { ref, reactive } from 'vue'
import { Form, message } from 'ant-design-vue'
import { ColumnProps } from 'ant-design-vue/es/table/interface'
import api from '@/api'

const columns = [
  {
    key: 'userId',
    dataIndex: 'userId',
    align: 'center',
    title: '用户ID',
  },
  {
    key: 'userName',
    dataIndex: 'userName',
    align: 'center',
    title: '用户名',
  },
  {
    key: 'userEmail',
    dataIndex: 'userEmail',
    align: 'center',
    title: '用户邮箱',
  },
  {
    key: 'role',
    dataIndex: 'role',
    align: 'center',
    title: '用户角色',
    slots: { customRender: 'role' },
  },
  {
    key: 'state',
    dataIndex: 'state',
    align: 'center',
    title: '用户状态',
    slots: { customRender: 'state' },
  },
  {
    key: 'createTime',
    dataIndex: 'createTime',
    align: 'center',
    title: '注册时间',
  },
  {
    key: 'lastLoginTime',
    dataIndex: 'lastLoginTime',
    align: 'center',
    title: '最后登录时间',
  },
  {
    key: 'action',
    title: '操作',
    align: 'center',
    width: 150,
    fixed: 'right',
    slots: { customRender: 'action' },
  },
]
type Key = ColumnProps['key']
const rowSelection = {
  // 多选列change事件
  onChange: (selectedRowKeys: Key[], selectedRows: Recordable[]) => {
    checkedUserIds.value = selectedRows.map((item) => item.userId)
  },
}
// 选中的用户ID列表
const checkedUserIds = ref([])

const roleMap = reactive({
  0: '管理员',
  1: '普通用户',
})
const stateMap = reactive({
  1: '在职',
  2: '离职',
  3: '试用期',
})

const queryForm = ref({
  pageNum: 1,
  pageSize: 10,
  userId: '',
  userName: '',
  state: 1,
})

const table = reactive({
  list: [] as Recordable[],
  loading: true,
  error: false,
  total: 0,
})
const fetchTable = () => {
  table.loading = true
  api
    .getUserList(queryForm.value)
    .then((res) => {
      table.list = res.data.data.list
      table.total = res.data.data.page.toal
      table.loading = false
      table.error = false
    })
    .catch(() => {
      table.list = []
      tabel.total = 0
      tabel.loading = false
      table.error = true
    })
}
const deptList = ref<Recordable[]>([])
const fetchDeptList = async () => {
  const res = await api.getDeptList()
  deptList.value = res.data.data
}
const roleList = ref<Recordable[]>([])
const fetchRoleList = async () => {
  const res = await api.getRoleAllList()
  roleList.value = res.data.data
}

const modal = reactive({
  visible: false,
  action: 'add', // add | edit
  rules: {
    userName: [{ required: true, message: '请输入用户名' }],
    userEmail: [{ required: true, message: '请输入用户名' }],
    deptId: [{ required: true, type: 'array', message: '请选择部门' }],
  },
  submitLoading: false,
})
const modalForm = ref<Recordable>({
  userName: '',
  userEmail: '',
  mobile: '',
  job: '',
  state: 1,
  roleList: [],
  deptId: [],
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
}

const handleDelete = async (record: Recordable) => {
  const res = await api.userDel({
    userIds: [record.userId],
  })
  message.success('删除成功')
  fetchTable()
}
const handlePatchDelete = async () => {
  const res = await api.userDel({
    userIds: checkedUserIds.value,
  })
  console.log(res)
  if (res.data.data.nModified > 0) {
    message.success('删除成功')
    fetchTable()
  }
}

const handleSubmit = () => {
  validate()
    .then(async () => {
      modal.submitLoading = true
      const params = {
        action: modal.action,
        ...modalForm.value,
      }
      await api.userSubmit(params)
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
fetchDeptList()
fetchRoleList()
</script>

<script lang="ts">
export default {
  name: 'User',
}
</script>

<style lang="less" scoped></style>
