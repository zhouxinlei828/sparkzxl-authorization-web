<template>
  <div class="filter-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.username"
              class="filter-item search-item"
              placeholder="账号"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model.trim="queryForm.name"
              class="filter-item search-item"
              placeholder="姓名"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <TreeSelect
              v-model="queryForm.orgId"
              class="filter-item search-item"
              :load-options="loadListOptions"
              :multiple="false"
              :searchable="true"
              placeholder="组织"
              :options="orgData"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>

    <el-divider content-position="left">结果列表</el-divider>
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" :model="queryForm">
          <el-form-item>
            <el-button icon="el-icon-plus" type="primary" @click="handleEdit">
              添加
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
    <el-table
      v-loading="listLoading"
      border
      height="510"
      :data="list"
      :element-loading-text="elementLoadingText"
      @selection-change="setSelectRows"
    >
      <el-table-column show-overflow-tooltip type="selection"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="account"
        label="账号"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="name"
        label="姓名"
      ></el-table-column>
      <el-table-column show-overflow-tooltip prop="sex" label="性别" width="60">
        <template #default="{ row }">
          <el-tag v-if="row.sex.code === 1">
            {{ row.sex.desc }}
          </el-tag>
          <el-tag v-if="row.sex.code !== 1" type="success">
            {{ row.sex.desc }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="positionStatus"
        label="职位状态"
      >
        <template #default="{ row }">
          <span v-if="row.positionStatus.data != null">
            {{ row.positionStatus.data }}
          </span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="station" label="岗位">
        <template #default="{ row }">
          <span v-if="row.station.data != null">
            {{ row.station.data.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="status"
        label="状态"
        width="80"
      >
        <template #default="{ row }">
          <el-tag v-if="row.status === true">启用</el-tag>
          <el-tag v-if="row.status !== true" type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="createTime"
        label="创建时间"
        width="160"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="100">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNum"
      :page-size="queryForm.pageSize"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <edit ref="edit" @fetch-data="fetchData"></edit>
  </div>
</template>

<script>
  import { getUserPage, doDelete } from '@/api/userManagement'
  import { getDictionaryItemList } from '@/api/dictionary'
  import Edit from './components/UserManagementEdit'
  import { getOrgList } from '@/api/org'
  import moment from 'moment'

  export default {
    name: 'UserManagement',
    components: { Edit },
    data() {
      return {
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNum: 1,
          pageSize: 10,
          username: '',
          name: '',
          orgId: null,
        },
        nationData: [],
        orgData: [],
      }
    },
    created() {
      this.fetchData()
      this.getNationList()
      this.getOrgList()
    },
    methods: {
      getNationList() {
        if (this.nationData.length === 0) {
          const data = {
            dictionaryType: 'NATION',
          }
          getDictionaryItemList(data).then((response) => {
            this.nationData = response.data
          })
        }
      },
      getOrgList() {
        if (this.orgData.length === 0) {
          const parameter = {
            name: '',
            status: true,
          }
          getOrgList(parameter).then((response) => {
            this.orgData = response.data
          })
        }
      },
      loadListOptions({ callback }) {
        callback()
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.id) {
          const updateData = {
            id: row.id,
            account: row.account,
            name: row.name,
            org: row.org === null ? '' : row.org.key,
            station: row.station === null ? '' : row.station.key,
            email: row.email,
            mobile: row.mobile,
            sex: row.sex === null ? '' : row.sex.code + '',
            nation: row.nation === null ? '' : row.nation.key,
            education: row.education === null ? '' : row.education.key,
            positionStatus:
              row.positionStatus === null ? '' : row.positionStatus.key,
            status: row.status === true ? '1' : '2',
            workDescribe: row.workDescribe,
            nationData: this.nationData,
            educationData: this.educationData,
            positionStatusData: this.positionStatusData,
            orgData: this.orgData,
          }
          this.$refs['edit'].showEdit(updateData)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success')
            await this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids })
              this.$baseMessage(msg, 'success')
              await this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNum = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        await getUserPage(this.queryForm).then((response) => {
          const result = response.data
          console.log(result)
          this.total = parseInt(result.total)
          this.list = result.list
          for (const model of this.list) {
            model.createTime = moment(model.createTime).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
        })
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
