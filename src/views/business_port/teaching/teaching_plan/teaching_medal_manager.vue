<template>
  <div class="business-model-all-page">
    <el-scrollbar style="height:100%">
      <span class="top-title">勋章管理</span>
      <div class="top-control" style="margin-top: 0;">
        <el-row style="margin-top: 16px; margin-bottom: 24px;">
          <el-col class="row" :span="12">
            <el-button icon="el-icon-plus" class="blue-btn" style="margin-bottom: 0;" @click="showInserModal(0, '', 0)">添加勋章</el-button>
          </el-col>
          <el-col class="row" style="justify-content: flex-end;" :span="12">
            <el-input v-model="medalSearch" style="width: 50%" placeholder="请输入要搜索的内容"></el-input>
            <el-button class="search-btn" @click="searchMedal">搜索</el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-table
          :data="medalJsonData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="序号"
            width="80">
            <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pagesize + 1}} </span></template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="勋章名称"
            width="350">
          </el-table-column>
          <el-table-column
            prop="head"
            label="勋章图片"
            width="350">
            <template slot-scope="scope">
              <img width="48" height="70" :src="scope.row.head" alt="">
            </template>
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
    <!-- 添加/编辑 勋章 -->
    <el-dialog :title="insertOrModifyModel === 0 ? '添加勋章' : '编辑勋章'" width="40%" :visible.sync="insertOrModifyDialog">
      <el-form :model="medalForm" ref="medalForm">
        <el-form-item label="勋章名称：" prop="medalName" :label-width="formLabelWidth">
          <el-input v-model="medalForm.medalName" style="width: 37%" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="勋章图片：" prop="medalImg" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action
            :show-file-list="false"
            multiple
            :http-request="uploadImg">
            <img v-if="medalForm.medalImg" :src="medalForm.medalImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertSingleStudentInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('medalForm')">确定添加</el-button>
      </div>
    </el-dialog>
    <!-- 删除提示 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialog"
      width="40%">
      <span>确认删除此勋章吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteMedal()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      total: 4,
      currentPage: 1,
      pagesize: 5,
      deleteMedalId: '',
      medalSearch: '',
      formLabelWidth: '120px',
      insertOrModifyModel: 0, // 0 新增 1 编辑
      insertOrModifyDialog: false,
      deleteDialog: false,
      medalJsonData: [],
      medalForm: {
        medalId: '',
        medalName: '',
        medalImg: ''
      },
      gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
    }
  },
  created() {
    this.requestMedalJsonData()
  },
  methods: {
    handleSizeChange(val) {
      
    },
    handleCurrentChange(val) {
      
    },
    // 搜索
    searchMedal() {
      this.requestSearchMedalJsonData()
    },
    showDeleteModal(index, row) {
      this.deleteMedalId = row.id
      this.deleteDialog = true
    },
    showInserModal(index, row, flag) {
      this.insertOrModifyModel = flag
      if (this.insertOrModifyModel === 1) {
        this.medalForm.medalId = row.id
        this.medalForm.medalName = row.name
        this.medalForm.medalImg = row.head
      }
      this.insertOrModifyDialog = true
    },
    // 列表
    requestMedalJsonData() {
      this.$axios.post(this.$global.sApi + '/addexz', JSON.stringify({
        'type': 4,
        'current_page': this.currentPage,
        'perpage': this.pagesize
      })).then(res => {
        this.total = res.data.data.total
        this.medalJsonData = res.data.data.data
      })
    },
    // 搜索
    requestSearchMedalJsonData() {
      this.$axios.post(this.$global.sApi + '/addexz', JSON.stringify({
        'type': 5,
        'xzname': this.medalSearch
      })).then(res => {
        console.log(res.data.data[0])
        this.total = res.data.data.total
        this.medalJsonData = res.data.data[0]
      })
    },
    // 前端校验文件上传是否符合条件
    file_info_check (file) {
      var ret = ''
      if (file === undefined) {
        ret = ''
      }
      // eslint-disable-next-line camelcase
      var max_file_size = 2 * 1024 * 1024
      // eslint-disable-next-line camelcase
      if (file.size > max_file_size) {
        ret = '文件不能大于2Mb'
      }
      var typeJpg = '.jpg'
      var typeJpeg = '.jpeg'
      var typePng = '.png'
      if (file.name.indexOf(typeJpg) === -1) {
        ret = '文件格式要求是.jpg/.jpeg/.png'
      } else {
        ret = 'success'
        return ret
      }
      if (file.name.indexOf(typeJpeg) === -1) {
        ret = '文件格式要求是.jpg/.jpeg/.png'
      } else {
        ret = 'success'
        return ret
      }
      if (file.name.indexOf(typePng) === -1) {
        ret = '文件格式要求是.jpg/.jpeg/.png'
      } else {
        ret = 'success'
        return ret
      }
      return ret
    },
    uploadImg (fileObj) {
      this.loading = true
      let fileStatus = this.file_info_check(fileObj.file)
      if (fileStatus === 'success') {
        let formData = new FormData()
        formData.append('file', fileObj.file)
        this.$axios.post('/upschead', formData, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }).then(res => {
          // this.registerForm.imageUrl = res
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.medalForm.medalImg = res.data.path
          this.loading = false
        })
      } else {
        this.$message({
          message: fileStatus,
          type: 'error'
        })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.insertOrModifyModel === 0) {
            this.insertMedal(formName)
          } else {
            this.modifyMedal(formName)
          }
        }
      })
    },
    // 添加勋章
    insertMedal(formName) {
      this.$axios.post(this.$global.sApi + '/addexz', JSON.stringify({
        'type': 1,
        'head': this.medalForm.medalImg,
        'name': this.medalForm.medalName
      })).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.insertOrModifyDialog = false
        this.$refs[formName].resetFields();
        this.requestMedalJsonData()
      })
    },
    // 编辑勋章
    modifyMedal() {
      this.$axios.post(this.$global.sApi + '/addexz', JSON.stringify({
        'type': 2,
        'id': parseInt(this.medalForm.medalId),
        'head': this.medalForm.medalImg,
        'name': this.medalForm.medalName
      })).then(res => {
        this.requestMedalJsonData()
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.insertOrModifyDialog = false
        this.medalForm = {}
        this.$refs[formName].resetFields();
      })
    },
    // 删除勋章
    deleteMedal() {
      this.$axios.post(this.$global.sApi + '/addexz', JSON.stringify({
        'type': 3,
        'id': parseInt(this.deleteMedalId)
      })).then(res => {
        this.requestMedalJsonData()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.deleteDialog = false
      })
    }
  }
}
</script>

<style scoped>

</style>
