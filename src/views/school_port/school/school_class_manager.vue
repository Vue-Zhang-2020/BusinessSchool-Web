<template>
  <div class="box-model-page">
    <el-scrollbar style="height:100%">
      <span class="top-title">班级管理</span>
      <div class="top-control">
        <el-button icon="el-icon-plus" class="blue-btn" @click="showInserModal(0, '', 0)">添加班级</el-button>
      </div>
      <div>
        <el-table
          :data="classesJsonData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="序号"
            width="250">
            <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pagesize + 1}} </span></template>
          </el-table-column>
          <el-table-column
            prop="proname"
            label="专业"
            width="250">
          </el-table-column>
          <el-table-column
            prop="classname"
            label="班级"
            width="250">
          </el-table-column>
          <el-table-column
            prop="classnum"
            label="人数"
            width="250">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope"> 
              <div class="contrl-box">
                <span class="control-span" @click="showInserModal(scope.$index, scope.row, 1)">编辑</span>
                <div class="h_line"></div>
                <span class="control-span" @click="showDeleteModal(scope.$index, scope.row)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-scrollbar>
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
      <span>确认删除此班级吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteClasses()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加/编辑班级 -->
    <el-dialog :title="insertOrModifyModel == 0 ? '添加班级' : '编辑班级'" :visible.sync="insertDialog">
      <el-form :model="classForm" :rules="rules" ref="classForm">
        <el-form-item label="班级名称：" prop="className" :label-width="formLabelWidth">
          <el-input v-model="classForm.className" style="width: 80%" maxlength="40" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级专业：" prop="classMajor" :label-width="formLabelWidth">
          <el-select v-model="classForm.classMajor" placeholder="请选择">
            <el-option
              v-for="item in majorOptions"
              :key="item.id"
              :label="item.proname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级人数：" prop="classPerson" :label-width="formLabelWidth">
          <el-input-number :min="1" :step="1" :step-strictly="true" :max="9999" :controls="false" v-model="classForm.classPerson" type="number" maxlength="4" style="width: 20%" placeholder="请输入" autocomplete="off"></el-input-number>
          <span>  人</span>
        </el-form-item>
      </el-form>  
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('classForm')">{{ insertOrModifyModel == 0 ? '确认添加' : '确认编辑' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'major',
  data () {
    return {
      schoolId: 0, // 学校Id
      calssesId: 0, // 班级Id
      classesJsonData: [], // 班级列表数据
      majorOptions: [],  // 专业下拉框
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
      total: 0,
      currentPage: 1,
      pagesize: 5,
      deleteDialog: false,
      insertDialog: false,
      insertOrModifyModel: 0,  // 0 添加 1 编辑
      formLabelWidth: '120px',
      classForm: {
        classId: '',
        className: '',
        classMajor: '',
        classPerson: ''
      },
      rules: {
        className: [
          { required: true, message: '请输入班级名称', trigger: 'blur' }
        ],
        classMajor: [
          { required: true, message: '请选择班级专业', trigger: 'change' }
        ],
        classPerson: [
          { required: true, message: '请输入班级人数', trigger: 'blur' }
        ]
      },
    }
  },
  created() {
    this.schoolId = this.$store.getters.schoolId
    this.requestClassesJsonData()
  },
  watch: {
    insertDialog(val) {
      if (!val) {
        this.$refs.classForm.resetFields();
        this.classForm = {
          classId: '',
          className: '',
          classMajor: '',
          classPerson: ''
        }
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val
      this.requestClassesJsonData()
    },
    handleCurrentChange(val) {
      this.requestClassesJsonData()
    },
    // 显示添加Dialog
    showInserModal(index, row, flag) {
      this.insertOrModifyModel = flag
      this.requestMajorJsonData()
      if (flag === 1) {
        this.classForm.classId = row.id
        this.classForm.className = row.classname
        this.classForm.classMajor = row.proname
        this.classForm.classPerson = row.classnum
      }
      this.insertDialog = true
    },
    // 显示删除Dialog
    showDeleteModal(index, row) {
      this.calssesId = row.id
      this.deleteDialog = true
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.insertOrModifyModel === 0) {
            this.insertClassesApi(formName)
          } else {
            this.modifyClassesApi(formName)
          }
        } else {
          return false;
        }
      });
    },
    // 获取班级列表
    requestClassesJsonData() {
      this.$axios.post(this.$global.sApi + '/listclass', JSON.stringify({
        'current_page': this.currentPage,
        'perpage': this.pagesize,
        'scinfoid': this.schoolId
      })).then(res => {
        const json = res.data.data.data
        this.total = res.data.data.total
        this.classesJsonData = json
      })
    },
    // 添加班级
    insertClassesApi(formName) {
      this.$axios.post(this.$global.sApi + '/addclass', JSON.stringify({
        'scinfoid': this.schoolId,
        'classname': this.classForm.className,
        'classnum': parseInt(this.classForm.classPerson),
        'proinfoid': parseInt(this.classForm.classMajor),
        'type': 1
      })).then(res => {
        this.insertDialog = false
        this.$refs[formName].resetFields();
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.requestClassesJsonData()
      })
    },
    // 编辑班级
    modifyClassesApi(formName) {
      this.$axios.post(this.$global.sApi + '/uppro', JSON.stringify({
        'classid': this.classForm.classId,
        'classname': this.classForm.className,
        'classnum': parseInt(this.classForm.classPerson),
        'proname': parseInt(this.classForm.classMajor),
        'type': 3
      })).then(res => {
        console.log(res)
        this.insertDialog = false
        this.classForm = {}
        this.$refs[formName].resetFields();
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.requestClassesJsonData()
      })
    },
    // 删除班级
    deleteClasses() {
      this.$axios.post(this.$global.sApi + '/addclass', JSON.stringify({
        'classid': this.calssesId,
        'type': 3
      })).then(res => {
        this.deleteDialog = false
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.requestClassesJsonData()
      })
    },
    // 获取专业列表
    requestMajorJsonData() {
      this.$axios.post(this.$global.sApi + '/prolistall', JSON.stringify({
        'scinfoid': this.schoolId
      })).then(res => {
        const json = res.data.data[0]
        this.majorOptions = json
      })
    }
  }
}
</script>

<style scoped>

</style>