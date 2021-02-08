<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="500px"
    @close="closeDialog"
  >
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      size="small"
      label-width="120px"
    >
      <el-form-item label="编码:" prop="code" style="margin-top: 30px" required>
        <el-tooltip
          class="item"
          effect="dark"
          content="建议使用:作为分隔符，如：menu:add、 resource:view、 file:upload"
          placement="top"
        >
          <el-input v-model="form.code" style="width: 80%" />
        </el-tooltip>
      </el-form-item>
      <el-form-item label="名称:" prop="name" required>
        <el-input v-model="form.name" style="width: 80%" />
      </el-form-item>
      <el-form-item label="请求路径:" prop="requestUrl" required>
        <el-input v-model="form.requestUrl" style="width: 80%" />
      </el-form-item>
      <el-form-item label="描述:" prop="describe">
        <el-input v-model="form.describe" type="textarea" style="width: 80%" />
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
  import { saveResource, updateResource } from '@/api/menu'

  export default {
    data() {
      return {
        title: '新建菜单资源',
        dialogFormVisible: false,
        form: {
          id: null,
          code: null,
          name: null,
          describe: null,
          menuId: 0,
          requestUrl: null,
        },
        rules: {
          code: [{ required: true, message: 'code不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          requestUrl: [
            { required: true, message: '请求路径不能为空', trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      showDialog(data) {
        this.form.id = data.id === undefined ? null : data.id
        this.title = data.id === undefined ? this.title : '修改菜单资源'
        this.form.menuId = data.menuId
        this.form.code = data.code
        this.form.name = data.name
        this.form.requestUrl = data.requestUrl
        this.form.describe = data.describe
        this.dialogFormVisible = true
      },
      onSubmit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            const submitData = this.form
            if (submitData.id !== null) {
              updateResource(submitData).then((response) => {
                const responseData = response.data
                if (responseData) {
                  this.$message.success('修改资源成功')
                  this.resetForm()
                } else {
                  this.$message.error('修改资源失败')
                }
              })
            } else {
              saveResource(submitData).then((response) => {
                const responseData = response.data
                if (responseData) {
                  this.$message.success('新增资源成功')
                  this.resetForm()
                } else {
                  this.$message.error('新增资源失败')
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
        this.title = '新建菜单资源'
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      closeDialog() {
        this.$refs['ruleForm'].resetFields()
        this.title = '新建菜单资源'
        this.dialogFormVisible = false
      },
    },
  }
</script>
