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
        <a-button danger :disabled="!checkedUserIds.length" @click="handleAdd">批量删除</a-button>
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
                <a-button size="small" danger @click="handleDelete(record)">删除</a-button>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </a-config-provider>
    </div>
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
      table.loading = false
      table.error = true
    })
}

const handleAdd = () => {
  modal.visible = true
  modal.action = 'add'
}

const handleEdit = (record: Recordable) => {
  // modal.visible = true
  // modal.action = 'edit'
  // // modalForm.value = { ...record }
  // modalForm.value = {
  //   _id: record._id,
  //   parentId: record.parentId,
  //   menuType: record.menuType,
  //   menuName: record.menuName,
  //   menuCode: record.menuCode,
  //   icon: record.icon,
  //   path: record.path,
  //   component: record.component,
  //   menuState: record.menuState,
  // }
  // if (modalForm.value.parentId && modalForm.value.parentId[0] === null) {
  //   modalForm.value.parentId = []
  // }
}

const handleDelete = (record: Recordable) => {
  // api
  //   .menuSubmit({ _id: record._id, action: 'delete' })
  //   .then((res) => {
  //     message.success('删除成功')
  //     fetchTable()
  //   })
  //   .catch(() => {})
}

fetchTable()
</script>

<script lang="ts">
export default {
  name: 'User',
}
</script>

<style lang="less" scoped></style>
