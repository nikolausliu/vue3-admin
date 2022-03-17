<template>
  <div>
    <div class="query-form">
      <a-form layout="inline" :colon="false">
        <a-form-item label="审批状态">
          <a-select
            v-model:value="queryForm.applyState"
            placeholder="请选择审批状态"
            style="width: 200px"
          >
            <a-select-option value=""> 所有 </a-select-option>
            <a-select-option v-for="item in applyStateArr" :key="item.value" :value="item.value">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="fetchTable">查询</a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="base-table">
      <div class="action group-btn-wrap">
        <a-button type="primary" @click="handleCreate">申请休假</a-button>
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
          <template #startTime="{ record }">
            {{ formateDate(new Date(record.startTime), 'yyyy-MM-dd') }} ~
            {{ formateDate(new Date(record.endTime), 'yyyy-MM-dd') }}
          </template>
          <template #applyType="{ record }">
            {{ applyTypeArr.find((item) => item.value === record.applyType)?.name || '' }}
          </template>
          <template #applyState="{ record }">
            {{ applyStateArr.find((item) => item.value === record.applyState)?.name || '' }}
          </template>
          <template #action="{ record }">
            <span class="group-btn-wrap">
              <a-button type="primary" size="small" @click="handleDetail(record)">详情</a-button>
              <a-popconfirm title="确定要删除吗?" ok-text="是" cancel-text="否">
                <a-button size="small" danger>作废</a-button>
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
      title="申请休假"
      :mask-closable="false"
      :footer="null"
      width="500px"
      @cancel="handleClose"
    >
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-item label="休假类型" v-bind="validateInfos.applyType">
          <a-select v-model:value="modalForm.applyType" placeholder="请选择休假类型">
            <a-select-option v-for="item in applyTypeArr" :key="item.value" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="休假时间" v-bind="validateInfos.leaveTime">
          <range-picker
            v-model:start="modalForm.startTime"
            v-model:end="modalForm.endTime"
            :show-time="false"
            format="YYYY-MM-DD"
            @change="handleTimeChange"
          />
        </a-form-item>
        <a-form-item label="休假时长" v-bind="validateInfos.leaveTime">
          {{ modalForm.leaveTime }}
        </a-form-item>
        <a-form-item label="休假原因" v-bind="validateInfos.reasons">
          <a-textarea v-model:value="modalForm.reasons" placeholder="请输入休假原因" allow-clear />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" :loading="modal.submitLoading" @click="handleSubmit">
            确定
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="detail.visible"
      title="休假详情"
      :mask-closable="false"
      :footer="null"
      width="500px"
    >
      <a-steps
        :current="detail.data.applyState > 2 ? 2 : detail.data.applyState - 1"
        progress-dot
        style="margin-bottom: 20px"
      >
        <a-step title="待审批"></a-step>
        <a-step title="审批中"></a-step>
        <a-step title="审批通过/审批拒绝"></a-step>
      </a-steps>
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-item label="休假类型">{{ detail.data.applyTypeName }}</a-form-item>
        <a-form-item label="休假时间">{{ detail.data.timeRange }}</a-form-item>
        <a-form-item label="休假时长">{{ detail.data.leaveTime }}</a-form-item>
        <a-form-item label="休假原因">{{ detail.data.reasons }}</a-form-item>
        <a-form-item label="审批状态">{{ detail.data.applyStateName }}</a-form-item>
        <a-form-item label="审批人">{{ detail.data.auditUsers }}</a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Form, message } from 'ant-design-vue'
import api from '@/api'
import { formateDate } from '@/utils'

const columns = [
  {
    key: 'orderNo',
    dataIndex: 'orderNo',
    align: 'center',
    title: '单号',
  },
  {
    key: 'timeRange',
    dataIndex: 'timeRange',
    align: 'center',
    title: '休假时间',
  },
  {
    key: 'leaveTime',
    dataIndex: 'leaveTime',
    align: 'center',
    title: '休假时长',
  },
  {
    key: 'applyTypeName',
    dataIndex: 'applyTypeName',
    align: 'center',
    title: '休假类型',
  },
  {
    key: 'reasons',
    dataIndex: 'reasons',
    align: 'center',
    title: '休假原因',
  },
  {
    key: 'createTime',
    dataIndex: 'createTime',
    align: 'center',
    title: '申请时间',
    slots: { customRender: 'createTime' },
  },
  {
    key: 'auditUsers',
    dataIndex: 'auditUsers',
    align: 'center',
    title: '审批人',
  },
  {
    key: 'curAuditUserName',
    dataIndex: 'curAuditUserName',
    align: 'center',
    title: '当前审批人',
  },
  {
    key: 'applyStateName',
    dataIndex: 'applyStateName',
    align: 'center',
    title: '审批状态',
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

const applyTypeArr = reactive([
  { value: 1, name: '事假' },
  { value: 2, name: '调休' },
  { value: 3, name: '年假' },
])
const applyStateArr = reactive([
  { value: 1, name: '待审批' },
  { value: 2, name: '审批中' },
  { value: 3, name: '审批拒绝' },
  { value: 4, name: '审批通过' },
  { value: 5, name: '作废' },
])

const queryForm = ref({
  pageNum: 1,
  pageSize: 10,
  applyState: 1,
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
    .getApplyList(queryForm.value)
    .then((res) => {
      const list = (res.data.data.list as Recordable[]).map((item) => {
        item.applyTypeName = applyTypeArr.find((v) => v.value === item.applyType)?.name || ''
        item.applyStateName = applyStateArr.find((v) => v.value === item.applyState)?.name || ''
        item.timeRange =
          formateDate(new Date(item.startTime), 'yyyy-MM-dd') +
          ' ~ ' +
          formateDate(new Date(item.endTime), 'yyyy-MM-dd')
        return item
      })
      table.list = list
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

const modal = reactive({
  visible: false,
  action: 'create', // create | edit
  rules: {
    applyType: [{ required: true, message: '请选择休假类型' }],
    startTime: [{ required: true, message: '请选择休假时间' }],
    leaveTime: [{ required: true, message: '请选择休假时间' }],
    reasons: [{ required: true, message: '请输入休假原因' }],
  },
  submitLoading: false,
})
const modalForm = ref<Recordable>({
  applyType: 1,
  startTime: '',
  endTime: '',
  leaveTime: '0天',
  reasons: '',
})
const { resetFields, validate, validateInfos } = Form.useForm(modalForm, modal.rules)
const handleClose = () => {
  modal.visible = false
  resetFields()
}
const handleCreate = () => {
  modal.visible = true
  modal.action = 'create'
}
const handleDelete = async (record: Recordable) => {
  const res = await api.leaveOperate({
    action: 'delete',
    _id: record._id,
  })
  message.success('删除成功')
  fetchTable()
}
const handleTimeChange = (date: string[]) => {
  if (date.length) {
    modalForm.value.leaveTime =
      (new Date(date[1]).getTime() - new Date(date[0]).getTime()) / (24 * 60 * 60 * 1000) + 1 + '天'
  } else {
    modalForm.value.leaveTime = '0天'
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
      await api.leaveOperate(params)
      modal.submitLoading = false
      message.success('操作成功')
      handleClose()
      fetchTable()
    })
    .catch((err) => {
      console.log(err)
    })
}

const detail = reactive({
  visible: false,
  data: {} as Recordable,
})
const handleDetail = (record: Recordable) => {
  detail.visible = true
  detail.data = { ...record }
  // detail.data.applyTypeName =
  //   applyTypeArr.find((item) => item.value === detail.data.applyType)?.name || ''
  // detail.data.applyStateName =
  //   applyTypeArr.find((item) => item.value === detail.data.applyState)?.name || ''
  // detail.data.rangeTime =
  //   formateDate(new Date(record.startTime), 'yyyy-MM-dd') +
  //   ' ~ ' +
  //   formateDate(new Date(record.endTime), 'yyyy-MM-dd')
}

fetchTable()
</script>

<script lang="ts">
export default {
  name: 'Leave',
}
</script>

<style lang="less" scoped></style>
