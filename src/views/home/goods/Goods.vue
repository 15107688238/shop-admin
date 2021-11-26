<template>
  <div>
    <breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="6">
          <!-- 搜索商品 -->
          <el-input placeholder="请输入内容" v-model="GoodsSearch">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <!-- 添加商品按钮 -->
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodsList" border>
        <el-table-column type="index" label="#"></el-table-column>

        <el-table-column prop="goods_name" label="商品名称" width="600px"></el-table-column>
        <el-table-column prop="goods_price" label="价格(元)"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column label="创建时间" width="160px">
          <template slot-scope="scope">
            {{scope.row.add_time | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 7, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {formatDate} from 'common/utils'
import { _getGoodsList } from 'network/goods'
import Breadcrumb from 'components/content/Breadcrumb.vue'
export default {
  components: { Breadcrumb },
  name: 'Goods',
  data() {
    return {
      //搜索商品输入框双向绑定
      GoodsSearch: '',
      //查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 7,
      },
      goodsList: [],
      total: 0,
    }
  },
  created() {
    this._getGoodsList(this.queryInfo)
  },
  methods: {
    _getGoodsList(params) {
      _getGoodsList(params).then((res) => {
        if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
        this.goodsList = res.data.goods
        this.total = res.data.total
      })
    },
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this._getGoodsList(this.queryInfo)
    },
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num
      this._getGoodsList(this.queryInfo)
    },
    //点击添加商品按钮
    addGoods() {
      this.$router.push('goods/add')
    }
  },
  filters: {
    formatDate: function (value) {
        let date = new Date(value*1000);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
  }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.el-col {
  padding-left: 15px;
}
.el-card {
  margin-bottom: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>