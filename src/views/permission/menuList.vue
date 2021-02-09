<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card shadow="hover" style="overflow-y: auto; height: 550px">
          <div slot="header" class="clearfix">
            <span>菜单</span>
          </div>
          <el-form :inline="true" size="small">
            <el-form-item>
              <el-input
                v-model="filterText"
                prefix-icon="el-icon-search"
                placeholder="输入关键字进行过滤"
              >
                >
              </el-input>
            </el-form-item>
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
              <el-button
                size="small"
                style="margin-left: 8px"
                icon="el-icon-delete"
                type="danger"
                @click="handleDelete"
              >
                删除
              </el-button>
            </el-form-item>
          </el-form>
          <el-tree
            ref="menu-tree"
            v-loading="treeLoading"
            :data="menuData"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            node-key="id"
            style="overflow-y: auto; height: 340px"
            show-checkbox
            highlight-current
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card shadow="hover" style="overflow-y: auto; height: 550px">
          <div slot="header" class="clearfix">
            <span>{{ title }}</span>
          </div>
          <el-form
            ref="ruleForm"
            :model="form"
            :rules="rules"
            size="small"
            label-width="80px"
          >
            <el-form-item label="上级ID:" prop="parentId" required>
              <el-input v-model="form.parentId" />
            </el-form-item>
            <el-form-item label="名称:" prop="label" required>
              <el-input v-model="form.label" />
            </el-form-item>
            <el-form-item label="路由URI:" prop="abbreviation">
              <el-input v-model="form.path" />
            </el-form-item>
            <el-form-item label="组件:" prop="describe">
              <el-tooltip
                class="item"
                effect="dark"
                content="组件路径"
                placement="bottom"
              >
                <el-input v-model="form.component" />
              </el-tooltip>
            </el-form-item>
            <el-form-item label="状态:" prop="isEnable" required>
              <el-radio v-model="form.isEnable" label="1">启用</el-radio>
              <el-radio v-model="form.isEnable" label="2">禁用</el-radio>
            </el-form-item>
            <el-form-item label="排序值:" prop="sortValue">
              <el-input-number v-model="form.sortValue" :min="1" :max="100" />
            </el-form-item>
            <el-form-item label="描述:" prop="workDescribe">
              <el-input v-model="form.describe" type="textarea" />
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                style="margin-left: 12px"
                type="primary"
                @click="handleSave"
              >
                {{ buttonName }}
              </el-button>
              <el-button
                size="small"
                style="margin-left: 12px"
                @click="resetForm"
              >
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="9">
        <el-card shadow="hover" style="overflow-y: auto; height: 550px">
          <div slot="header" class="clearfix">
            <span>资源</span>
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
  </div>
</template>

<script>
  import {
    deleteMenu,
    deleteResource,
    getMenuResource,
    getMenuTree,
    saveMenu,
    updateMenu,
  } from '@/api/menu'
  import ResourceCreateForm from '@/views/permission/modules/ResourceCreateForm'
  export default {
    components: {
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
        treeLoading: false,
        filterText: '',
        title: '新增菜单',
        buttonName: '新增',
        parentId: 0,
        form: {
          id: null,
          parentId: 0,
          label: '',
          path: '',
          component: '',
          isEnable: '1',
          sortValue: 1,
          describe: '',
        },
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
    watch: {
      filterText(val) {
        this.$refs['menu-tree'].filter(val)
      },
    },
    mounted() {
      this.getMenuTree()
      this.getMenuResource()
    },
    methods: {
      getMenuTree() {
        this.treeLoading = true
        getMenuTree().then((response) => {
          const responseData = response.data
          this.menuData = responseData
          if (this.menuData.length > 0) {
            this.menuId = this.menuId === 0 ? responseData[0].id : this.menuId
            this.setCurrentNodeKey(responseData[0].id)
          }
          this.getMenuResource()
          this.treeLoading = false
        })
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
        this.title = '新增菜单'
        this.buttonName = '新增'
        this.form = {
          id: null,
          parentId: this.parentId,
          label: '',
          path: '',
          component: '',
          isEnable: '1',
          sortValue: 1,
          describe: '',
        }
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
      handleSave() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            const submitData = this.form
            submitData.isEnable = this.form.isEnable === '1'
            if (submitData.id != null) {
              updateMenu(submitData).then((response) => {
                const responseData = response.data
                if (responseData) {
                  this.$message.success('修改菜单成功')
                  this.getMenuTree()
                } else {
                  this.$message.error('修改菜单失败')
                }
              })
            } else {
              saveMenu(submitData).then((response) => {
                const responseData = response.data
                if (responseData) {
                  this.$message.success('新增菜单成功')
                  this.getMenuTree()
                } else {
                  this.$message.error('新增菜单失败')
                }
              })
            }
          } else {
            return false
          }
        })
      },
      handleDelete() {
        const checkedKeys = this.$refs['menu-tree'].getCheckedKeys()
        const data = {
          ids: checkedKeys,
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
      setCurrentNodeKey(key) {
        this.$nextTick(function () {
          this.$refs['menu-tree'].setCurrentKey(key)
        })
      },
      handleNodeClick(data) {
        this.title = '修改菜单'
        this.buttonName = '修改'
        this.parentId = data.id
        this.menuId = data.id
        this.form = {
          id: data.id,
          parentId: data.parentId,
          label: data.label,
          path: data.path,
          component: data.component,
          isEnable: data.isEnable === true ? '1' : '2',
          sortValue: data.sortValue,
          describe: data.describe,
        }
        this.getMenuResource()
      },
      resetForm() {
        this.$refs['ruleForm'].resetFields()
        this.title = '新增'
        this.buttonName = '新增'
      },
    },
  }
</script>
