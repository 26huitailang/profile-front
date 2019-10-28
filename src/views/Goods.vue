<template>
  <div class="goods">
    <el-row class="operations">
      <el-button
        type="primary"
        @click="dialogFormVisible = true"
      >添加</el-button>
      <el-button type="danger">删除</el-button>
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column
        prop="createdAt"
        label="创建日期"
        width="180"
      />
      <el-table-column
        prop="updatedAt"
        label="更新日期"
        width="180"
      />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="category" label="分类" />
      <el-table-column prop="description" label="描述" />
    </el-table>
    <el-dialog title="添加物品" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="form.price" auto-complete="off" />
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth">
          <el-input v-model="form.category" auto-complete="off" />
        </el-form-item>
        <el-form-item label="购买日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.buyAt"
            type="date"
            placeholder="购买日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="过期日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.expireAt"
            type="date"
            placeholder="购买日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" auto-complete="off" />
        </el-form-item>
        <el-form-item label="过期速率/天" :label-width="formLabelWidth">
          <el-input
            v-model="form.despreciationRate"
            auto-complete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addGoodsComfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ApiGoods } from '../requests/api.js'
import { get } from '../requests'

export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      formLabelWidth: '100px',
      form: {
        name: '',
        price: 0,
        category: 1,
        buyAt: '',
        expireAt: '',
        description: '',
        despreciationRate: 0
      }
    }
  },
  mounted() {
    get(ApiGoods().Goods).then(response => {
      this.tableData = response.data
    })
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    addGoodsComfirm() {
      this.dialogFormVisible = false
      console.log('a')
    }
  }
}
</script>

<style lang="scss">
.el-table {
  .warning-row {
    background: oldlace;
  }
  .success-row {
    background: #f0f9eb;
  }
}
.operations .el-button {
  margin: 5px;
  float: left;
}
</style>
