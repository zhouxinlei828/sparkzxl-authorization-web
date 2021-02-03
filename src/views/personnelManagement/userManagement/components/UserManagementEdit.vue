<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="900"
    @close="close"
  >
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="form"
      :rules="rules"
      :label-position="labelPosition"
      label-width="120px"
    >
      <el-form-item label="账号:" prop="account" required>
        <el-input v-model="form.account" style="width: 160px" />
      </el-form-item>
      <el-form-item label="姓名:" prop="name" required>
        <el-input v-model="form.name" style="width: 160px" />
      </el-form-item>
      <el-form-item label="组织:" prop="org">
        <TreeSelect
          v-model="form.org"
          :load-options="loadListOptions"
          style="width: 160px"
          :multiple="false"
          :searchable="true"
          :options="orgData"
        />
      </el-form-item>
      <el-form-item label="岗位:" prop="station">
        <el-select
          v-model="form.station"
          style="width: 160px"
          placeholder="请选择岗位"
        >
          <el-option
            v-for="item in stationData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
        <el-input v-model="form.email" style="width: 160px" />
      </el-form-item>
      <el-form-item label="电话:" prop="mobile">
        <el-input v-model="form.mobile" style="width: 160px" />
      </el-form-item>
      <el-form-item label="性别:" prop="sex">
        <el-select
          v-model="form.sex"
          placeholder="请选择性别"
          style="width: 160px"
        >
          <el-option
            v-for="item in sexData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="民族:" prop="nation">
        <el-select
          v-model="form.nation"
          placeholder="请选择民族"
          style="width: 160px"
        >
          <el-option
            v-for="item in nationData"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学历:" prop="nation">
        <el-select
          v-model="form.education"
          placeholder="请选择学历"
          style="width: 160px"
        >
          <el-option
            v-for="item in educationData"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职位状态:" prop="positionStatus">
        <el-select
          v-model="form.positionStatus"
          style="width: 160px"
          placeholder="请选择职位状态"
        >
          <el-option
            v-for="item in positionStatusData"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-radio v-model="form.status" label="1">启用</el-radio>
        <el-radio v-model="form.status" label="2">禁用</el-radio>
      </el-form-item>
      <el-form-item label="描述:" prop="workDescribe">
        <el-input
          v-model="form.workDescribe"
          type="textarea"
          style="width: 345px"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/userManagement'
  import { getStationList } from '@/api/station'

  export default {
    name: 'UserManagementEdit',
    data() {
      return {
        title: '',
        labelPosition: 'right',
        form: {
          account: null,
          name: null,
          password: null,
          org: null,
          station: null,
          email: null,
          mobile: null,
          sex: '1',
          nation: null,
          education: null,
          positionStatus: null,
          status: '1',
          workDescribe: null,
        },
        rules: {
          account: [
            { required: true, message: '账号不能为空', trigger: 'blur' },
          ],
          name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
          ],
        },
        sexData: [
          {
            value: '1',
            label: '男',
          },
          {
            value: '2',
            label: '女',
          },
          {
            value: '3',
            label: '未知',
          },
        ],
        status: 1,
        orgData: [],
        nationData: [],
        stationData: [],
        educationData: [],
        positionStatusData: [],
        dialogFormVisible: false,
      }
    },
    created() {
      this.getStationList()
    },
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.nationData = row.nationData
          delete row.nationData
          this.educationData = row.educationData
          delete row.educationData
          this.positionStatusData = row.positionStatusData
          delete row.positionStatusData
          this.orgData = row.orgData
          delete row.orgData
          this.form = row
        }
        this.dialogFormVisible = true
      },
      getStationList() {
        if (this.stationData.length === 0) {
          getStationList().then((response) => {
            this.stationData = response.data
          })
        }
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      loadListOptions({ callback }) {
        callback()
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await doEdit(this.form)
            this.$baseMessage(msg, 'success')
            this.$emit('fetch-data')
            this.close()
          } else {
            return false
          }
        })
      },
    },
  }
</script>
