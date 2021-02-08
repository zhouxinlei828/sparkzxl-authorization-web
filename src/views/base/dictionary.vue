<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="12">
        <el-card shadow="hover" style="overflow-y: auto; height: 650px">
          <div slot="header" class="clearfix">
            <span>字典列表</span>
            <el-tag
              size="mini"
              type="danger"
              style="float: right"
              effect="plain"
            >
              {{ activeData.activeDictionary }}
            </el-tag>
          </div>
          <el-form :inline="true" size="small">
            <el-form-item>
              <el-input v-model="queryForm.type" placeholder="类型" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="queryForm.name" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                style="margin-left: 12px"
                icon="search"
                type="primary"
                @click="getDictionaryPage(1, 10)"
              >
                搜索
              </el-button>
              <el-button
                size="small"
                style="margin-left: 12px"
                type="primary"
                @click="handleAddDictionary"
              >
                添加
              </el-button>
            </el-form-item>
          </el-form>
          <div style="overflow-y: auto; height: 450px">
            <a-table
              size="middle"
              :columns="dictionaryColumns"
              :row-key="(record) => record.id"
              :loading="tableLoading"
              :data-source="dictionaryData"
              :pagination="dictionaryPagination"
              :custom-row="rowClick"
              bordered
              @change="getDictionaryPage"
            >
              <span slot="status" slot-scope="status">
                <el-tag
                  :type="status === true ? 'primary' : 'success'"
                  disable-transitions
                >
                  {{ status !== true ? '禁用' : '启用' }}
                </el-tag>
              </span>
              <span slot="action" slot-scope="text, record">
                <template>
                  <IconFont
                    type="icon-edit"
                    @click="handleEditDictionary(record)"
                  />
                  <el-divider direction="vertical"></el-divider>
                  <IconFont
                    type="icon-template_delete"
                    @click="handleDeleteDictionary(record.id)"
                  />
                </template>
              </span>
            </a-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" style="overflow-y: auto; height: 650px">
          <div slot="header" class="clearfix">
            <span>{{ activeData.dictionaryItemTitle }}</span>
          </div>
          <el-form :inline="true" size="small">
            <el-form-item>
              <el-input v-model="queryItemForm.code" placeholder="编码" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="queryItemForm.name" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                style="margin-left: 12px"
                type="primary"
                icon="search"
                @click="getDictionaryItemList"
              >
                搜索
              </el-button>
              <el-button
                size="small"
                style="margin-left: 12px"
                type="primary"
                @click="handleAddDictionaryItem"
              >
                添加
              </el-button>
            </el-form-item>
          </el-form>
          <div style="overflow-y: auto; height: 450px">
            <a-table
              :columns="dictionaryItemColumns"
              size="middle"
              :row-key="(record) => record.id"
              :loading="tableItemLoading"
              :data-source="dictionaryItemData"
              :pagination="false"
              bordered
              @change="getDictionaryItemList()"
            >
              <span slot="status" slot-scope="status">
                <el-tag
                  :type="status === true ? 'primary' : 'success'"
                  disable-transitions
                >
                  {{ status !== true ? '禁用' : '启用' }}
                </el-tag>
              </span>
              <span slot="action" slot-scope="text, record">
                <template>
                  <IconFont
                    type="icon-edit"
                    @click="handleUpdateDictionaryItem(record)"
                  />
                  <el-divider direction="vertical"></el-divider>
                  <IconFont
                    type="icon-template_delete"
                    @click="handleDeleteDictionaryItem(record.id)"
                  />
                </template>
              </span>
            </a-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <dictionary-edit-form
      ref="dictionaryCreateForm"
      @fetch-data="getDictionaryPage"
    />
    <dictionary-item-edit-form
      ref="dictionaryItemCreateForm"
      @fetch-data="getDictionaryItemList"
    />
  </div>
</template>
<style></style>
<script>
  import {
    getDictionaryPage,
    getDictionaryItemList,
    deleteDictionary,
    deleteDictionaryItem,
  } from '@/api/dictionary'
  import DictionaryEditForm from '@/views/base/modules/DictionaryEditForm'
  import DictionaryItemEditForm from '@/views/base/modules/DictionaryItemEditForm'

  export default {
    components: {
      DictionaryEditForm,
      DictionaryItemEditForm,
    },
    data() {
      return {
        createDictionaryItemVisible: false,
        createDictionaryItemData: null,
        dictionaryColumns: [
          {
            title: '类型',
            dataIndex: 'type',
            align: 'center',
          },
          {
            title: '名称',
            dataIndex: 'name',
            align: 'center',
          },
          {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          },
        ],
        dictionaryItemColumns: [
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
          {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          },
        ],
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
          type: '',
          name: '',
        },
        queryItemForm: {
          code: '',
          name: '',
        },
        activeData: {
          activeDictionary: '',
          dictionaryId: 0,
          dictionaryType: '',
          dictionaryItemTitle: '字典详情',
        },
        dictionaryPagination: {
          current: 1,
          pageSize: 10,
          defaultCurrent: 1,
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '30'],
          onShowSizeChange: (current, pageSize) => {
            this.dictionaryPagination.current = current
            this.dictionaryPagination.pageSize = pageSize
          },
          change: (page, pageSize) => {
            this.dictionaryPagination.current = page.pageSize
            this.dictionaryPagination.pageSize = pageSize
          },
          showTotal: (total) => `共有 ${total} 条数据`,
        },
        selectedRowKeys: [],
        selectedRows: [],
        dictionaryData: [],
        tableLoading: false,
        tableItemLoading: false,
        dictionaryItemData: [],
        rowClick: (record) => ({
          // 事件
          on: {
            click: () => {
              this.activeData = {
                dictionaryId: record.id,
                dictionaryType: record.type,
                dictionaryItemTitle: '字典详情（'
                  .concat(record.name)
                  .concat('）'),
                activeDictionary: record.name,
              }
              this.queryItemForm = {
                code: '',
                name: '',
              }
              this.getDictionaryItemList()
            },
          },
        }),
      }
    },
    mounted() {
      this.getDictionaryPage()
    },
    methods: {
      getDictionaryItemList() {
        this.tableItemLoading = true
        const params = {
          dictionaryId: this.activeData.dictionaryId,
          code: this.queryItemForm.code,
          name: this.queryItemForm.name,
        }
        getDictionaryItemList(params).then((response) => {
          this.dictionaryItemData = response.data
          this.tableItemLoading = false
        })
      },
      getDictionaryPage(current, pageSize) {
        this.tableLoading = true
        const params = {
          pageNum: current,
          pageSize: pageSize,
          sort: 'id',
          model: {
            type: this.queryForm.type,
            name: this.queryForm.name,
          },
        }
        getDictionaryPage(params).then((response) => {
          const responseData = response.data
          const pagination = { ...this.dictionaryPagination }
          pagination.total = parseInt(responseData.total)
          this.dictionaryData = responseData.list
          this.dictionaryPagination = pagination
          if (this.dictionaryData.length > 0) {
            const dictionaryId = this.activeData.dictionaryId
            this.activeData = {
              dictionaryId:
                dictionaryId === 0 ? this.dictionaryData[0].id : dictionaryId,
              dictionaryType: this.dictionaryData[0].type,
              dictionaryItemTitle: '字典详情（'
                .concat(this.dictionaryData[0].name)
                .concat('）'),
              activeDictionary: this.dictionaryData[0].name,
            }
          }
          this.tableLoading = false
          this.getDictionaryItemList()
        })
      },
      handleAddDictionary() {
        const data = {
          type: null,
          name: null,
          describe: null,
        }
        this.$refs['dictionaryCreateForm'].showDialog(data)
      },
      handleDeleteDictionary(id) {
        deleteDictionary(id).then((response) => {
          const responseData = response.data
          if (responseData) {
            this.$message.success('删除字典成功')
            this.activeData = {}
            this.getDictionaryPage()
          } else {
            this.$message.error('删除字典失败')
          }
        })
      },
      handleEditDictionary(record) {
        const data = {
          id: record.id,
          type: record.type,
          name: record.name,
          describe: record.describe,
        }
        this.$refs['dictionaryCreateForm'].showDialog(data)
      },
      handleAddDictionaryItem() {
        const data = this.activeData
        data.code = null
        data.name = null
        data.isEnable = '1'
        data.describe = null
        console.log(data)
        this.$refs['dictionaryItemCreateForm'].showDialog(data)
      },
      handleUpdateDictionaryItem(record) {
        const data = this.activeData
        data.id = record.id
        data.code = record.code
        data.name = record.name
        data.isEnable = record.status === true ? '1' : '2'
        data.describe = record.describe
        console.log(data)
        this.$refs['dictionaryItemCreateForm'].showDialog(data)
      },
      handleDeleteDictionaryItem(id) {
        deleteDictionaryItem(id).then((response) => {
          const responseData = response.data
          if (responseData) {
            this.$message.success('删除字典项成功')
            this.getDictionaryPage()
          } else {
            this.$message.error('删除字典项成功')
          }
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      handleCancel() {
        this.createDictionaryData = {}
        this.createDictionaryItemVisible = false
        this.createDictionaryItemData = {}
        this.getDictionaryPage()
      },
      handleConfirm() {
        this.createDictionaryData = {}
        this.createDictionaryItemVisible = false
        this.createDictionaryItemData = {}
        this.getDictionaryPage()
      },
    },
  }
</script>
