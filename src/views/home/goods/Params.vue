<template>
  <div>
    <breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </breadcrumb>
    <el-card>
      <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" show-icon> </el-alert>
      <el-row>
        <el-col>
          请选择商品分类:
          <!-- 商品分类级联选择器 -->
          <el-cascader v-model="cateListId" :options="cateList" :props="cateCascaderProp" @change="handleCateChange" clearable></el-cascader>
        </el-col>
      </el-row>
      <!-- 分页标签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isDisable" @click="addAttribute()">添加参数</el-button>
          <el-table :data="attributesList" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="attrTabClose(scope.row, i)">{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  autofocus
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @change="handleInputConfirm(scope.row)"
                  
                >
                </el-input>
                <el-button v-else size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-eidt" size="mini" @click="addAttribute(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isDisable" @click="addAttribute()">添加属性</el-button>
          <el-table :data="attributesList" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="attrTabClose(scope.row, i)">{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  autofocus
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @change="handleInputConfirm(scope.row)"
                >
                </el-input>

                <el-button v-else size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-eidt" size="mini" @click="addAttribute(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数/属性dialog  -->
    <el-dialog :title="this.getAttribute" :visible.sync="AttributedialogVisible" width="50%">
      <el-form ref="addAttriformRef" :model="addAttriform" label-width="80px" :rules="editFormRules">
        <el-form-item :label="this.getAttribute.slice(2, 4) + '名称'" prop="attr_name">
          <el-input v-model="addAttriform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AttributedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddAttribute()" v-if="addOrEdit">确 定</el-button>
        <el-button type="primary" @click="saveAddAttribute('edit')" v-else>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { _getGoodsCateList, _getAttributeList, _addAttribute, _getAttributeById, _editAttribute } from 'network/goods.js'
import { paramsFormRulesMixin } from 'common/mixin'
import Breadcrumb from 'components/content/Breadcrumb.vue'
export default {
  mixins: [paramsFormRulesMixin],
  components: { Breadcrumb },
  name: 'Params',
  data() {
    return {
      cateList: [],
      //级联选择器选中项的id
      cateListId: [],
      //级联选择器配置项
      cateCascaderProp: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //默认显示的分页标签
      activeName: 'many',
      //获取参数列表
      attributesList: [],
      //标签输入框的显示和隐藏
      inputVisible: false,
      // 标签输入框的双向绑定
      inputValue: '',
      //添加参数属性对话框显示与隐藏
      AttributedialogVisible: false,
      //添加参数/属性表单
      addAttriform: {
        attr_name: '',
        attr_id: '',
      },
      //dialog标题
      addOrEdit: true,
    }
  },
  created() {
    this._getGoodsCateList()
  },
  methods: {
    //获取商品分类列表
    _getGoodsCateList() {
      _getGoodsCateList({}).then((res) => {
        if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
        // this.$message.success('获取商品数据列表成功')
        this.cateList = res.data
        // console.log(this.cateList)
      })
    },
    _getAttributeList(id, sels) {
      _getAttributeList(id, sels).then((res) => {
        if (res.meta.status !== 200) return this.$message.error('获取参数失败')
        // this.$message.success('获取参数属性成功')
        // console.log(res.data)
        res.data.forEach((item) => {
          if (!item.attr_vals) {
            item.attr_vals = []
            return
          }
          item.attr_vals = item.attr_vals.split(' ')

          // console.log(item.attr_vals)
        })
        this.attributesList = res.data
      })
    },
    _editAttribute(cateId, attrid, data) {
      _editAttribute(cateId, attrid, data).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('编辑失败')
        }
        this.$message.success('修改成功')
        if (!data.attr_vals) {
          this._getAttributeList(this.cateListId[2], this.activeName)
        }

        this.AttributedialogVisible = false
      })
    },
    //监听级联选择器选中项的改变
    handleCateChange() {
      if (this.cateListId.length !== 3) {
        return (this.attributesList = [])
      }
      this._getAttributeList(this.cateListId[2], this.activeName)
    },
    //点击分页表现请求参数列表
    handleTabClick() {
      if (this.cateListId.length !== 3) {
        this.$message.error('请选择商品分类')
        this.attributesList = []
        return
      }
      this._getAttributeList(this.cateListId[2], this.activeName)
    },
    //标签输入框回车和鼠标点击其他地方触发
    handleInputConfirm(row) {
      if (this.inputValue.trim().length) {
        row.attr_vals.push(this.inputValue.trim())
        // console.log(valsArr )
        const data = {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' '),
        }
        this._editAttribute(this.cateListId[2], row.attr_id, data)
      }
      this.inputVisible = false
    },
    //tag标签关闭触发
    attrTabClose(row, index) {
      row.attr_vals.splice(index, 1)
      const data = {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(' '),
      }
      this._editAttribute(this.cateListId[2], row.attr_id, data)
    },
    //点击显示标签输入框
    showInput() {
      this.inputValue = ''
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
        // console.log(this.$refs.saveTagInput)
      })
    },
    //点击显示添加/编辑 参数/属性dialog
    addAttribute(id) {
      this.addOrEdit = true
      this.addAttriform.attr_id = ''
      this.addAttriform.attr_name = ''
      if (id) {
        this.addOrEdit = false
        _getAttributeById(this.cateListId[2], id, this.activeName).then((res) => {
          // console.log(res)
          this.addAttriform.attr_name = res.data.attr_name
          this.addAttriform.attr_id = res.data.attr_id
        })
      }

      this.AttributedialogVisible = true
    },
    //点击提交添加/编辑 的参数/属性
    //有传参是编辑,没有是添加
    saveAddAttribute(str) {
      const data = {
        attr_name: this.addAttriform.attr_name,
        attr_sel: this.activeName,
      }
      if (!str) {
        this.$refs.addAttriformRef.validate((valid) => {
          // console.log(valid)
          if (!valid) return
          // console.log(str)
          _addAttribute(this.cateListId[2], data).then((res) => {
            if (res.meta.status !== 201) return this.$message.error('添加失败')
            this.$message.success('添加成功')
            this._getAttributeList(this.cateListId[2], this.activeName)
            this.AttributedialogVisible = false
          })
        })
        return
      }
      this.$refs.addAttriformRef.validate((valid) => {
        if (!valid) return
        this._editAttribute(this.cateListId[2], this.addAttriform.attr_id, data)
      })
    },
  },
  computed: {
    isDisable() {
      return !this.cateListId.length
    },
    getAttribute() {
      if (!this.addOrEdit) {
        if (this.activeName == 'many') return '编辑参数'
        if (this.activeName == 'only') return '编辑属性'
      }
      if (this.activeName == 'many') return '添加参数'
      if (this.activeName == 'only') return '添加属性'
    },
  },
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.el-row {
  margin-top: 15px;
  font-size: 14px;
}
.el-cascader {
  widows: 400px;
}
.el-tag {
  margin: 7px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: center;
}
</style>