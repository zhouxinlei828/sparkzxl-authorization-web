<template>
  <el-dialog
    title="分配菜单资源"
    :visible.sync="dialogFormVisible"
    width="800px"
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
              <el-checkbox
                v-for="resource in row.resourceList"
                :key="resource.id"
                v-model="resource.checked"
              >
                {{ resource.name }}
              </el-checkbox>
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
  import { getMenuTree } from '@/api/menu'
  import { getRoleResource } from '@/api/role'

  export default {
    data() {
      return {
        menuData: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        roleId: null,
        menuIds: [],
        dialogFormVisible: false,
        resourceIdList: [],
        menuLoading: false,
      }
    },
    methods: {
      showDialog(data) {
        console.log(data)
        this.roleId = data.roleId
        this.getMenuTree()
        this.dialogFormVisible = true
      },
      getMenuTree() {
        this.menuLoading = true
        getMenuTree().then((response) => {
          this.initResourceChecked(response.data)
          this.menuData = response.data
          this.menuLoading = false
          this.getRoleResource(this.roleId)
        })
      },
      initResourceChecked(menuData) {
        menuData.forEach((row) => {
          if (row.resourceList !== null) {
            row.resourceList.forEach((resource) => {
              resource.checked = false
            })
          }
          if (row.children !== null) {
            this.initResourceChecked(row.children)
          }
        })
      },
      closeDialog() {
        this.roleId = null
        this.menuIds = []
        this.resourceIdList = []
        this.dialogFormVisible = false
      },
      toggleSelection(rows, menuIds) {
        if (rows) {
          rows.forEach((row) => {
            for (const menuId of menuIds) {
              if (menuId === row.id) {
                this.$refs.menuTable.toggleRowSelection(row, true)
              }
            }
            if (row.children !== null) {
              this.toggleSelection(row.children, menuIds)
            }
          })
        }
      },
      toggleUnSelection(rows, menuIds) {
        if (rows) {
          rows.forEach((row) => {
            this.$refs.menuTable.toggleRowSelection(row, false)
            Array.prototype.remove = function (val) {
              const index = this.indexOf(val)
              if (index > -1) {
                return this.splice(index, 1)
              }
            }
            menuIds.remove(row.id)
            if (row.children !== null) {
              this.toggleUnSelection(row.children, menuIds)
            }
          })
        }
      },
      toggleUnAllSelection(rows) {
        if (rows) {
          rows.forEach((row) => {
            this.$refs.menuTable.toggleRowSelection(row, false)
            if (row.resourceList !== null) {
              row.resourceList.forEach((resource) => {
                resource.checked = false
              })
            }
            if (row.children !== null) {
              this.toggleUnAllSelection(row.children)
            }
          })
        }
      },
      toggleAllSelection(rows) {
        if (rows) {
          rows.forEach((row) => {
            this.$refs.menuTable.toggleRowSelection(row, true)
            this.menuIds.push(row.id)
            if (row.resourceList !== null) {
              row.resourceList.forEach((resource) => {
                resource.checked = true
                this.resourceIdList.push(resource.id)
              })
            }
            if (row.children !== null) {
              this.toggleAllSelection(row.children)
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
        if (val) {
          menuData.forEach((row) => {
            if (row.resourceList !== null) {
              row.resourceList.forEach((resource) => {
                resource.checked = false
                Array.prototype.remove = function (val) {
                  const index = this.indexOf(val)
                  if (index > -1) {
                    return this.splice(index, 1)
                  }
                }
                this.resourceIdList.remove(resource.id)
              })
              if (row.children !== null) {
                this.toggleUnCheck(row.children, val)
              }
            } else {
              if (row.children !== null) {
                this.toggleUnCheck(row.children, val)
              }
            }
          })
        }
      },
      handleSelection(selection, val) {
        const menuIds = this.menuIds
        let toggleSelection = false
        if (selection.length === 0) {
          this.toggleUnCheck([val], val)
          this.toggleUnSelection([val], menuIds)
        }
        for (let i = 0; i < selection.length; i++) {
          if (selection[i].id !== val.id && i === selection.length - 1) {
            this.toggleUnCheck([val], val)
            this.toggleUnSelection([val], menuIds)
          } else if (selection[i].id === val.id) {
            toggleSelection = true
            menuIds.push(val.id)
            let resourceList = val.resourceList === null ? [] : val.resourceList
            if (val.children != null) {
              val.children.forEach((menu) => {
                menuIds.push(menu.id)
                if (menu.resourceList != null) {
                  menu.resourceList.forEach((resource) => {
                    resourceList.push(resource)
                  })
                }
              })
            }
            if (resourceList != null) {
              const resourceIdList = []
              resourceList.forEach((resource) => {
                resourceIdList.push(resource.id)
                this.resourceIdList.push(resource.id)
              })
              this.unique(resourceIdList)
              this.unique(this.resourceIdList)
              this.toggleChecked([val], resourceIdList)
            }
          }
        }
        this.unique(menuIds)
        this.menuIds = menuIds
        if (toggleSelection) {
          this.toggleSelection([val], this.menuIds)
        }
        console.log(this.menuIds)
        console.log(this.resourceIdList)
      },
      handleSelectionAll(selection) {
        this.resourceIdList = []
        if (selection.length !== this.menuData.length) {
          this.menuIds = []
          this.toggleUnAllSelection(this.menuData)
        } else {
          this.toggleAllSelection(this.menuData)
        }
        console.log(this.resourceIdList)
        console.log(this.menuIds)
      },
      getRoleResource(roleId) {
        getRoleResource(roleId).then((response) => {
          const responseData = response.data
          this.menuIds = responseData.authMenus
          this.resourceIdList = responseData.authResources
          if (this.menuIds !== null) {
            this.toggleSelection(this.menuData, this.menuIds)
          }
          if (this.resourceIdList !== null) {
            this.toggleChecked(this.menuData, this.resourceIdList)
          }
        })
      },
      unique(data) {
        if (data.length > 0) {
          //去掉重复选取的数据
          for (let i = 0; i < data.length; i++) {
            for (let j = i + 1; j < data.length; ) {
              if (data[i] === data[j]) {
                data.splice(j, 1) //去除重复的对象；
              } else {
                j++
              }
            }
          }
        }
      },
    },
  }
</script>
