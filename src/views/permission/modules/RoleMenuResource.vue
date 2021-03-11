<template>
  <el-dialog
    title="分配菜单资源"
    :visible.sync="dialogFormVisible"
    width="700px"
    @close="closeDialog"
  >
    <div class="filter-container" style="padding-bottom: 0">
      <el-table
        ref="menuTable"
        v-loading="menuLoading"
        :data="menuData"
        max-height="400"
        style="width: 100%"
        row-key="id"
        row-class-name="table-row"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        default-expand-all
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        highlight-current-row
        @select="handleSelection"
        @select-all="handleSelectionAll"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column
          prop="label"
          label="菜单标题"
          show-overflow-tooltip
          width="190"
        ></el-table-column>
        <el-table-column prop="resourceList" label="菜单资源">
          <template #default="{ row }">
            <div v-if="row.resourceList !== null">
              <el-checkbox-group v-model="resourceIdList">
                <el-checkbox
                  v-for="resource in row.resourceList"
                  :key="resource.id"
                  :label="resource.id"
                  :checked="
                    resource.checked === undefined || resource.checked === null
                      ? false
                      : resource.checked
                  "
                >
                  {{ resource.name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-else>暂无菜单资源</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" class="button-item" @click="closeDialog">
        取 消
      </el-button>
      <el-button size="small" class="button-item" type="primary">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getMenuTree, getMenuList } from '@/api/menu'
  import { getRoleResource } from '@/api/role'

  export default {
    data() {
      return {
        menuData: [],
        menuList: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        roleId: null,
        menuIds: [],
        dialogFormVisible: false,
        resourceModelList: [],
        checked: false,
        resourceIdList: [],
        menuLoading: false,
      }
    },
    created() {
      this.getMenuTree()
      this.getMenuList()
    },
    methods: {
      showDialog(data) {
        console.log(data)
        this.roleId = data.roleId
        this.getRoleResource(data.roleId)
        this.dialogFormVisible = true
      },
      getMenuTree() {
        this.menuLoading = true
        getMenuTree().then((response) => {
          this.menuData = response.data
          this.menuLoading = false
        })
      },
      getMenuList() {
        getMenuList({}).then((response) => {
          this.menuList = response.data
        })
      },
      closeDialog() {
        this.menuId = null
        this.roleId = null
        this.menuIds = []
        this.resourceIds = []
        this.dialogFormVisible = false
      },
      toggleSelection(rows, menuIds) {
        if (rows) {
          rows.forEach((row) => {
            for (const menuId of menuIds) {
              if (menuId === row.id) {
                this.$refs.menuTable.toggleRowSelection(row)
              }
            }
            if (row.children !== null) {
              this.toggleSelection(row.children, menuIds)
            }
          })
        }
      },
      toggleChecked(rows, resourceIds) {
        if (rows) {
          rows.forEach((row) => {
            if (row.resourceList !== null) {
              row.resourceList.forEach((resource) => {
                for (const resourceId of resourceIds) {
                  if (resourceId === resource.id) {
                    resource.checked = true
                  }
                }
              })
            }
            if (row.children !== null) {
              this.toggleChecked(row.children, resourceIds)
            }
          })
        }
      },
      toggleUnCheck(menuData, val) {
        if (val && val.resourceIdList !== null) {
          menuData.forEach((row) => {
            if (row.resourceList !== null) {
              if (row.id === val.id) {
                row.resourceList.forEach((resource) => {
                  resource.checked = false
                })
              }
            }
            if (row.children !== null) {
              this.toggleUnCheck(row.children, val)
            }
          })
        }
      },
      handleSelection(selection, val) {
        const menuIds = this.menuIds
        selection.forEach((row) => {
          if (row.id !== val.id) {
            this.toggleUnCheck(this.menuData, val)
            delete menuIds[val.id]
          } else if (row.id === val.id) {
            menuIds.push(val.id)
          }
        })
        console.log(this.menuData)
        this.menuIds = menuIds
      },
      handleSelectionAll(selection) {
        console.log(selection)
        if (selection.length === 0) {
          this.menuIds = []
        } else {
          for (const data of selection) {
            this.menuIds.push(data.id)
          }
        }
      },
      getRoleResource(roleId) {
        getRoleResource(roleId).then((response) => {
          const responseData = response.data
          this.menuIds = responseData.authMenus
          this.resourceIdList = responseData.authResources
          this.toggleSelection(this.menuData, this.menuIds)
          this.toggleChecked(this.menuData, this.resourceIdList)
        })
      },
      getSelectTableRow(menuIds) {
        const rows = []
        if (menuIds.length === 0) {
          return rows
        }
        let menuData = this.menuData
        for (const data of menuData) {
          for (const menuId of menuIds) {
            if (menuId === data.id) {
              rows.push(data)
            }
          }
        }
        return rows
      },
    },
  }
</script>
