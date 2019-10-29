<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
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
      <el-table-column label="购入价格" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="日费用" width="110" align="center">
        <template slot-scope="scope">
          {{ dayPrice(scope.row.buyAt, scope.row.price) }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="购入日期" width="200">
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
      <el-table-column label="Actions" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='using'" size="mini" type="success" @click="handleModifyStatus(row,'using')">
            Using
          </el-button>
          <el-button v-if="row.status!='stack'" size="mini" @click="handleModifyStatus(row,'stack')">
            Stack
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="类型" prop="category">
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
          <el-date-picker v-model="temp.buyAt" type="date" value-format="yyyy-MM-dd" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="购入价格" prop="price">
          <el-input v-model="temp.price" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item" />
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="Imp">-->
        <!--          <el-rate-->
        <!--            v-model="temp.importance"-->
        <!--            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"-->
        <!--            :max="3"-->
        <!--            style="margin-top:8px;"-->
        <!--          />-->
        <!--        </el-form-item>-->
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
  </div>
</template>

<script>
import { getList } from '@/api/device'

const deviceTypeOptions = [
  { key: 1, display_name: '电子设备' },
  { key: 2, display_name: '家用设备' }
]
const statusOptions = [
  { key: 'using', display_name: '使用中' },
  { key: 'stack', display_name: '收起' }
]

export default {
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
      list: null,
      listLoading: true,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      temp: {
        id: undefined,
        importance: 1,
        info: '',
        buyAt: '',
        title: '',
        category: '',
        status: 'published'
      },
      deviceTypeOptions,
      statusOptions,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      dialogFormVisible: false
    }
  },
  computed: {},
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
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
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
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
    handleDelete(row) {
      console.log(row)
    }
  }
}
</script>
