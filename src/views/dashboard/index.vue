<template>
  <div class="dashboard-container">
    <!-- 搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="23">
          <span class="demonstration">Select Date: </span>
          <el-date-picker v-model="searchModel.value1" type="date" placeholder="Start Date"></el-date-picker>
          ——
          <el-date-picker v-model="searchModel.value2" type="date" placeholder="End Date"></el-date-picker>
          <el-button icon="el-icon-search" round type="success" @click="getDataList">Search</el-button>
        </el-col>
        <el-col :span="1">
          <el-button @click="openEditForm(null)" type="primary" icon="el-icon-plus"></el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 结果列表 -->
    <el-card>
      <el-table :data="dataList" style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            <!-- (pageNo-1)*pageSize+index+1 -->
            {{(searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-form-item label="sex" prop="sex">
          <el-select style="width:150px; margin-left: 47px;" v-model="dataList.sex" placeholder="Select Sex">
            <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Vegetarian" prop="isVegetarian">
          <el-select style="width:150px;" v-model="dataList.isVegetarian" placeholder="Select">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-table-column label="Edit" width="120" >
          <template slot-scope="scope">
            <el-button @click="openEditForm(scope.row.id)" type="primary" icon="el-icon-edit" size="mini" circle></el-button>
            <el-button @click="deleteUser(scope.row)" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 用户信息编辑对话框 -->
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="dataForm" ref="dataFormRef">
        <el-form-item label="data1" prop="data1" :label-width="formLabelWidth">
          <el-input v-model="dataForm.data1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="data2" :label-width="formLabelWidth">
          <el-input v-model="dataForm.data2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="data3" prop="data3" :label-width="formLabelWidth">
          <el-input v-model="dataForm.data3" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="data4" prop="data4" :label-width="formLabelWidth">
          <el-input v-model="dataForm.data4" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="data5" prop="data5" :label-width="formLabelWidth">
          <el-input v-model="dataForm.data5" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="data6" prop="data6" :label-width="formLabelWidth">
          <el-input v-model="dataForm.data6" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="data7" prop="data7" :label-width="formLabelWidth">
          <el-input v-model="dataForm.data7" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="data8" prop="data8" :label-width="formLabelWidth">
          <el-input v-model="dataForm.data9" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="data10" prop="data10" :label-width="formLabelWidth">
          <el-input v-model="dataForm.data10" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="data11" prop="data11" :label-width="formLabelWidth">
          <el-input v-model="dataForm.data11" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="data12" prop="data12" :label-width="formLabelWidth">
          <el-input v-model="dataForm.data12" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="data13" prop="data13" :label-width="formLabelWidth">
          <el-input v-model="dataForm.data13" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import userApi from '@/api/userManage'

export default {
  data() {
    return {
      dataForm: {
        data1: '',
        data2: '',
        data3: '',
        data4: '',
        data5: '',
        data6: '',
        data7: '',
        data8: '',
        data9: '',
        data10: '',
        data11: '',
        data12: ''
      },
      formLabelWidth: '130px',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      // 默认不可见
      dialogFormVisible: false,
      title: 'a',
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      value1: '',
      value2: '',
      dataList: []
    }
  },
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    openEditForm(id) {
      if (id == null) {
        this.title = 'Ask Suggestion'
      } else {
        this.title = 'Edit Suggestion'
        // 根据id查询用户数据
        userApi.getUserById(id).then(response => { // 要修改的地方
          this.userForm = response.data
        })
      }
      this.dialogFormVisible = true
    },
    // 关闭表单的时候清除表单数据和验证信息
    clearForm() {
      this.userForm = {
        roleIdList: []
      }
      this.$refs.userFormRef.clearValidate()
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getUserList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getUserList()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 5px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
