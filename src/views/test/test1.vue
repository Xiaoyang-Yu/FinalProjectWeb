<template>
  <div>
    <!-- 搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="23">
          <el-input v-model="searchModel.prompt" placeholder="prompt"></el-input>
          <el-button icon="el-icon-search" round type="success" @click="getDietList">Get Advice</el-button>
        </el-col>
        <el-col :span="1">
          <el-button @click="openEditForm(null)" type="primary" icon="el-icon-plus"></el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <h1>Result</h1>
      {{this.dietList}}
    </el-card>
    <el-card>
      <h1>Prompt</h1>
      {{this.promptStr}}
    </el-card>

    <!-- 角色信息编辑对话框 -->
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="dietForm" ref="dietFormRef" :rules="rules">
        <el-form-item label="Recipe" prop="recipe" :label-width="formLabelWidth">
          <el-input v-model="dietForm.recipe" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dietApi from '@/api/dietApi'
export default {
  data() {
    return {
      promptStr: '',
      formLabelWidth: '130px',
      dietForm: {},
      // 默认不可见
      dialogFormVisible: false,
      title: 'a',
      total: 0,
      searchModel: {
        prompt: ""
      },
      dietList: [],
      rules: {
        recipe: [
          { required: true, message: 'Please type role name.', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    deleteDiet(diet) {
      this.$confirm('Are you sure to delete this data?', 'Reminder', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dietApi.deleteDietById(diet.dietId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          // 删除完成刷新数据
          this.getDietList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveRole() {
      // 先触发表单验证
      this.$refs.dietFormRef.validate((valid) => {
        if (valid) {
          // 提交请求给后台
          dietApi.saveDiet(this.dietForm).then(response => {
            // 成功提示
            this.$message({
              message: response.message,
              type: 'success'
            })
            // 关闭对话框
            this.dialogFormVisible = false
            // 刷新表格
            //this.getRoleList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭表单的时候清除表单数据和验证信息
    clearForm() {
      this.dietForm = {}
      this.$refs.dietFormRef.clearValidate()
    },
    openEditForm(id) {
      if (id == null) {
        this.title = 'Get Diet'
      } else {
        this.title = 'Edit Diet'
        // 根据id查询角色数据
        dietApi.getDietById(id).then(response => {
          this.dietForm = response.data
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      // this.getDietList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      // this.getDietList()
    },
    getDietList() {
      dietApi.getAPI(this.searchModel).then(response => {
        this.dietList = response.data
        this.promptStr = response.message
        console.log(response.data)
      })
    }
  },
  created() {
    // this.getDietList()
  }
}
</script>

<style>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}
</style>
