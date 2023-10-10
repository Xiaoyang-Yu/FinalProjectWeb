<template>
  <div>
    <!-- 搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="23">
          <el-input v-model="searchModel.prompt" placeholder="prompt"></el-input>
          <el-button icon="el-icon-search" round type="success" @click="getGPT">Get Advice</el-button>
          <el-button icon="el-icon-search" round type="success" @click="saveAdvice">Save Advice</el-button>

        </el-col>
        <el-col :span="1">
          <el-button @click="openEditForm(null)" type="primary" icon="el-icon-plus"></el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <h1>DataList</h1>
      <el-table :data="dietList" style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <div>
              <h3>Family</h3>
              <el-table :data="props.row.details">
                <el-table-column label="Name" prop="name"></el-table-column>
                <el-table-column label="Units" prop="units"></el-table-column>
                <el-table-column label="Protein" prop="protein"></el-table-column>
                <el-table-column label="Carbohydrates" prop="carbohydrates"></el-table-column>
                <el-table-column label="Fat" prop="fat"></el-table-column>
                <el-table-column label="Dietary Fiber" prop="dietary_fiber"></el-table-column>
                <el-table-column label="Sodium" prop="sodium"></el-table-column>
                <el-table-column label="Calories" prop="calories"></el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Meal" prop="meal" />
      </el-table>
    </el-card>
    <el-card>
      <h1>Result</h1>
      {{this.result}}
    </el-card>
    <el-card>
      <h1>Prompt</h1>
      {{this.promptStr}}
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="dietForm" ref="dietFormRef" :rules="rules">
        <el-row>
          <el-col :span="9">
            <el-form-item label="Height(cm)">
              <el-input style="width:140px;" v-model="dietForm.height"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="weight(kg)">
              <el-input style="width:105px;" v-model="dietForm.weight" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="sex">
              <el-select style="width:150px; margin-left: 47px;" v-model="dietForm.sex" placeholder="Select Sex">
                <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="Work type">
              <el-input style="width:380px;" v-model="dietForm.workType" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Vegetarian">
              <el-select style="width:150px;" v-model="dietForm.isVegetarian" placeholder="Select">
                <el-option v-for="item in vegetarianOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="Disease">
              <el-select style="width:380px; margin-left: 13px;" v-model="dietForm.disease" placeholder="Select">
                <el-option v-for="item in diseaseOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="allergens">
              <el-select style="width:150px; margin-left: 9px;" v-model="dietForm.allergens" placeholder="Select">
                <el-option v-for="item in allergensOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDiet">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dietApi from '@/api/dietApi'
import store from '@/store'

export default {
  data() {
    return {
      sexOptions: [{
        value: '1',
        label: 'male'
      }, {
        value: '0',
        label: 'female'
      }],
      vegetarianOptions: [{
        value: '1',
        label: 'Yes'
      }, {
        value: '0',
        label: 'No'
      }],
      allergensOptions: [{
        value: '0',
        label: 'None'
      }, {
        value: '1',
        label: 'Nut and seed'
      }, {
        value: '2',
        label: 'Fruit'
      }, {
        value: '3',
        label: 'Vegetable'
      }, {
        value: '4',
        label: 'Milk'
      }],
      diseaseOptions: [{
        value: '0',
        label: 'None'
      }, {
        value: '1',
        label: 'Atheromatous disease'
      }, {
        value: '2',
        label: 'Cancer'
      }, {
        value: '3',
        label: 'Chronic respiratory disease'
      }, {
        value: '4',
        label: 'Degenerative (including autoimmune) disease'
      }, {
        value: '5',
        label: 'Dementia'
      }, {
        value: '6',
        label: 'Diabetes'
      }, {
        value: '7',
        label: 'Infectious disease'
      }, {
        value: '8',
        label: 'Medically unexplained physical symptoms (MUPS)'
      }, {
        value: '9',
        label: 'Mental illness and substance abuse'
      }, {
        value: '10',
        label: 'Musculoskeletal'
      }],
      result: '',
      uid: store.getters.uid,
      promptStr: '',
      formLabelWidth: '130px',
      dietForm: {
        height: '',
        weight: '',
        sex: '',
        workType: '',
        isVegetarian: '',
        allergens: '',
        disease: ''
      },
      // 默认不可见
      dialogFormVisible: false,
      title: 'a',
      total: 0,
      searchModel: {
        prompt: ''
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
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveAdvice() {
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
    getGPT() {
      dietApi.getAPI(this.searchModel).then(response => {
        this.result = response.data.choices[0].message.content
        const startIndex = this.result.indexOf('```')
        const endIndex = this.result.lastIndexOf('```')
        if (startIndex > 0 || endIndex > 0) {
          this.promptStr = response.data.choices[0].message.content.toString().substring(startIndex + 3, endIndex)
        } else {
          this.promptStr = this.result
        }
        // eslint-disable-next-line no-eval
        this.dietList = eval(this.promptStr)
      })
    },
    getDietList(uid) {
      dietApi.getDietByUid(uid).then(response => {
        // eslint-disable-next-line no-eval
        this.dietList = eval(response.data.dietList.toString())
      })
    }
  },
  created() {
    console.log(store.getters.uid)
    if (this.uid > 0) {
      this.getDietList(this.uid)
    }
  }
}
</script>

<style>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}
</style>
