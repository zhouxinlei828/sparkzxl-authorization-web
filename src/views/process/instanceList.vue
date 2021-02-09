<template>
  <el-card>
    <div class="filter-container" style="padding-bottom: 0">
      <el-form :inline="true" :model="queryParam" size="small">
        <el-form-item label="流程名称:">
          <el-input
            v-model="queryParam.name"
            placeholder="请输入流程流程名称"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            style="margin-left: 12px"
            icon="search"
            type="primary"
            @click="getProcessInstanceList"
          >
            查询
          </el-button>
          <el-button
            style="margin-left: 12px"
            @click="
              () =>
                (this.queryParam = {
                  pageNum: 1,
                  pageSize: 10,
                  name: '',
                })
            "
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <el-divider content-position="left">结果列表</el-divider>
      <el-table
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="modelData"
        border
        style="width: 100%"
        max-height="450"
      >
        <el-table-column
          prop="processInstanceId"
          label="流程实例id"
        ></el-table-column>
        <el-table-column prop="businessKey" label="业务主键"></el-table-column>
        <el-table-column prop="processName" label="流程名称"></el-table-column>
        <el-table-column prop="processKey" label="流程key"></el-table-column>
        <el-table-column prop="status" label="流程状态"></el-table-column>
        <el-table-column prop="suspensionState" label="是否挂起">
          <template #default="{ row }">
            <el-tag
              :type="row.suspensionState.id === 2 ? 'danger' : 'primary'"
              disable-transitions
            >
              {{ row.suspensionState.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="创建时间"></el-table-column>
        <el-table-column prop="originator" label="发起人"></el-table-column>
        <el-table-column prop="finishTime" label="完成时间"></el-table-column>
        <el-table-column prop="dueTime" label="耗时"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="{ row }">
            <el-link type="primary">
              <el-button
                type="text"
                @click="getProcessHistory(row.processInstanceId)"
              >
                查看
              </el-button>
            </el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link type="primary">
              <el-button
                type="text"
                @click="handlerDeleteProcess(row.processInstanceId)"
              >
                删除
              </el-button>
            </el-link>
            <el-divider direction="vertical"></el-divider>
            <span
              v-show="row.status !== '结束' && row.suspensionState.id !== 2"
            >
              <el-link type="primary">
                <el-button
                  type="text"
                  @click="handlerSuspendProcess(row.processInstanceId)"
                >
                  挂起
                </el-button>
              </el-link>
              <el-divider direction="vertical" />
            </span>
            <el-link type="primary">
              <el-button
                type="text"
                @click="handleShowFlowChart(row.processInstanceId)"
              >
                流程图
              </el-button>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="queryParam.pageNum"
        :page-size="queryParam.pageSize"
        :layout="layout"
        :total="total"
        :page-sizes="[5, 10, 20, 30]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <view-flow-chart-form ref="flowChartForm" />
      <process-history-form ref="processHistoryForm" />
    </div>
  </el-card>
</template>

<script>
  import moment from 'moment'
  import {
    getProcessInstanceList,
    deleteProcessInstance,
    suspendProcess,
    showFlowChart,
  } from '@/api/instance'

  import ViewFlowChartForm from './modules/ViewFlowChartForm'
  import ProcessHistoryForm from './modules/ProcessHistoryForm'

  export default {
    components: {
      ViewFlowChartForm,
      ProcessHistoryForm,
    },
    data() {
      return {
        // 查询参数
        queryParam: {
          pageNum: 1,
          pageSize: 10,
          name: '',
        },
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        modelData: [],
        tableLoading: false,
      }
    },
    created() {
      this.getProcessInstanceList()
    },
    methods: {
      handleSizeChange(val) {
        this.queryParam.pageSize = val
        this.getProcessInstanceList()
      },
      handleCurrentChange(val) {
        this.queryParam.pageNum = val
        this.getProcessInstanceList()
      },
      getProcessInstanceList() {
        this.tableLoading = true
        getProcessInstanceList(this.queryParam).then((response) => {
          const responseData = response.data
          this.total = parseInt(responseData.total)
          const suspensionStateStop = {
            id: 2,
            name: '终止',
          }
          const suspensionState = {
            id: 1,
            name: '正常',
          }
          for (const data of responseData.list) {
            data.suspensionState =
              data.suspensionState === 1 ? suspensionState : suspensionStateStop
            if (data.startTime !== null) {
              data.startTime = moment(data.startTime).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            }
            if (data.finishTime !== null) {
              data.finishTime = moment(data.finishTime).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            }
          }
          this.modelData = responseData.list
          this.tableLoading = false
        })
      },
      handleShowFlowChart(processInstanceId) {
        const requestData = {
          processInstanceId: processInstanceId,
        }
        showFlowChart(requestData).then((response) => {
          this.$refs['flowChartForm'].showDialog(response.data)
        })
      },
      handlerSuspendProcess(processInstanceId) {
        suspendProcess({ processInstanceId: processInstanceId }).then(
          (response) => {
            const responseData = response.data
            if (responseData) {
              this.$message.success('挂起流程实例成功')
              this.getProcessInstanceList()
            } else {
              this.$message.error('挂起流程实例失败')
            }
          }
        )
      },
      handlerDeleteProcess(processInstanceId) {
        const requestData = {
          processInstanceId: processInstanceId,
          deleteReason: '删除流程',
        }
        deleteProcessInstance(requestData).then((response) => {
          const responseData = response.data
          if (responseData) {
            this.$message.success('删除流程实例成功')
            this.getProcessInstanceList()
          } else {
            this.$message.error('删除流程实例失败')
          }
        })
      },
      getProcessHistory(processInstanceId) {
        this.$refs['processHistoryForm'].showDialog(processInstanceId)
      },
    },
  }
</script>
