<template>
  <div>
    <!-- 搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="23">
          <el-input v-model="searchModel.roleName" placeholder="rolename"></el-input>
          <el-button icon="el-icon-search" round type="success" @click="getRoleList">Search</el-button>
        </el-col>
        <el-col :span="1">
          <el-button @click="openEditForm(null)" type="primary" icon="el-icon-plus"></el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 结果列表 -->
    <el-card>         <!-- 表格绑定的数据 roleList-->
      <el-table :data="roleList" style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            <!-- (pageNo-1)*pageSize+index+1 -->
            {{(searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>  <!-- 这个和后端对接-->
        <el-table-column prop="roleId" label="Role Id" width="200">
        </el-table-column>
        <el-table-column prop="roleName" label="Role Name" width="260">
        </el-table-column>
        <el-table-column prop="roleDesc" label="Description">
        </el-table-column>
        <el-table-column label="Edit" width="180">
          <template slot-scope="scope">
            <el-button @click="openEditForm(scope.row.roleId)" type="primary" icon="el-icon-edit" size="mini" circle></el-button>
            <el-button @click="deleteRole(scope.row)" type="danger" icon="el-icon-delete" size="mini" circle></el-button>
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

    <!-- 角色信息编辑对话框 -->
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="roleForm" ref="roleFormRef" :rules="rules">
        <el-form-item label="Role Name" prop="roleName" :label-width="formLabelWidth">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Role Description" prop="roleDesc" :label-width="formLabelWidth">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Permission" prop="menuIdList" :label-width="formLabelWidth">
          <el-tree :data="menuList" :props="menuProps" show-checkbox default-expand-all node-key="menuId" ref="menuRef" style="width: 85%">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveRole">Yes</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleApi from '@/api/roleManage'
import menuApi from '@/api/menuManage'
export default {
  data() {
    return {
      menuList: [],
      menuProps: {
        children: 'children',
        label: 'title'
      },
      formLabelWidth: '140px',
      roleForm: {},
      // 默认不可见
      dialogFormVisible: false,
      title: 'a',
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      roleList: [],
      rules: {
        roleName: [
          { required: true, message: 'Please type role name.', trigger: 'blur' },
          { min: 3, max: 12, message: '3 to 20 characters in length', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: 'Please type role description.', trigger: 'blur' },
          { min: 3, max: 12, message: '3 to 20 characters in length', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getAllMenu() {
      menuApi.getAllMenu().then(response => {
        this.menuList = response.data
      })
    },
    deleteRole(role) {
      this.$confirm('Are you sure to delete this data?', 'Reminder', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        roleApi.deleteRoleById(role.roleId).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          // 删除完成刷新数据
          this.getRoleList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Undeleted'
        })
      })
    },
    saveRole() {
      // 先触发表单验证
      this.$refs.roleFormRef.validate((valid) => {
        if (valid) {
          let checkedKeys = this.$refs.menuRef.getCheckedKeys()
          let halfCheckedKeys = this.$refs.menuRef.getHalfCheckedKeys()
          this.roleForm.menuIdList = checkedKeys.concat(halfCheckedKeys)
          // 提交请求给后台
          roleApi.saveRole(this.roleForm).then(response => {
            // 成功提示
            this.$message({
              message: response.message,
              type: 'success'
            })
            // 关闭对话框
            this.dialogFormVisible = false
            // 刷新表格
            this.getRoleList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭表单的时候清除表单数据和验证信息
    clearForm() {
      this.roleForm = {}
      this.$refs.roleFormRef.clearValidate()
      this.$refs.menuRef.setCheckedKeys([])
    },
    openEditForm(id) {
      if (id == null) {
        this.title = 'Add Role'
      } else {
        this.title = 'Edit Role'
        // 根据id查询角色数据
        roleApi.getRoleById(id).then(response => {
          this.roleForm = response.data
          this.$refs.menuRef.setCheckedKeys(response.data.menuIdList)
        })
      }
      this.dialogFormVisible = true
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getRoleList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getRoleList()
    },
    getRoleList() {
      roleApi.getRoleListDefault(this.searchModel).then(response => {
        this.roleList = response.data.rows
        this.total = response.data.total
      })
    }
  },
  created() {
    this.getRoleList()
    this.getAllMenu()
  }
}
</script>

<style>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}
</style>
