<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="12">
        <el-card shadow="hover" style="overflow-y: auto; height: 550px">
          <div slot="header" class="clearfix">
            <span>组织</span>
          </div>
          <el-form :inline="true" size="small">
            <el-form-item>
              <el-input v-model="filterText" placeholder="输入关键字进行过滤">
                >
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                style="margin-left: 12px"
                type="primary"
                @click="handleAdd"
              >
                添加
              </el-button>
              <el-button
                size="small"
                style="margin-left: 12px"
                @click="() => (this.filterText = '')"
              >
                重置
              </el-button>
              <el-button
                size="small"
                style="margin-left: 12px"
                icon="el-icon-delete"
                type="danger"
                @click="handleDelete"
              >
                删除
              </el-button>
            </el-form-item>
          </el-form>
          <el-tree
            ref="tree"
            :data="orgData"
            node-key="id"
            :default-expand-all="true"
            :show-checkbox="true"
            :highlight-current="true"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          ></el-tree>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" style="overflow-y: auto; height: 550px">
          <div slot="header" class="clearfix">
            <span>{{ title }}</span>
          </div>
          <el-form
            ref="ruleForm"
            :model="form"
            :rules="rules"
            label-width="120px"
          >
            <el-form-item label="上级ID:" prop="parentId" required>
              <el-input v-model="form.parentId" style="width: 300px" />
            </el-form-item>
            <el-form-item label="组织名称:" prop="label" required>
              <el-input v-model="form.label" style="width: 300px" />
            </el-form-item>
            <el-form-item label="简称:" prop="abbreviation">
              <el-input v-model="form.abbreviation" style="width: 300px" />
            </el-form-item>
            <el-form-item label="描述:" prop="describe">
              <el-input v-model="form.describe" style="width: 300px" />
            </el-form-item>
            <el-form-item label="状态:" prop="status" required>
              <el-radio v-model="form.status" label="1">启用</el-radio>
              <el-radio v-model="form.status" label="2">禁用</el-radio>
            </el-form-item>
            <el-form-item label="排序值:" prop="status">
              <el-input-number v-model="form.sortValue" :min="1" :max="100" />
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
    </el-row>
  </div>
</template>

<script>
  import { deleteOrg, getOrgList, saveOrg, updateOrg } from '@/api/org'

  export default {
    data() {
      return {
        orgData: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        filterText: '',
        title: '新增',
        buttonName: '新增',
        parentId: 0,
        form: {
          id: null,
          parentId: 0,
          label: '',
          abbreviation: '',
          describe: '',
          status: '1',
          sortValue: 1,
        },
        rules: {
          parentId: [
            { required: true, message: '上级ID不能为空', trigger: 'blur' },
          ],
          label: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' },
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' },
          ],
        },
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
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      },
    },
    mounted() {
      this.getOrgList()
    },
    methods: {
      getOrgList() {
        const parameter = {
          name: '',
          status: true,
        }
        getOrgList(parameter).then((response) => {
          this.orgData = response.data
        })
      },
      handleAdd() {
        this.title = '新增'
        this.buttonName = '新增'
        this.form = {
          id: null,
          parentId: this.parentId,
          label: '',
          abbreviation: '',
          describe: '',
          status: '1',
          sortValue: 1,
        }
      },
      handleSave() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            const submitData = this.form
            submitData.status = this.form.status === '1'
            if (submitData.id != null) {
              updateOrg(submitData).then((response) => {
                const responseData = response.data
                if (responseData) {
                  this.$message.success('修改组织成功')
                  this.getOrgList()
                } else {
                  this.$message.error('修改组织失败')
                }
              })
            } else {
              saveOrg(submitData).then((response) => {
                const responseData = response.data
                if (responseData) {
                  this.$message.success('新增组织成功')
                  this.getOrgList()
                } else {
                  this.$message.error('新增组织失败')
                }
              })
            }
          } else {
            return false
          }
        })
      },
      handleDelete() {
        deleteOrg(this.$refs.tree.getCheckedKeys()).then((response) => {
          const responseData = response.data
          if (responseData) {
            this.$message.success('删除组织成功')
            this.getOrgList()
          } else {
            this.$message.error('删除组织失败')
          }
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      handleNodeClick(data) {
        this.title = '修改'
        this.buttonName = '修改'
        this.parentId = data.id
        this.form = {
          id: data.id,
          parentId: data.parentId,
          label: data.label,
          abbreviation: data.abbreviation,
          describe: data.describe,
          status: data.status === true ? '1' : '2',
          sortValue: data.sortValue,
        }
      },
      resetForm() {
        this.$refs['ruleForm'].resetFields()
        this.title = '新增'
        this.buttonName = '新增'
      },
    },
  }
</script>
