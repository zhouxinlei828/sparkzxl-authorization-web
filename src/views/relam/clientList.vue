<template>
  <div class="filter-container" style="padding-bottom: 0">
    <el-input
      v-model="queryParam.clientId"
      size="small"
      class="filter-item search-item"
      placeholder="客户端id"
    />
    <el-button
      size="small"
      class="filter-item button-item"
      icon="search"
      type="primary"
      @click="getClientPageList"
    >
      查询
    </el-button>
    <el-button
      size="small"
      class="filter-item button-item"
      @click="
        () =>
          (this.queryParam = {
            pageNum: 1,
            pageSize: 10,
            clientId: null,
          })
      "
    >
      重置
    </el-button>
    <el-divider content-position="left">结果列表</el-divider>
    <div class="table-operator">
      <el-button size="small" type="primary" @click="handleAdd">新建</el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="stationData"
      border
      style="width: 100%"
      max-height="450"
    >
      <el-table-column
        prop="tenantName"
        label="租户"
        width="100"
      ></el-table-column>
      <el-table-column prop="clientId" label="客户端id"></el-table-column>
      <el-table-column
        prop="originalClientSecret"
        label="客户端密钥"
      ></el-table-column>
      <el-table-column prop="autoApprove" label="自动放行" width="80">
        <template #default="{ row }">
          <el-tag
            :type="row.autoApprove === 'true' ? 'primary' : 'success'"
            disable-transitions
          >
            {{ row.autoApprove === 'true' ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="authorizedGrantTypes"
        label="授权模式"
        width="160"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="scope"
        label="授权范围"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="accessTokenValidity"
        label="令牌时效/秒"
      ></el-table-column>
      <el-table-column
        prop="refreshTokenValidity"
        label="刷新时效/秒"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-link type="primary">
            <IconFont type="icon-edit" @click="handleEdit(row)" />
          </el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link type="primary">
            <IconFont
              type="icon-template_delete"
              @click="handleDelete(row.id)"
            />
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
    <tenant-edit-form ref="editForm" @fetch-data="getClientPageList" />
  </div>
</template>

<script>
  import moment from 'moment'
  import TenantEditForm from './modules/TenantEditForm'
  import { getClientPageList, deleteTenant } from '@/api/client'

  export default {
    components: {
      TenantEditForm,
    },
    data() {
      return {
        showPagination: true,
        advanced: false,
        total: 0,
        // 查询参数
        queryParam: {
          pageNum: 1,
          pageSize: 10,
          clientId: null,
        },
        layout: 'total, sizes, prev, pager, next, jumper',
        orgData: [],
        stationData: [],
        tableLoading: false,
        selectedRowKeys: [],
        selectedRows: [],
      }
    },
    computed: {
      rowSelection() {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
        }
      },
    },
    mounted() {
      this.getClientPageList()
    },
    methods: {
      handleSizeChange(val) {
        this.queryParam.pageSize = val
        this.getClientPageList()
      },
      handleCurrentChange(val) {
        this.queryParam.pageNum = val
        this.getClientPageList()
      },
      async getClientPageList() {
        this.tableLoading = true
        getClientPageList(this.queryParam).then((response) => {
          const result = response.data
          this.total = parseInt(result.total)
          this.stationData = result.list
          for (const station of this.stationData) {
            station.createTime = moment(station.createTime).format(
              'YYYY-MM-DD HH:mm:ss'
            )
            if (station.expirationTime !== null) {
              station.expirationTime = moment(station.expirationTime).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            }
          }
          this.tableLoading = false
        })
      },
      loadListOptions({ callback }) {
        callback()
      },
      handleAdd() {
        const createData = {
          id: null,
          name: null,
          logo: null,
          expirationTime: null,
          passwordExpire: 7200,
          passwordErrorNum: 5,
          passwordErrorLockTime: 30,
          status: '1',
          describe: null,
        }
        this.$refs['editForm'].showDialog(createData)
      },
      handleEdit(record) {
        const data = {
          id: record.id,
          name: record.name,
          logo: record.logo,
          expirationTime: record.expirationTime,
          passwordExpire: record.passwordExpire,
          passwordErrorNum: record.passwordErrorNum,
          passwordErrorLockTime: record.passwordErrorLockTime,
          status: record.status === true ? '1' : '2',
          describe: record.describe,
        }
        this.$refs['editForm'].showDialog(data)
      },
      buildTreeData(data) {
        const jsonArray = []
        for (const datum of data) {
          const children = datum.children
          let treeNode = null
          if (children !== null && children.length > 0) {
            treeNode = this.buildTreeData(children)
          }
          const jsonData = {
            value: datum.id,
            label: datum.label,
            children: treeNode,
          }
          jsonArray.push(jsonData)
        }
        return jsonArray
      },
      handleDelete(id) {
        deleteTenant({ ids: [id] }).then((response) => {
          const responseData = response.data
          if (responseData) {
            this.$message.success('删除租户成功')
            this.getClientPageList()
          } else {
            this.$message.error('删除租户失败')
          }
        })
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      resetSearchForm() {
        this.queryParam = {
          date: moment(new Date()),
        }
      },
    },
  }
</script>
