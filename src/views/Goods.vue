<template>
  <div class="goods">
    <h1>Goods Page</h1>
    <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="createAt" label="创建日期" width="180"></el-table-column>
      <el-table-column prop="updateAt" label="创建日期" width="180"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="category" label="分类"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
    </el-table>
  </div>
</template>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
export default {
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    }
  },
  data() {
    return {
      tableData: [
        {
          createAt: "2016-05-02",
          updateAt: "2016-05-02",
          name: "王小虎",
          price: 9,
          category: 1,
          description: "上海市普陀区金沙江路 1518 弄"
        },
        {
          createAt: "2016-05-04",
          updateAt: "2016-05-02",
          name: "王小虎",
          price: 9,
          category: 1,
          description: "上海市普陀区金沙江路 1518 弄"
        },
        {
          createAt: "2016-05-01",
          updateAt: "2016-05-02",
          name: "王小虎",
          price: 9,
          category: 1,
          description: "上海市普陀区金沙江路 1518 弄"
        },
        {
          createAt: "2016-05-03",
          updateAt: "2016-05-02",
          name: "王小虎",
          price: 9,
          category: 1,
          description: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  }
};
</script>
