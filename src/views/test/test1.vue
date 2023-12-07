<template>
  <div>
    <!-- 搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="23">
          <el-input v-model="searchModel.prompt" placeholder="prompt" style="display: none"></el-input>
          <el-button icon="el-icon-search" round type="success" @click="getGPT">Get AI Advice</el-button>
          <el-button icon="el-icon-search" round type="success" @click="saveAdvice">Save Advice</el-button>

        </el-col>
        <el-col :span="1">
          <el-button @click="openEditForm(null)" type="primary" icon="el-icon-plus"></el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <h1>Recommendation List</h1>
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
      <el-form :model="bfpForm" ref="bfpFormRef" :rules="rules">
        <el-row>
          <el-col :span="9">
            <el-form-item label="Height(cm)">
              <el-input style="width:140px;" v-model="bfpForm.height"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="Age">
              <el-input style="width:140px;" v-model="bfpForm.age"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="weight(kg)">
              <el-input style="width:105px;" v-model="bfpForm.weight" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="sex">
              <el-select style="width:150px; margin-left: 47px;" v-model="bfpForm.sex" placeholder="Select Sex">
                <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="Work type">
              <el-select style="width:380px;" v-model="bfpForm.workType" placeholder="Select WorkType">
              <el-option v-for="item in workOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Vegetarian">
              <el-select style="width:150px;" v-model="bfpForm.isVegetarian" placeholder="Select">
                <el-option v-for="item in vegetarianOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="Disease">
              <el-select style="width:380px; margin-left: 13px;" v-model="bfpForm.disease" placeholder="Select">
                <el-option v-for="item in diseaseOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="allergens">
              <el-select style="width:150px; margin-left: 9px;" v-model="bfpForm.allergens" placeholder="Select">
                <el-option v-for="item in allergensOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="saveBfp">确 定</el-button>
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
      workOptions: [{
        value: 1,
        label: 'office'
      }, {
        value: 2,
        label: 'outside'
      }],
      sexOptions: [{
        value: 1,
        label: 'male'
      }, {
        value: 0,
        label: 'female'
      }],
      vegetarianOptions: [{
        value: 1,
        label: 'Yes'
      }, {
        value: 0,
        label: 'No'
      }],
      allergensOptions: [{
        value: 0,
        label: 'None'
      }, {
        value: 1,
        label: 'Nut and seed'
      }, {
        value: 2,
        label: 'Fruit'
      }, {
        value: 3,
        label: 'Vegetable'
      }, {
        value: 4,
        label: 'Milk'
      }],
      diseaseOptions: [{
        value: 0,
        label: 'None'
      }, {
        value: 1,
        label: 'Atheromatous disease'
      }, {
        value: 2,
        label: 'Cancer'
      }, {
        value: 3,
        label: 'Chronic respiratory disease'
      }, {
        value: 4,
        label: 'Degenerative (including autoimmune) disease'
      }, {
        value: 5,
        label: 'Dementia'
      }, {
        value: 6,
        label: 'Diabetes'
      }, {
        value: 7,
        label: 'Infectious disease'
      }, {
        value: 8,
        label: 'Medically unexplained physical symptoms (MUPS)'
      }, {
        value: 9,
        label: 'Mental illness and substance abuse'
      }, {
        value: 10,
        label: 'Musculoskeletal'
      }],
      result: '',
      uid: store.getters.uid,
      promptStr: '',
      formLabelWidth: '130px',
      dietForm: {
        id: null,
        uid: store.getters.uid,
        pid: null,
        recipe: this.promptStr
      },
      bfpForm: {
        age: null,
        height: null,
        weight: null,
        sex: null,
        isVegetarian: null,
        disease: null,
        workType: null,
        uid: store.getters.uid,
        id: null,
        allergens: null
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
      //console.log(this.dietForm)
      // 先触发表单验证
      if (this.dietForm.recipe != null && this.dietForm.recipe !== '' && this.dietForm.recipe !== undefined) {
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
    },
    saveBfp() {
      // 先触发表单验证
      this.$refs.bfpFormRef.validate((valid) => {
        if (valid) {
          this.bfpForm.age = parseInt(this.bfpForm.age)
          this.bfpForm.height = parseInt(this.bfpForm.height)
          this.bfpForm.weight = parseInt(this.bfpForm.weight)
          // 提交请求给后台
          dietApi.savebfpForm(this.bfpForm).then(response => {
            // 成功提示
            this.$message({
              message: response.message,
              type: 'success'
            })
            // 关闭对话框
            this.dialogFormVisible = false
            console.log(this.bfpForm)
            const work = this.workOptions.find(option => option.value === this.bfpForm.workType).label
            const sex = this.sexOptions.find(option => option.value === this.bfpForm.sex).label
            const disease = this.diseaseOptions.find(option => option.value === this.bfpForm.disease).label
            const allergens = this.allergensOptions.find(option => option.value === this.bfpForm.allergens).label
            const isVegetarian = this.bfpForm.isVegetarian === 0 ? 'Vegetarian' : ''
            // 刷新表格
            this.searchModel.prompt = 'a ' + sex + ' who ' + this.bfpForm.weight + ' weight and is ' + this.bfpForm.height + ' tall, and a ' + this.bfpForm.age + '-year-old ' + work + ' work this person with ' + disease + ', ' + allergens + ' allergen, ' + isVegetarian +
             ', give me a diet sheet that should include detailed information including 3 meals, names of food, units, protein grams, carbohydrates grams, fat grams, dietary fiber grams, sodium grams, and calories. output content must follow ```[{meal:\'breakfast\',details:[{name:\'oats\',units:\'1 cup\',protein:\'6g\',carbohydrates:\'27g\',fat:\'3g\',dietary_fiber:\'4g\',sodium:\'0g\',calories:\'155 kcal\'}]```'
          })
          console.log(this.searchModel.prompt)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭表单的时候清除表单数据和验证信息
    clearForm() {
      this.bfpForm = {}
      this.$refs.bfpFormRef.clearValidate()
    },
    openEditForm(id) {
      if (id == null) {
        this.title = 'Get Diet'
      } else {
        this.title = 'Edit Diet'
        // 根据id查询角色数据
        dietApi.getBfpForm(id).then(response => {
          this.bfpForm = response.data
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
        console.log(response.data)
        //const id = response.data.choices[1].message.content
        const startIndex = this.result.indexOf('```')
        const endIndex = this.result.lastIndexOf('```')
        if (startIndex > 0 || endIndex > 0) {
          this.promptStr = response.data.choices[0].message.content.toString().substring(startIndex + 3, endIndex)
        } else {
          this.promptStr = this.result
        }
        // eslint-disable-next-line no-eval
        this.dietList = eval(this.promptStr.replace('json', ''))
        this.dietForm.recipe = this.promptStr.replace('json', '')
        //this.dietList.id = id
        console.log(this.dietForm)
      })
    },
    getDietList(uid) {
      dietApi.getDietByUid(uid).then(response => {
        // eslint-disable-next-line no-eval
        this.dietList = eval(response.data.dietList.toString())
        this.dietForm.id = response.data.id
        this.dietForm.pid = response.data.pid
      })
    }
  },
  created() {
    //console.log(store.getters.uid)
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
