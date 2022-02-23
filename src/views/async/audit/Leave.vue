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
        <a-button type="primary">申请休假</a-button>
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
              <a-button type="primary" size="small">查看</a-button>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Form, message } from 'ant-design-vue'
import { ColumnProps } from 'ant-design-vue/es/table/interface'
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
    key: 'startTime',
    dataIndex: 'startTime',
    align: 'center',
    title: '休假时间',
    slots: { customRender: 'startTime' },
  },
  {
    key: 'leaveTime',
    dataIndex: 'leaveTime',
    align: 'center',
    title: '休假时长',
  },
  {
    key: 'applyType',
    dataIndex: 'applyType',
    align: 'center',
    title: '休假类型',
    slots: { customRender: 'applyType' },
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
    key: 'applyState',
    dataIndex: 'applyState',
    align: 'center',
    title: '审批状态',
    slots: { customRender: 'applyState' },
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
      table.list = res.data.data.list
      table.total = res.data.data.page.total
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

fetchTable()
</script>

<script lang="ts">
export default {
  name: 'Leave',
}
</script>

<style lang="less" scoped></style>
