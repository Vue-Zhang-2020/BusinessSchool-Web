<template>
  <div class="box-model-page">
    <span class="top-title">班级管理</span>
    <div class="top-control">
      <el-button icon="el-icon-plus" class="blue-btn" @click="showInserModal(0)">添加班级</el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="序号"
          width="250">
          <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pagesize + 1}} </span></template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="专业"
          width="250">
        </el-table-column>
        <el-table-column
          prop="address"
          label="班级"
          width="250">
        </el-table-column>
        <el-table-column
          prop="address"
          label="人数"
          width="250">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope"> 
            <div class="contrl-box">
              <span class="control-span" @click="showInserModal(1)">编辑</span>
              <div class="h_line"></div>
              <span class="control-span" @click="showDeleteModal">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size='pagesize'
      layout="sizes, prev, pager, next"
      :total="total"
      class="marginT22">
    </el-pagination>
    <!-- 删除提示 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialog"
      width="40%">
      <span>确认删除此课程吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加/编辑班级 -->
    <el-dialog :title="insertOrModifyModel == 0 ? '添加班级' : '编辑班级'" :visible.sync="insertDialog">
      <el-form :model="classForm" :rules="rules" ref="classForm">
        <el-form-item label="班级名称：" prop="className" :label-width="formLabelWidth">
          <el-input v-model="classForm.className" style="width: 80%" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级专业：" prop="classMajor" :label-width="formLabelWidth">
          <el-input v-model="classForm.classMajor" style="width: 20%" placeholder="请输入" autocomplete="off"></el-input>
          <span>  人</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('classForm')">确定添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'major',
  data () {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      total: 100,
      currentPage: 1,
      pagesize: 5,
      deleteDialog: false,
      insertDialog: false,
      insertOrModifyModel: 0,
      formLabelWidth: '120px',
      classForm: {
        className: '',
        classMajor: ''
      },
      rules: {
        className: [
          { required: true, message: '请输入班级名称', trigger: 'blur' }
        ],
        classMajor: [
          { required: true, message: '请输入班级专业', trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 显示添加Dialog
    showInserModal() {
      this.insertDialog = true
    },
    // 显示删除Dialog
    showDeleteModal() {
      this.deleteDialog = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.insertDialog = false
          this.$refs[formName].resetFields();
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>

</style>