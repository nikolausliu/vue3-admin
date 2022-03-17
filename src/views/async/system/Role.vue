<template>
  <div>
    <div class="query-form">
      <a-form layout="inline" :colon="false">
        <a-form-item label="角色名称">
          <a-input
            v-model:value="queryForm.roleName"
            placeholder="请输入角色名称"
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
          <template #permissions="{ record }">
            <div style="display: flex; flex-wrap: wrap; width: 230px">
              <a-tag
                v-for="item in permissionsFilter(record.permissionList.halfCheckedKeys)"
                :key="item"
                color="blue"
                style="margin: 5px"
                >{{ item }}</a-tag
              >
            </div>
            <!-- {{ permissionsFilter(record.permissionList.halfCheckedKeys) }} -->
          </template>
          <template #action="{ record }">
            <span class="group-btn-wrap">
              <a-button type="primary" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-button size="small" @click="handlePermOpen(record)">设置权限</a-button>
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
      <div v-if="table.total" class="pagination-wrap">
        <base-pagination
          v-model:current="queryForm.pageNum"
          v-model:pageSize="queryForm.pageSize"
          :total="table.total"
          @change="fetchTable"
          @showSizeChange="fetchTable"
        />
      </div>
    </div>

    <a-modal
      v-model:visible="modal.visible"
      :title="`${modal.action === 'add' ? '新增' : '编辑'}角色`"
      :mask-closable="false"
      :footer="null"
      width="500px"
      @cancel="handleClose"
    >
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-item label="角色名称" v-bind="validateInfos.roleName">
          <a-input v-model:value="modalForm.roleName" placeholder="请输入角色名称" allow-clear>
          </a-input>
        </a-form-item>
        <a-form-item label="备注" v-bind="validateInfos.remark">
          <a-textarea v-model:value="modalForm.remark" placeholder="请输入备注" allow-clear>
          </a-textarea>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" :loading="modal.submitLoading" @click="handleSubmit">
            确定
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="permModal.visible"
      title="设置权限"
      :mask-closable="false"
      :footer="null"
      width="500px"
    >
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-item label="角色名称">
          {{ permModal.roleName }}
        </a-form-item>
        <a-form-item label="选择权限">
          <a-tree
            v-model:checkedKeys="permModal.checkedKeys"
            :tree-data="menuList"
            :replace-fields="{ title: 'menuName', key: '_id' }"
            default-expand-all
            checkable
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" :loading="permModal.submitLoading" @click="handlePermSubmit">
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
    key: 'roleName',
    dataIndex: 'roleName',
    title: '角色名称',
  },
  {
    key: 'remark',
    dataIndex: 'remark',
    title: '备注',
  },
  {
    key: 'permissions',
    dataIndex: 'permissions',
    title: '权限列表',
    width: 200,
    slots: { customRender: 'permissions' },
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
    width: 150,
    fixed: 'right',
    slots: { customRender: 'action' },
  },
]
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
    .getRoleList(queryForm.value)
    .then((res) => {
      table.list = res.data.data.list
      table.total = res.data.data.page.total
      table.loading = false
      table.error = false
    })
    .catch(() => {
      table.list = []
      table.total = 0
      table.loading = false
      table.error = true
    })
}

const menuList = ref<Recordable[]>([])
const fetchMenuList = async () => {
  const res = await api.getMenuList()
  menuList.value = res.data.data
  getActionMap(res.data.data)
}
const actionMap = ref<Recordable>({})
const getActionMap = (list: Recordable[]) => {
  const map: Record = {}
  const deep = (arr: Recordable[]) => {
    while (arr.length) {
      const item = arr.pop()
      if (item.children && item.action) {
        map[item._id] = item.menuName
      }
      if (item.children && !item.action) {
        deep(item.children)
      }
    }
  }
  deep(JSON.parse(JSON.stringify(list)))
  actionMap.value = map
}
const permissionsFilter = (keys: string[]) => {
  const permissions: string[] = []
  keys.forEach((key) => {
    const permission = actionMap.value[key] as string
    if (key && permission) {
      permissions.push(permission)
    }
  })
  return permissions
}

const modal = reactive({
  visible: false,
  action: 'add', // add | edit
  rules: {
    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  },
  submitLoading: false,
})
const modalForm = ref<Recordable>({
  roleName: '',
  remark: '',
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
  const res = await api.roleOperate({
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
      const params = {
        action: modal.action,
        ...modalForm.value,
      }
      await api.roleOperate(params)
      modal.submitLoading = false
      message.success('操作成功')
      handleClose()
      fetchTable()
    })
    .catch((err) => {
      console.log(err)
    })
}

const permModal = reactive({
  visible: false,
  submitLoading: false,
  _id: '',
  roleName: '',
  checkedKeys: [],
  // checkedKeys: {
  //   checked: [],
  //   halfChecked: [],
  // },
})
const handlePermOpen = (record: Recordable) => {
  permModal.visible = true
  permModal._id = record._id
  permModal.roleName = record.roleName
  permModal.checkedKeys = record.permissionList.checkedKeys
}
const handlePermSubmit = () => {
  // 最终目的 permissionList: { checkedKeys: 选中的按钮id数组, halfCheckedKeys: 选中的菜单id数组(包括半选中和全选中)}
  // 所有选中的id,不包括半选中的
  /**
   * menuList = [{
   *  menuName: '系统管理',
   *  _id,
   *  children: [{
   *    menuName: '菜单管理',
   *    _id,
   *    children: [{
   *      menuName: '编辑',
   *      _id
   *    },{
   *      menuName: '删除',
   *      _id
   *    }],
   *    action: [{
   *      menuName: '编辑',
   *      _id
   *    },{
   *      menuName: '删除',
   *      _id
   *    }],
   *  }]
   * }]
   * 以上面简单的菜单列表为例，一个 【系统管理】-【单管管理】的二级菜单，二级菜单下有两个按钮
   * 上面数据结构的特点是：1.菜单都有children,按钮没有children 2.二级菜单(最后一级菜单)除了有children还有action
   * 最终要提交给后台的数据结构是：
   * permissionList: [
   *   checkedKeys: [],
   *   halfCheckedKeys: []
   * ]
   * 其中，checkedKeys只包含选中的按钮，halfCheckedKeys包含选中的菜单和版选中的菜单
   * 举个例子：如果只勾了 编辑按钮，则
   * permissionList: [
   *   checkedKeys: ['编辑'],
   *   halfCheckedKeys: ['系统管理', '菜单管理']
   * ]
   * 如果只勾了 编辑按钮 和 删除按钮，则
   * permissionList: [
   *   checkedKeys: ['编辑', '删除'],
   *   halfCheckedKeys: ['系统管理', '菜单管理']
   * ]
   * 上面的文字转换成_id就好了
   */
  const checked = permModal.checkedKeys.slice()
  // 获取选中的按钮_id数组
  const getCheckedKeys = () => {
    const res: string[] = []
    const recurFn = (list: Recordable[]) => {
      list.forEach((item) => {
        if (item.children) {
          // 如果当前项有children，说明是菜单，继续递归调用函数
          recurFn(item.children)
        } else {
          // 如果当前项没有children，说明是按钮
          if (checked.includes(item._id)) {
            // 如果当前项 _id 包含在 cheked数组 中，则push这个 _id
            res.push(item._id)
          }
        }
      })
    }
    recurFn(menuList.value)
    return res
  }
  const checkedKeys = getCheckedKeys()
  console.log('checkedKeys', checkedKeys)
  // 获取选中的菜单_id数组(包括半选中的)
  const getHalfCheckedKeys = () => {
    const res: string[] = []
    // 判断当前项的children是否选中或半选中
    const isChildrenChecked = (list: Recordable[]) => {
      // 初始计数0，每发现一个则计数累加，如果最终计数大于0，则说明是true
      let count = 0
      const recurFn = (arr: Recordable[]) =>
        arr.forEach((v) => {
          if (checked.includes(v._id)) {
            // 如果当前项_id在 checked数组 中，则累加
            count++
          } else {
            if (v.children) {
              // 否则，如果当前项还有children，就递归调用
              recurFn(v.children)
            }
          }
        })
      recurFn(list)
      return count > 0
    }
    const recur = (list: Recordable[]) => {
      list.forEach((item) => {
        if (item.children) {
          // 如果当前项有chilren，说明是菜单，记录当前菜单_id
          const _id: string = item._id
          if (checked.includes(_id) || isChildrenChecked(item.children)) {
            // 如果当前项_id在 checked数组 中
            // 或者当前项的children的项的_id在checked数组中
            // 则push _id
            res.push(_id)
          }
          // 递归调用
          recur(item.children)
        }
      })
    }
    recur(menuList.value)
    return res
  }
  const halfCheckedKeys = getHalfCheckedKeys()
  console.log('halfCheckedKeys', halfCheckedKeys)
  const params = {
    _id: permModal._id,
    permissionList: {
      checkedKeys,
      halfCheckedKeys,
    },
  }
  permModal.submitLoading = true
  api
    .updatePermission(params)
    .then(() => {
      permModal.submitLoading = false
      permModal.visible = false
      message.success('操作成功')
      fetchTable()
    })
    .catch(() => {
      permModal.submitLoading = false
    })
}

fetchTable()
fetchMenuList()
</script>

<script lang="ts">
export default {
  name: 'Role',
}
</script>

<style lang="less" scoped></style>
