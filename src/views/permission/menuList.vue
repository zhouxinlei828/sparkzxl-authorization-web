<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="12">
        <el-card shadow="hover" style="overflow-y: auto; height: 550px">
          <div slot="header" class="clearfix">
            <span>菜单</span>
            <el-tag
              v-show="activeTitle !== ''"
              size="mini"
              type="danger"
              style="float: right"
              effect="plain"
            >
              {{ activeTitle }}
            </el-tag>
          </div>
          <el-form :inline="true" size="small">
            <el-form-item>
              <el-input
                v-model="filterText"
                prefix-icon="el-icon-search"
                placeholder="输入关键字"
              >
                >
              </el-input>
            </el-form-item>
            <el-button
              size="small"
              style="margin-left: 8px"
              type="primary"
              @click="getMenuTree"
            >
              搜索
            </el-button>
            <el-form-item>
              <el-button
                size="small"
                style="margin-left: 8px"
                type="primary"
                @click="handleAdd"
              >
                添加
              </el-button>
              <el-button
                size="small"
                style="margin-left: 8px"
                @click="() => (this.filterText = '')"
              >
                重置
              </el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="menuTable"
            v-loading="menuLoading"
            :data="menuData"
            style="width: 100%"
            row-key="id"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            border
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            highlight-current-row
            @current-change="handleCurrentTableChange"
          >
            <el-table-column
              prop="label"
              label="菜单标题"
              width="180"
            ></el-table-column>
            <el-table-column prop="icon" label="图标" align="center" width="80">
              <template #default="{ row }">
                <div v-if="row.icon !== null && row.icon !== ''">
                  <IconFont :type="row.icon" />
                </div>
                <div v-if="row.icon !== null && row.icon !== ''">
                  <i :class="row.icon" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="sortValue" label="排序" />
            <el-table-column label="操作" align="center" width="130">
              <template #default="{ row }">
                <el-link type="primary">
                  <IconFont type="icon-edit" @click="handleEditMenu(row)" />
                </el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link type="primary">
                  <IconFont
                    type="icon-template_delete"
                    @click="handleDeleteMenu(row.id)"
                  />
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" style="overflow-y: auto; height: 550px">
          <div slot="header" class="clearfix">
            <span>{{ resourceTitle === '' ? '资源' : resourceTitle }}</span>
          </div>
          <el-form :inline="true" size="small">
            <el-form-item>
              <el-input
                v-model="queryForm.code"
                prefix-icon="el-icon-search"
                placeholder="编码"
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="queryForm.name"
                prefix-icon="el-icon-search"
                placeholder="名称"
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                icon="search"
                style="margin-left: 12px"
                type="primary"
                @click="handleSearchResource"
              >
                搜索
              </el-button>
              <el-button
                size="small"
                style="margin-left: 12px"
                type="primary"
                @click="handleAddResource"
              >
                添加
              </el-button>
            </el-form-item>
          </el-form>
          <el-table
            v-loading="tableLoading"
            :data="resourceData"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            border
            style="width: 100%"
            max-height="300"
          >
            <el-table-column
              prop="code"
              width="140"
              label="编码"
            ></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="{ row }">
                <el-link type="primary">
                  <IconFont type="icon-edit" @click="handleEditResource(row)" />
                </el-link>
                <el-divider direction="vertical"></el-divider>
                <el-link type="primary">
                  <IconFont
                    type="icon-template_delete"
                    @click="handleDeleteResource(row.id)"
                  />
                </el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :current-page="queryForm.pageNum"
            :page-size="queryForm.pageSize"
            :layout="layout"
            :total="total"
            :page-sizes="[5, 10, 20, 30]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-card>
      </el-col>
    </el-row>
    <resource-create-form ref="createForm" @fetch-data="getMenuResource" />
    <menu-edit-form ref="createMenuForm" @fetch-data="getMenuTree" />
  </div>
</template>

<script>
  import {
    deleteMenu,
    deleteResource,
    getMenuResource,
    getMenuTree,
  } from '@/api/menu'
  import MenuEditForm from '@/views/permission/modules/MenuEditForm'
  import ResourceCreateForm from '@/views/permission/modules/ResourceCreateForm'
  export default {
    components: {
      MenuEditForm,
      ResourceCreateForm,
    },
    data() {
      return {
        menuData: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        tableLoading: false,
        menuLoading: false,
        filterText: '',
        resourceTitle: '',
        activeTitle: '',
        currentRow: null,
        parentId: 0,
        queryForm: {
          pageNum: 1,
          pageSize: 10,
          code: '',
          name: '',
        },
        menuId: 0,
        selectedRows: [],
        resourceData: [],
        layout: 'total, sizes, prev, pager, next',
        total: 0,
        rules: {
          parentId: [
            { required: true, message: '上级ID不能为空', trigger: 'blur' },
          ],
          label: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' },
          ],
          isEnable: [
            { required: true, message: '状态不能为空', trigger: 'blur' },
          ],
        },
      }
    },
    created() {
      this.getMenuTree()
    },
    methods: {
      getMenuTree() {
        this.initAccessData()
        this.menuLoading = true
        getMenuTree({ label: this.filterText }).then((response) => {
          const responseData = response.data
          this.menuData = responseData
          if (this.menuData.length > 0) {
            this.menuId = this.menuId === 0 ? responseData[0].id : this.menuId
            this.currentRow = this.menuData[0]
            this.resourceTitle = '资源（'
              .concat(this.currentRow.label)
              .concat('）')
            this.activeTitle = this.currentRow.label
            this.$refs.menuTable.setCurrentRow(this.currentRow)
          }
          this.menuLoading = false
        })
      },
      initAccessData() {
        this.resourceTitle = ''
        this.activeTitle = ''
        this.menuId = 0
        this.parentId = 0
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.getMenuResource()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNum = val
        this.getMenuResource()
      },
      getMenuResource() {
        this.tableLoading = true
        const params = {
          pageNum: this.queryForm.current,
          pageSize: this.queryForm.pageSize,
          sort: 'id',
          model: {
            menuId: this.menuId,
            code: this.queryForm.code,
            name: this.queryForm.name,
          },
        }
        getMenuResource(params).then((response) => {
          const responseData = response.data
          this.total = parseInt(responseData.total)
          this.resourceData = responseData.list
          this.tableLoading = false
        })
      },
      handleAdd() {
        const data = {
          id: null,
          parentId: 0,
          hidden: 1,
          noKeepAlive: 1,
          redirect: null,
          label: null,
          path: null,
          component: null,
          componentName: null,
          isEnable: '1',
          sortValue: 1,
          describe: null,
          menuTree: this.menuData,
        }
        this.$refs['createMenuForm'].showDialog(data)
      },
      handleEditMenu(row) {
        const data = {
          id: row.id,
          parentId: row.parentId,
          hidden: row.hidden === true ? 0 : 1,
          noKeepAlive: row.noKeepAlive === true ? 0 : 1,
          redirect: row.redirect,
          label: row.label,
          path: row.path,
          component: row.component,
          componentName: row.componentName,
          isEnable: row.isEnable === true ? '1' : '2',
          sortValue: row.sortValue,
          describe: row.describe,
          menuTree: this.menuData,
        }
        this.$refs['createMenuForm'].showDialog(data)
      },
      handleAddResource() {
        const data = {
          menuId: this.menuId,
          code: null,
          name: null,
          requestUrl: null,
          describe: null,
        }
        this.$refs['createForm'].showDialog(data)
      },
      handleSearchResource() {
        const params = {
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
          sort: 'id',
          model: {
            menuId: this.menuId,
            code: this.queryForm.code,
            name: this.queryForm.name,
          },
        }
        getMenuResource(params).then((response) => {
          const responseData = response.data
          const pagination = { ...this.pagination }
          pagination.total = parseInt(responseData.total)
          this.resourceData = responseData.list
          this.pagination = pagination
        })
      },
      handleDeleteResource(id) {
        deleteResource({ id: id }).then((response) => {
          const responseData = response.data
          if (responseData) {
            this.$message.success('删除菜单资源成功')
            this.getMenuResource()
          } else {
            this.$message.error('删除菜单资源失败')
          }
        })
      },
      handleEditResource(record) {
        const data = {
          id: record.id,
          menuId: record.menuId,
          code: record.code,
          name: record.name,
          requestUrl: record.requestUrl,
          describe: record.describe,
        }
        this.$refs['createForm'].showDialog(data)
      },
      handleDeleteMenu(id) {
        const data = {
          ids: [id],
        }
        deleteMenu(data).then((response) => {
          const responseData = response.data
          if (responseData) {
            this.$message.success('删除菜单成功')
            this.getMenuTree()
          } else {
            this.$message.error('删除菜单失败')
          }
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      handleCurrentTableChange(data) {
        this.currentRow = data
        this.menuId = data.id
        this.parentId = data.id
        this.resourceTitle = '资源（'.concat(data.label).concat('）')
        this.activeTitle = data.label
        this.queryForm = {
          pageNum: 1,
          pageSize: 10,
          code: '',
          name: '',
        }
        this.getMenuResource()
      },
    },
  }
</script>
