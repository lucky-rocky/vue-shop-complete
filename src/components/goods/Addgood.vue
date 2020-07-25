<template>
  <div id="addGood">
    <!-- 头部导航 -->
    <el-header class="goods_header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }" class="el-breadcrumb-item">首页</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">添加商品</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <!-- card -->
    <el-card>
      <!-- 头部提示 -->
      <el-alert title="添加商品信息" type="info" :closable="false" show-icon center></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="active" finish-status="success" class="steps" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 纵向页签 -->
      <el-tabs
        tab-position="left"
        style="height: 200px;"
        @tab-click="next(value)"
        v-model="value"
        :before-leave="beforeTab"
      >
        <el-tab-pane label="基本信息" name="1">
          <el-form
            :model="baseInfoForm"
            :rules="baseInfoFormRules"
            ref="baseInfoForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="baseInfoForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="baseInfoForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="baseInfoForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="baseInfoForm.goods_number"></el-input>
            </el-form-item>
            <!-- 级联 -->
            <el-form-item label="商品分类">
              <div class="block">
                <el-cascader
                  v-model="seletedKeys"
                  :options="options"
                  :props="props"
                  @change="handleChange"
                ></el-cascader>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="2">
          <!-- <div v-for="item in manyParams" :key="item.attr_id" class="attr_name"> -->
          <!-- <div class="attr_div">{{item.attr_name}}</div>
            <span v-for="(item2,index2) in item.attr_vals" :key="index2" class="attr_vals">
              <el-button
                class="tagColor"
                icon="el-icon-check"
                size="mini"
                @click="tagClick(item.attr_vals,index2)"
              >{{item2}}</el-button>
            </span>
          </div>-->
          <div v-for="item in manyParams" :key="item.attr_id" class="attr_name">
            <div>{{item.attr_name}}</div>
            <el-checkbox-group v-model="item.attr_vals" size="small" checked>
              <el-checkbox
                :label="item2"
                border
                v-for="(item2,index2) in item.attr_vals"
                :key="index2"
                class="attr_vals"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">
          <div v-for="item in onlyParams" :key="item.attr_id" class="attr_name">
            <div class="attr_div">{{item.attr_name}}</div>
            <el-input v-model="item.attr_vals"></el-input>
          </div>
        </el-tab-pane>
        <!-- 图片是单独上传的,未经axios请求拦截,需要携带token -->
        <el-tab-pane label="商品图片" name="4">
          <el-upload
            class="upload-demo"
            action="http://127.0.0.1:8888/api/private/v1/upload"
            ref="upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :headers="headers"
            list-type="picture"
            :auto-upload="true"
            :on-success="successUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <div class="quillEditor">
            <quill-editor v-model="quillEidtorValue" ref="quillEditor" :options="editorOption"></quill-editor>
          </div>
          <el-button type="primary" class="endAddGood" @click="addGoodSubmit">添加商品</el-button>
        </el-tab-pane>
        <!-- dialog弹框实现预览 -->
        <el-dialog :visible.sync="dialogVisible" width="50%" class="preBox">
          <img :src="previewURL" class="preImg" alt />
        </el-dialog>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var validatePrice = (rule, value, callback) => {
      // 减0 转符串数字为number类型数字,用于验证
      if (!value) {
        return callback(new Error('内容不能为空'))
      }
      if (!Number.isInteger(value - 0)) {
        return callback(new Error('请输入数字值'))
      }
      return callback()
    }
    return {
      // 页签参数
      active: 0,
      value: '1',
      // 基本信息表单参数
      baseInfoForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: ''
      },
      baseInfoFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { validator: validatePrice, trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { validator: validatePrice, trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { validator: validatePrice, trigger: 'blur' }
        ]
      },
      // 级联
      seletedKeys: [],
      options: [],
      props: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 商品参数
      manyParams: [],
      onlyParams: [],
      // 上传图片
      pics: [],
      headers: {
        Authorization: window.localStorage.getItem('token')
      },
      dialogVisible: false,
      previewURL: '',
      // quill-editor
      // 编辑器中的文本内容结构
      quillEidtorValue: '<p>hello quillEditor!!</p>', // 默认富文本内容
      editorOption: {
        theme: 'snow' // 默认主题
      }
    }
  },
  methods: {
    // 点击tab时触发
    next(i) {
      if (!this.catIds) {
        this.value = '1'
        this.$message.error('请先选择商品分类')
        return false
      }
      this.active = --i
    },

    // 切换前的钩子
    beforeTab() {
      if (!this.catIds) {
        return false
      }
    },

    // 级联更改时触发
    handleChange(val) {
      // 级联更改重置editor
      this.quillEidtorValue = '<p>hello quillEditor!!</p>'
      // // 重置表单
      this.$refs.baseInfoForm.resetFields()
      if (this.seletedKeys.length !== 3) {
        this.seletedKeys = []
        return false
      }
      this.getParams()
      // console.log(this.seletedKeys)
      // console.log(this.manyParams)
    },

    // 获取商品分类
    async getGoodsList() {
      const {
        data,
        meta: { status }
      } = await this.$axios.get('/categories')
      if (status !== 200) {
        return this.$message.error('获取分类信息错误')
      }
      // console.log(data)
      this.options = data
    },

    // 获取参数
    async getParams() {
      if (!this.catIds) {
        return this.$message.error('请先选择三级分类')
      }
      const arr = ['only', 'many']
      const [p1, p2] = arr.map(async item => {
        const res = await this.$axios.get(
          `categories/${
            this.seletedKeys[this.seletedKeys.length - 1]
          }/attributes`,
          { params: { sel: item } }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        return res.data
        // if (item === 'only') {
        //   this.onlyParams = res.data
        // } else {
        //   this.manyParams = res.data
        // }
      })
      this.onlyParams = await p1.then(data => data)
      this.manyParams = await p2.then(data => data)

      // 将 attr_vals 参数值改造成数组
      this.manyParams.forEach(item => {
        // console.log(item.attr_vals)
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
      })

      // const cateId = this.seletedKeys[this.seletedKeys.length - 1]
      // console.log(cateId)
      // const res = await this.$axios.get(`categories/${cateId}/attributes`, {
      //   params: { sel: 'many' }
      // })
      // if (res.meta.status !== 200) {
      //   return this.$message.error(res.meta.msg)
      // }
      // console.log(res)
      // this.manyParams = res.data
      // console.log(this.manyParams)
    },

    // 点击剔除相应默认tag
    tagClick(arr, i) {
      arr.splice(i, 1)
    },

    // 图片上传的事件们
    // 删除事件
    handleRemove(file, fileList) {
      const path = file.response.data.tmp_path
      // 根据path 删除pics中对应的图片
      const index = this.pics.findIndex(item => {
        return item.pic === path
      })
      this.pics.splice(index, 1)
      console.log(this.pics)
    },
    // 点击实现预览
    handlePreview(file) {
      this.dialogVisible = true
      this.previewURL = file.url
    },
    successUpload(response, file, fileList) {
      // console.log(this.fileList) //undefined
      // console.log(response)
      // console.log(file)
      // console.log(fileList)
      // 准备好添加商品所需要的pics参数
      const pic = { pic: response.data.tmp_path }
      this.pics.push(pic)
    },
    // 添加商品 验证必填表单,组装数据并发起请求
    addGoodSubmit() {
      this.$refs.baseInfoForm.validate(async vaild => {
        if (!vaild) {
          return this.$message.error('请填写完善表单后再提交')
        }
        const attrs = []
        this.manyParams.map(item => {
          attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          })
        })
        this.onlyParams.map(item => {
          attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        })
        // console.log(attrs)

        const addParams = {
          ...this.baseInfoForm,
          goods_cat: this.catIds,
          goods_introduce: this.quillEidtorValue,
          pics: this.pics,
          attrs: attrs
        }
        console.log(addParams)
        // 发送请求
        const {
          meta: { msg, status }
        } = await this.$axios.post('goods', addParams)
        if (status !== 201) {
          return this.$message.error(msg)
        }
        this.$message.success(msg)
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    catIds() {
      if (this.seletedKeys.length !== 3) return
      // 转为,分割的字符串
      return this.seletedKeys.join(',')
    },
    editor() {
      return this.$refs.quillEditor.quill
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
#addGood {
  width: 100%;
  height: 100%;
  background-color: #eaedf1;
  overflow: auto;
  /* 头部导航 */
  .goods_header {
    height: 35px !important;
    background-color: #ff330044;
    .el-breadcrumb-item {
      font-size: 16px;
      line-height: 30px;
    }
  }
}
.el-card {
  margin: 20px 10px 0;
  padding: 10px 0px 0px;
}
.el-alert {
  font-size: 16px;
  overflow: auto;
}
.steps {
  margin: 20px 0 10px;
}
.el-form-item {
  margin: 5px 0px 60px;
}
.attr_name {
  margin-bottom: 20px;
}
.attr_vals {
  margin: 5px 10px;
  display: inline-block;
}
.attr_div {
  margin: 5px 0 10px;
}
.tagColor {
  color: skyblue;
  border: 1px solid skyblue;
}
.preImg {
  width: 100%;
}
.endAddGood {
  margin-top: 10px;
}
</style>
