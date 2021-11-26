<template>
  <div>
    <breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>
      <el-steps :active="activeIndex - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addGoodForm" :rules="addFormRules" label-position="top" ref="addFormRef">
        <!-- 分页标签 -->
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="tabsBeforeLeave" @tab-click="TabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader clearable v-model="selectCateId" :options="cateList" :props="cateSascarderOpt" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyAttrList" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item1" v-for="(item1, i1) in item.attr_vals" :key="i1" border> {{ item1 }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyAttriList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload :action="upload" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headers" :on-success="succUpload">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="myQuillEditor" v-model="addGoodForm.goods_introduce" />
            <el-button type="primary" class="AddBtn" @click="saveAddGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewPath" alt="" class="perviewImg" />
    </el-dialog>
  </div>
</template>

<script>
import { goodsAddFormRulesMixin } from 'common/mixin'
import { _getGoodsCateList, _getAttributeList,_addGoods } from 'network/goods.js'
import Breadcrumb from 'components/content/Breadcrumb.vue'
export default {
  mixins: [goodsAddFormRulesMixin],
  components: { Breadcrumb },
  name: 'addGoods',
  data() {
    return {
      activeIndex: '0',
      // 表单绑定的数据
      addGoodForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: '',
        pics: [],
        goods_introduce: '',
        attrs: [],
      },
      // 商品分类数据
      cateList: [],
      //选中的分类id
      selectCateId: [],
      //分类级联选择器配置
      cateSascarderOpt: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
      //动态参数列表
      manyAttrList: [],
      onlyAttriList: [],
      upload: 'http://127.0.0.1:9090/api/private/v1/upload',
      headers: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      previewDialogVisible: false,
      previewPath: '',
    }
  },
  created() {
    this._getGoodsCateList()
  },
  methods: {
    _getGoodsCateList() {
      _getGoodsCateList({}).then((res) => {
        if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
        // this.$message.success('获取商品数据列表成功')

        this.cateList = res.data
      })
    },
    handleChange() {
      console.log(this.selectCateId)
    },
    tabsBeforeLeave(newA, old) {
      if (old === '0' && this.selectCateId.length !== 3) {
        // console.log('进入:'+ newA +'离开:' + old)
        this.$message.error('请选择商品分类')
        return false
      }
    },
    //点击标签页触发
    TabClick() {
      if (this.activeIndex === '1') {
        _getAttributeList(this.cateId, 'many').then((res) => {
          if (res.meta.status !== 200) return this.$message.error('获取动态参数失败')
          res.data.forEach((item) => {
            if (item.attr_vals) {
              item.attr_vals = item.attr_vals.split(' ')
            } else {
              item.attr_vals = []
            }
          })
          this.manyAttrList = res.data
          // console.log(this.manyAttrList)
        })
      }
      if (this.activeIndex === '2') {
        _getAttributeList(this.cateId, 'only').then((res) => {
          if (res.meta.status !== 200) return this.$message.error('获取静态属性失败')
          console.log(res)
          this.onlyAttriList = res.data
        })
      }
    },
    handlePreview(file) {
      this.previewPath = 'http://127.0.0.1:9090/' + file.response.data.tmp_path
      this.previewDialogVisible = true
      console.log('预览图片', file)
    },
    handleRemove(file) {
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中找到这个图片的对应的索引值
      const index = this.addGoodForm.pics.findIndex((x) => x.pic === filePath)
      // 3. 调用数组的splice方法,把图片信息对象,从pics数组中移除
      this.addGoodForm.pics.splice(index, 1)
      console.log('移除图片', file, this.addGoodForm)
    },
    //图片上传成功
    succUpload(file) {
      console.log(file)
      this.addGoodForm.pics.push({ pics: file.data.tmp_path })
      console.log(this.addGoodForm.pics)
    },
    //上传添加商品
    saveAddGoods() {
      this.addGoodForm.goods_cat = this.selectCateId.join(',')
      this.$refs.addFormRef.validate((valid) => {
        console.log(valid)
        this.manyAttrList.forEach((item) => {
          const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals }
          this.addGoodForm.attrs.push(newInfo)
        })
        // 处理静态参数
        this.onlyAttriList.forEach((item) => {
          const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals }
          this.addGoodForm.attrs.push(newInfo)
        })
        console.log(this.addGoodForm)
        _addGoods(this.addGoodForm).then(res => {
          console.log(res);
          if(res.meta.status !== 201) return this.$message.error('添加商品失败')
          this.$message.success('添加商品成功!')
        this.$router.push('/goods')
        })
      })
    },
  },
  computed: {
    cateId() {
      if (this.selectCateId.length !== 3) {
        return null
      }
      return this.selectCateId[this.selectCateId.length - 1]
    },
  },
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 8px 0 0 !important;
}
.ql-editor {
  min-height: 500px !important;
}
.AddBtn {
  margin-top: 15px;
}
</style>