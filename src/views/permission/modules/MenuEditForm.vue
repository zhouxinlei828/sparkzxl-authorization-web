<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="450px"
    @close="closeDialog"
  >
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
    </el-form>
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
  import { saveRole, updateRole } from '@/api/role'

  export default {
    data() {
      return {
        title: '',
        dialogFormVisible: false,
        form: {
          code: null,
          name: null,
          status: '1',
          describe: null,
        },
        rules: {
          code: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
          name: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' },
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' },
          ],
        },
        status: 1,
        orgData: [],
      }
    },
    methods: {
      showDialog(data) {
        if (data.id !== undefined) {
          this.title = '修改角色'
        } else {
          this.title = '新增角色'
        }
        this.dialogFormVisible = true
        this.form = data
      },
      onSubmit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            const status = parseInt(this.form.status) === 1
            const submitData = this.form
            submitData.status = status
            if (submitData.id !== undefined) {
              updateRole(submitData).then((response) => {
                const responseData = response.data
                if (responseData) {
                  this.$message.success('修改角色成功')
                  this.resetForm()
                } else {
                  this.$message.error('修改角色失败')
                }
              })
            } else {
              saveRole(submitData).then((response) => {
                const responseData = response.data
                if (responseData) {
                  this.$message.success('新增角色成功')
                  this.resetForm()
                } else {
                  this.$message.error('新增角色失败')
                }
              })
            }
          } else {
            return false
          }
        })
      },
      resetForm() {
        this.$refs['ruleForm'].resetFields()
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      closeDialog() {
        this.$refs['ruleForm'].resetFields()
        this.dialogFormVisible = false
      },
    },
  }
</script>
