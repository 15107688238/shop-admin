<template>
  <div>
    <breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </breadcrumb>
    <el-card>
      <!-- 添加分类按钮 -->
      <div><el-button type="primary" @click="addCate">添加分类</el-button></div>

      <tree-table :data="GoodsCateList" :columns="columns" border :expand-type="false" :selection-type="false" class="tree-table">
        <template slot="isOk" slot-scope="scope">
          <i :class="scope.row.cat_deleted ? 'el-icon-success isok-green' : 'el-icon-error isok-red'"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" type="success" size="mini">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="warning" size="mini">二级</el-tag>
          <el-tag v-if="scope.row.cat_level === 2" type="danger" size="mini">三级</el-tag>
        </template>
        <template slot="opt">
          <el-button type="primary" size="mini">编辑</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加分类Dialog -->
      <el-dialog title="添加分类" :visible.sync="addCatedialogVisible" width="50%">
        <el-form ref="addCateFormRef" :model="addCateForm" label-width="80px" :rules="addFormRules">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类名称">
            <el-cascader :options="GoodsCate2" v-model="selectKeys" :props="setScscader" @change="handleChange" clearable></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCatedialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAddCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { _getGoodsCateList, _addGoodsCate } from 'network/goods.js'
import { paramsFormRulesMixin } from 'common/mixin'
import Breadcrumb from 'components/content/Breadcrumb.vue'

export default {
  components: { Breadcrumb },
  name: 'Cate',
  mixins: [paramsFormRulesMixin],
  data() {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类列表数据
      GoodsCateList: [],
      //商品分类列表数据总数
      total: 0,
      // 树状表格列配置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // prop: 'cat_deleted',
          type: 'template',
          template: 'isOk',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          // prop: 'cat_level'
          type: 'template',
          template: 'opt',
        },
      ],
      //添加分类dialog显示和隐藏
      addCatedialogVisible: false,
      //添加分类表单数据
      addCateForm: {
        cat_name: '',
        //默认为父分类
        cat_pid: 0,
        //默认为1级分类
        cat_level: 0,
      },
      //商品二级分类数据
      GoodsCate2: [],

      //级联选择器配置
      setScscader: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true,
      },
      //级联选中的项
      selectKeys: [],
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this._getGoodsCateList(this.queryInfo)
  },
  methods: {
    //网络请求相关
    _getGoodsCateList(params) {
      _getGoodsCateList(params).then((res) => {
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('商品分类列表获取失败')
        this.total = res.data.total
        this.GoodsCateList = res.data.result
      })
    },
    //点击显示添加分类Dialog
    addCate() {
      this.selectKeys = []
      this.addCateForm.cat_name = ''
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      _getGoodsCateList({ type: 2 }).then((res) => {
        if (res.meta.status !== 200) return this.$message.error('商品分类列表获取失败')
        this.GoodsCate2 = res.data
        // console.log(this.GoodsCate2)
      })
      this.addCatedialogVisible = true
    },
    //点击提交添加分类
    saveAddCate() {
      this.$refs.addCateFormRef.validate(valid => {
        if(!valid) return this.$message.error('请输入正确的分类名称')
        _addGoodsCate(this.addCateForm).then(res => {
          console.log(res)
          if(res.meta.status !== 201) return this.$message.error('添加分类失败')
          this.$message.success('添加分类成功')
          this._getGoodsCateList(this.queryInfo)
          this.addCatedialogVisible = false
        })

        
      })
      console.log(this.addCateForm)
    },
    //添加分类级联选择器改变
    handleChange() {

      console.log(this.selectKeys)
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.cat_level = this.selectKeys.length - 1
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //监听每页条数变化
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this._getGoodsCateList(this.queryInfo)
    },
    //监听页码变化
    handleCurrentChange(current) {
      this.queryInfo.pagenum = current
      this._getGoodsCateList(this.queryInfo)
    },
  },
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.isok-green {
  color: greenyellow;
}
.isok-red {
  color: red;
}
.tree-table {
  margin: 15px 0;
}
</style>