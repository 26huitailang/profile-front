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
        <template slot-scope="scope" 15413.93

deleted

1993-10-14

商强力治张划心出易心住包。龙层确深委布因立到他来八下色与。九片带矿开利进色志始主过自算保。

1

vemjhxqou

家用电器

1690.06

1690>
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
          {{ scope.row.dayPrice }}
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
      <el-table-column label="备注" width="110" :show-tooltip-when-overflow="10" header-align="center">
        <template slot-scope="scope">
          {{ scope.row.info }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='using'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Using
          </el-button>
          <el-button v-if="row.status!='stack'" size="mini" @click="handleModifyStatus(row,'draft')">
            Stack
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'

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
      listLoading: true
    }
  },
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
    }
  }
}
</script>
