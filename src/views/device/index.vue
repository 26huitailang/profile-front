<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-input
        v-model="listQuery.name"
        placeholder="名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.category" placeholder="类型" clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in deviceTypeOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in statusOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @sort-change="handleSortChange"
    >
      <el-table-column align="center" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (listQuery.page - 1) * listQuery.limit }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="固定资产">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="类型" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.category | categoryFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购入价格" prop="price" width="110" align="center" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="日费用" width="110" align="center">
        <template slot-scope="scope">
          {{ dayPrice(scope.row.buyAt, scope.row.price) }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ displayStatus(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="buyAt" label="购入日期" width="200" sortable="custom">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.buyAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="150" :show-tooltip-when-overflow="true" header-align="center">
        <template slot-scope="scope">
          {{ scope.row.info }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='using'" size="mini" type="success" @click="handleModifyStatus(row,'using')">
            使用
          </el-button>
          <el-button v-if="row.status!='stack'" size="mini" @click="handleModifyStatus(row,'stack')">
            收起
          </el-button>
          <el-button size="mini" type="danger" @click="handleDialogDeleteOpen(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="资产名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="资产类型" prop="category">
          <el-select v-model="temp.category" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in deviceTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="购入日期" prop="buyAt">
          <el-date-picker
            v-model="temp.buyAt"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="Please pick a date"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="购入价格" prop="price">
          <el-input v-model="temp.price" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="temp.info"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="删除"
      :visible.sync="dialogDeleteVisible"
      width="30%"
      :before-close="handleDeleteClose"
    >
      <span>是否删除固定资产 {{ deleteTmp.name }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleDelete">Confirm</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, create, del, edit } from '@/api/device'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive

const deviceTypeOptions = [
  { key: 1, display_name: '电子设备' },
  { key: 2, display_name: '家用设备' }
]
const statusOptions = [
  { key: 'using', display_name: '使用' },
  { key: 'stack', display_name: '收起' }
]

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        using: 'success',
        stack: 'danger'
      }
      return statusMap[status]
    },
    categoryFilter(status) {
      const statusMap = {
        1: '电子设备',
        2: '家用电器'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      total: 0,
      list: null,
      listLoading: true,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      temp: {
        id: undefined,
        info: '',
        buyAt: '',
        title: '',
        category: '',
        status: 'published'
      },
      deviceTypeOptions,
      statusOptions,
      rules: {
        name: [{ required: true, message: 'required', trigger: 'change' }],
        buyAt: [{ required: true, message: 'required', trigger: 'change' }],
        category: [{ required: true, message: 'required', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogDeleteVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        category: undefined,
        status: undefined,
        sort: '+id'
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      deleteTmp: {
        id: undefined,
        name: undefined
      }
    }
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleModifyStatus(row, status) {
      row.status = status
      edit(row).then(() => {
        this.$notify({
          title: '成功',
          message: '修改状态成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    dayPrice: function(buyAt, price) {
      // buyAt 2019-11-11, price 10.12
      const sDate = buyAt.split('-')
      const newBuyAt = new Date(sDate[0], sDate[1], sDate[2])
      const currentDate = new Date()
      const newCurrentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate())

      let diff = Math.abs((newCurrentDate - newBuyAt) / 1000 / 60 / 60 / 24)

      // let denominator gt 0
      if (diff === 0) {
        diff = 1
      }
      return (price / diff).toFixed(2)
    },
    handleDialogDeleteOpen(row) {
      this.deleteTmp = row
      this.dialogDeleteVisible = true
    },
    handleDeleteClose(done) {
      this.$confirm('你确定希望关闭此次确认吗？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete() {
      this.listLoading = true
      const tmp = { 'ids': [this.deleteTmp.id] }
      del(tmp).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
      this.dialogDeleteVisible = false
    },
    resetTemp() {
      const now = new Date()
      this.temp = {
        id: undefined,
        info: '',
        buyAt: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
        name: '',
        status: 'using',
        category: '',
        price: 0
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    displayStatus: function(key) {
      for (let i = 0, len = this.statusOptions.length; i < len; i++) {
        if (this.statusOptions[i].key === key) {
          return statusOptions[i].display_name
        }
      }
      return ''
    },
    handleSortChange: function(column) {
      let sort
      if (column.order === 'ascending') {
        sort = '+' + column.prop
      } else if (column.order === 'descending') {
        sort = '-' + column.prop
      } else {
        sort = '+id'
      }
      this.listQuery.sort = sort
      this.getList()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          create(this.temp)
          this.dialogFormVisible = false
          this.$refs['dataForm'].resetFields()
          this.getList()
        } else {
          this.$message({
            'type': 'warning',
            'message': '请完成表单'
          })
        }
      })
    },
    updateData: function() {
      console.log('update')
      edit(this.temp).then(response => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.dialogFormVisible = false
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .filter-container {
    padding-bottom: 10px;
  }
</style>
