<template>
  <el-dialog
    title="查看流程任务历史"
    :visible.sync="dialogFormVisible"
    width="950px"
    @close="closeDialog"
  >
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="taskName" label="任务名称"></el-table-column>
      <el-table-column prop="startTime" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" label="处理时间"></el-table-column>
      <el-table-column
        prop="durationTime"
        label="耗时"
        width="80"
      ></el-table-column>
      <el-table-column prop="candidate" label="候选人"></el-table-column>
      <el-table-column prop="assignee" label="处理人"></el-table-column>
      <el-table-column prop="dueDate" label="到期时间"></el-table-column>
      <el-table-column prop="taskStatus" label="任务状态">
        <template #default="{ row }">
          <el-tag
            :type="row.taskStatus === '待处理' ? 'success' : 'primary'"
            disable-transitions
          >
            {{ row.taskStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="备注/意见"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button
        size="small"
        class="button-item"
        type="primary"
        @click="closeDialog"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<style>
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
<script>
  import { processHistoryByProcessInstanceId } from '@/api/instance'
  import moment from 'moment'

  export default {
    data() {
      return {
        dialogFormVisible: false,
        ruleColumns: [
          {
            title: '任务名称',
            dataIndex: 'taskName',
          },
          {
            title: '开始时间',
            dataIndex: 'startTime',
            align: 'center',
          },
          {
            title: '处理时间',
            dataIndex: 'endTime',
            align: 'center',
          },
          {
            title: '耗时',
            dataIndex: 'durationTime',
            align: 'center',
          },
          {
            title: '候选人',
            dataIndex: 'candidate',
            align: 'center',
          },
          {
            title: '处理人',
            dataIndex: 'assignee',
            align: 'center',
          },
          {
            title: '到期时间',
            dataIndex: 'dueDate',
          },
          {
            title: '任务处理状态',
            dataIndex: 'taskStatus',
            align: 'center',
          },
          {
            title: '备注/意见',
            dataIndex: 'comment',
          },
        ],
        tableData: [],
      }
    },
    methods: {
      showDialog(data) {
        this.dialogFormVisible = true
        this.loadData(data)
      },
      tableRowClassName({ row, rowIndex }) {
        if (rowIndex === this.tableData.length - 1) {
          return 'success-row'
        }
        return ''
      },
      loadData(processInstanceId) {
        return processHistoryByProcessInstanceId({
          processInstanceId: processInstanceId,
        }).then((response) => {
          this.tableData = response.data
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].number = i
            if (this.tableData[i].startTime !== null) {
              this.tableData[i].startTime = moment(
                this.tableData[i].startTime
              ).format('YYYY-MM-DD HH:mm:ss')
            }
            if (this.tableData[i].endTime !== null) {
              this.tableData[i].endTime = moment(
                this.tableData[i].endTime
              ).format('YYYY-MM-DD HH:mm:ss')
            }
            if (this.tableData[i].dueDate !== null) {
              this.tableData[i].dueDate = moment(
                this.tableData[i].dueDate
              ).format('YYYY-MM-DD HH:mm:ss')
            }
          }
        })
      },
      closeDialog() {
        this.tableData = []
        this.dialogFormVisible = false
      },
    },
  }
</script>
