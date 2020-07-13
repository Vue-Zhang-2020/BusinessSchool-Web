<template>
  <div class="box-model-page">
    <el-scrollbar style="height:100%">
      <span class="top-title">专业管理</span>
      <div class="top-control">
        <el-button icon="el-icon-plus" class="blue-btn" @click="showInserModal(0, '', 0)">添加专业</el-button>
      </div>
      <div>
        <el-table
          :data="majorJsonData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="序号"
            width="350">
            <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pagesize + 1}} </span></template>
          </el-table-column>
          <el-table-column
            prop="proname"
            label="专业"
            width="350">
          </el-table-column>
          <el-table-column
            prop="pronum"
            label="人数"
            width="350">
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
      <span>确认删除此专业吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteMajor()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加/编辑专业 -->
    <el-dialog :title="insertOrModifyModel === 0 ? '添加专业' : '编辑专业'" :visible.sync="insertDialog">
      <el-form :model="majorForm" :rules="rules" ref="majorForm">
        <el-form-item label="专业名称：" prop="majorName" :label-width="formLabelWidth">
          <el-input v-model="majorForm.majorName" style="width: 80%" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业人数：" prop="majorPerson" :label-width="formLabelWidth">
          <el-input v-model="majorForm.majorPerson" style="width: 20%" placeholder="请输入" autocomplete="off"></el-input>
          <span>  人</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('majorForm')">确定添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'major',
  data () {
    return {
      schoolId: 0,
      majorJsonData: [], // 专业列表数据
      majorId: '', // 专业Id
      total: 4,
      currentPage: 1,
      pagesize: 5,
      insertOrModifyModel: 0,  // 0 添加 1 编辑
      deleteDialog: false,
      insertDialog: false,
      formLabelWidth: '120px',
      majorForm: {  // 专业表单
        majorId: '',
        majorName: '',
        majorPerson: ''
      },
      rules: { // 专业验证
        majorName: [
          { required: true, message: '请输入专业名称', trigger: 'blur' }
        ],
        majorPerson: [
          { required: true, message: '请输入专业人数', trigger: 'blur' }
        ]
      },
    }
  },
  created() {
    this.schoolId = this.$store.getters.schoolId
    this.requestMajorJsonData()
  },
  methods: {
    handleSizeChange(val) {
      this.requestMajorJsonData()
    },
    handleCurrentChange(val) {
      this.requestMajorJsonData()
    },
    // 显示添加Dialog
    showInserModal(index, row, flag) {
      this.insertOrModifyModel = flag
      if (flag === 1) {
        this.majorForm.majorId = row.id
        this.majorForm.majorName = row.proname
        this.majorForm.majorPerson = row.pronum + ''
      }
      this.insertDialog = true
    },
    // 显示删除Dialog
    showDeleteModal(index, row) {
      this.majorId = row.id
      this.deleteDialog = true
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.insertOrModifyModel === 0) {
            this.insertMajorApi(formName)
          } else {
            this.modifyMajorApi(formName)
          }
        } else {
          return false;
        }
      });
    },
    // 获取专业列表
    requestMajorJsonData() {
      this.$axios.post(this.$global.sApi + '/listpro', JSON.stringify({
        'current_page': this.currentPage,
        'perpage': this.pagesize,
        'scinfoid': this.schoolId
      })).then(res => {
        const json = res.data.data.data
        if (json.length > 0) {
          this.majorJsonData = json
        }
      })
    },
    // 添加专业
    insertMajorApi(formName) {
      this.$axios.post(this.$global.sApi + '/addpro', JSON.stringify({
        'scinfoid': this.schoolId,
        'proname': this.majorForm.majorName,
        'pronum': parseInt(this.majorForm.majorPerson)
      })).then(res => {
        console.log(res)
        this.insertDialog = false
        this.$refs[formName].resetFields();
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.requestMajorJsonData()
      })
    },
    // 编辑专业
    modifyMajorApi(formName) {
      this.$axios.post(this.$global.sApi + '/uppro', JSON.stringify({
        'id': this.majorForm.majorId,
        'proname': this.majorForm.majorName,
        'pronum': parseInt(this.majorForm.majorPerson),
        'type': 1
      })).then(res => {
        console.log(res)
        this.insertDialog = false
        this.majorForm = {}
        this.$refs[formName].resetFields();
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.requestMajorJsonData()
      })
    },
    // 删除专业
    deleteMajor() {
      this.$axios.post(this.$global.sApi + '/uppro', JSON.stringify({
        'id': this.majorId,
        'type': 2
      })).then(res => {
        this.deleteDialog = false
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.requestMajorJsonData()
      })
    }
  }
}
</script>

<style scoped>

</style>