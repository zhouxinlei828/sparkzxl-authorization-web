<template>
  <el-dialog
    title="分配菜单资源"
    :visible.sync="dialogFormVisible"
    width="800px"
    @close="closeDialog"
  >
    <el-row :gutter="12">
      <el-col :span="10">
        <el-card style="overflow-y: auto; height: 450px" shadow="never">
          <div slot="header" class="clearfix">
            <span>菜单</span>
          </div>
          <el-form :inline="true" size="small">
            <el-form-item>
              <el-input v-model="filterText" placeholder="输入关键字进行过滤">
                >
              </el-input>
            </el-form-item>
          </el-form>
          <div style="overflow-y: auto; max-height: 290px">
            <el-tree
              ref="menu-tree"
              :data="menuData"
              node-key="id"
              :default-expand-all="true"
              :default-checked-keys="menuIds"
              :show-checkbox="true"
              :highlight-current="true"
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card style="overflow-y: auto; height: 450px" shadow="never">
          <div slot="header" class="clearfix">
            <span>资源</span>
          </div>
          <div style="overflow-y: auto; max-height: 340px">
            <a-table
              size="middle"
              :columns="resourceColumns"
              :row-key="(record) => record.id"
              :data-source="resourceData"
              :row-selection="rowSelection"
              :pagination="false"
              bordered
              @change="getMenuResourceList"
            ></a-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="button-item" @click="closeDialog">
        取 消
      </el-button>
      <el-button
        size="small"
        class="button-item"
        type="primary"
        @click="onSubmit"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
    getResourceList,
    getRoleResource,
    saveRoleAuthority,
  } from '@/api/role'
  import { getMenuTree } from '@/api/menu'

  export default {
    data() {
      return {
        dialogFormVisible: false,
        data: [],
        menuData: [],
        menuIds: [],
        resourceIds: [],
        createVisible: false,
        createData: null,
        filterText: '',
        resourceColumns: [
          {
            title: '编码',
            dataIndex: 'code',
            align: 'center',
          },
          {
            title: '名称',
            dataIndex: 'name',
            align: 'center',
          },
        ],
        selectedRowKeys: [],
        selectedRows: [],
        resourceData: [],
        menuId: null,
        roleId: null,
      }
    },
    computed: {
      rowSelection() {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
          onSelect: this.onSelect,
          onSelectAll: this.onSelectAll,
        }
      },
    },
    watch: {
      filterText(val) {
        this.$refs['menu-tree'].filter(val)
      },
    },
    created() {
      this.$watch('model', () => {
        this.roleId = this.model.id
        this.getRoleResource()
        this.getMenuTree()
      })
    },
    methods: {
      showDialog(data) {
        this.roleId = data.id
        this.getRoleResource()
        this.getMenuTree()
        this.dialogFormVisible = true
      },
      getRoleResource() {
        getRoleResource(this.roleId).then((response) => {
          const responseData = response.data
          this.menuIds = responseData.authMenus
          this.resourceIds = responseData.authResources
          this.selectedRowKeys = responseData.authResources
        })
      },
      getMenuTree() {
        getMenuTree().then((response) => {
          const responseData = response.data
          this.menuData = responseData
          if (this.menuData.length > 0) {
            this.menuId =
              this.menuId === null ? responseData[0].id : this.menuId
            this.setCurrentNodeKey(responseData[0].id)
          }
          this.getMenuResourceList()
        })
      },
      getMenuResourceList() {
        const params = {
          menuId: this.menuId,
        }
        getResourceList(params).then((response) => {
          this.resourceData = response.data
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
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      onSelect(record, selected, selectedRows, nativeEvent) {
        if (selected) {
          for (const selectedRow of selectedRows) {
            this.resourceIds.push(selectedRow.id)
          }
        } else {
          /* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
          Array.prototype.remove = function (val) {
            const index = this.indexOf(val)
            if (index > -1) {
              return this.splice(index, 1)
            }
          }
          this.resourceIds.remove(record.id)
        }
      },
      onSelectAll(selected, selectedRows, changeRows) {
        if (selected) {
          for (const selectedRow of selectedRows) {
            this.resourceIds.push(selectedRow.id)
          }
        } else {
          /* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
          Array.prototype.remove = function (val) {
            const index = this.indexOf(val)
            if (index > -1) {
              return this.splice(index, 1)
            }
          }
          for (const changeRow of changeRows) {
            this.resourceIds.remove(changeRow.id)
          }
        }
      },
      onSubmit() {
        const checkedNodes = this.$refs['menu-tree'].getCheckedKeys()
        const submitData = {
          roleId: this.roleId,
          menuIds: checkedNodes,
          resourceIds: this.resourceIds,
        }
        saveRoleAuthority(submitData).then((response) => {
          const responseData = response.data
          if (responseData) {
            this.$message.success('分配菜单资源成功')
            this.resetForm()
          } else {
            this.$message.error('分配菜单资源失败')
          }
        })
      },
      handleNodeClick(data) {
        this.menuId = data.id
        this.getMenuResourceList()
      },
      resetForm() {
        this.menuId = null
        this.roleId = null
        this.menuIds = []
        this.resourceIds = []
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      closeDialog() {
        this.menuId = null
        this.roleId = null
        this.menuIds = []
        this.resourceIds = []
        this.dialogFormVisible = false
      },
    },
  }
</script>
