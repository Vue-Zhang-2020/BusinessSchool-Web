<template>
  <div>
    <div v-if="insertOrModifyModal" class="business-model-all-page">
      <el-scrollbar style="height:100%">
        <span class="top-title">{{modifyTitle === 0 ? '添加考试' : '编辑考试'}}</span>
        <el-form :model="examForm" :rules="rules" ref="insertExamForm">
          <el-form-item label="考试名称：" prop="examName" :label-width="formLabelWidth">
            <el-input v-model="examForm.examName" style="width: 20%" placeholder="请输入" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="考试封面：" prop="examImg" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              action
              :show-file-list="false"
              multiple
              :http-request="uploadImg">
              <img v-if="examForm.examImg" :src="examForm.examImg" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>     
            <p class="teachingPlanDesc">建议图片长宽比为2 : 1，建议200*100，支持jpg、jpeg、png格式，图片大小不超过2M</p>
          </el-form-item>
          <el-form-item label="考试说明：" prop="examDesc" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="examForm.examDesc" style="width: 60%; min-height: 160px;" :rows="8"></el-input>
          </el-form-item>
          <div class="business-model-box">
            <span>其他设置</span>
          </div>
          <el-form-item label="考试时长：" prop="examTime" :label-width="formLabelWidth">
            <el-input-number :min="1" :step="1" :step-strictly="true" :controls="false" v-model="examForm.examTime" style="width: 20%" placeholder="请输入" autocomplete="off"></el-input-number>
            <span>分钟</span>
          </el-form-item>
          <el-form-item label="等级积分奖励：" prop="courseType" :label-width="formLabelWidth">
            <el-table style="width: 70%" :data="gridData">
              <el-table-column property="title" width="150" label="等级"></el-table-column>
              <el-table-column property="id" label="奖励积分">
                <template slot-scope="scope">
                  <div>
                    <el-input-number :min="1" :step="1" :step-strictly="true" :controls="false" size="small" v-model="examForm.examLevel[scope.$index].integral" style="width: 40%" placeholder="请输入"></el-input-number>
                  </div>
                </template>
              </el-table-column>
              <el-table-column property="desc" label="说明"></el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <el-button class="blue-btn-two" style="margin-bottom: 0;" @click="insertOrModifyModal = false">  返回  </el-button>
        <el-button class="blue-btn" style="margin-bottom: 0;" @click="submitInsert('insertExamForm')">  保存  </el-button>
      </el-scrollbar>
    </div>
    <div v-if="!insertOrModifyModal" class="business-course-all-page">
      <el-scrollbar style="height:100%">
        <div class="business-course-title">
          <span class="top-title">考试中心</span>
          <div class="top-control" style="margin-top: 0;">
            <el-row style="margin-top: 16px; margin-bottom: 24px;">
              <el-col class="row" :span="12">
                <el-button icon="el-icon-plus" class="blue-btn" style="margin-bottom: 0;" @click="showInserModal(0, '')">添加新的考试</el-button>
              </el-col>
              <el-col class="row" style="justify-content: flex-end;" :span="12">
                <el-input v-model="examSearch" style="width: 50%" placeholder="请输入要搜索的内容"></el-input>
                <el-button class="search-btn" @click="searchExam">搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="business-course-status">
          <span>状态：</span>
          <el-radio-group v-model="courseStatus" @change="statusChange" fill="#6A6FCB" size="small">
            <el-radio-button name="0" label="全部"></el-radio-button>
            <el-radio-button name="0" label="进行中"></el-radio-button>
            <el-radio-button name="0" label="未开始"></el-radio-button>
            <el-radio-button name="0" label="已结束"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="business-course-box">
          <div v-for="(exam, index) in examJsonData" :key="index" class="business-course-item">
            <div class="business-course-img-box">
              <img :src="exam.testheader" alt="">
            </div>
            <div class="business-course-title-box">
              <span>{{ exam.testname }}</span>
            </div>
            <div class="business-course-bottom">
              <div class="modify-box" @click="showInserModal(1, exam)">
                <img src="../../../../assets/page/modify.png" alt="">
              </div>
              <div class="course_line"></div>
              <div class="delete-box" @click="showDeleteModal(exam)">
                <img src="../../../../assets/page/delete.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[8, 12, 16, 20]"
        :page-size='pagesize'
        layout="sizes, prev, pager, next"
        :total="total"
        class="marginT22">
      </el-pagination>
    </div>
    <!-- 编辑提示 -->
    <el-dialog
      title="提示"
      :visible.sync="modifyDialog"
      width="40%">
      <span>该课程已经加入教学计划，编辑会改变教学计划的课程内容</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialog = false">取 消</el-button>
        <el-button type="primary" @click="modifyCourse()">确认编辑</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialog"
      width="40%">
      <span>此课程已加入到教学计划，不能删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteDialog = false">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示 -->
    <el-dialog
      title="提示"
      :visible.sync="affirmDeleteDialog"
      width="40%">
      <span>确定要删除此考试吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="affirmDeleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="affirmDeleteExam">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 关闭提示 -->
    <el-dialog
      title="提示"
      :visible.sync="successDialog"
      width="40%">
      <span>保存成功！</span>
      <p style="color: rgba(0,0,0,0.45);font-size: 12px;">{{count}}s后跳转到考试中心页面</p> 
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="successDialog = false">取 消</el-button>
        <el-button type="primary" @click="toList">确 认</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      gridData: [
        {
          id: '1',
          title: 'A',
          desc: 'A级：90分以上（包含90)'
        }, 
        {
          id: '2', 
          title: 'B',
          desc: 'B级：80-90（包含80）'
        }, 
        {
          id: '3',
          title: 'C',
          desc: 'C级：70-80（包含70）'
        }, 
        {
          id: '4',
          title: 'D',
          desc: 'D级：60-70（包含60）'
        },
        {
          id: '5',
          title: 'E',
          desc: 'E级：60以下（不包含60）'
        }
      ],
      total: 0,
      deleteExamId: 0,
      currentPage: 1,
      pagesize: 8,
      status: 0,
      examSearch: '', // 考试搜索
      courseStatus: '全部', // 课程状态
      insertOrModifyModal: false,
      deleteDialog: false,
      modifyDialog: false,
      successDialog: false,
      affirmDeleteDialog: false,
      modifyTitle: 0, // 0 添加 1 修改
      formLabelWidth: '150px',
      count: 3,
      examJsonData: [],
      examForm: {
        examId: '',
        examName: '',
        examImg: '',
        examDesc: '',
        examTime: '',
        examLevel: [
          { integral: '' },
          { integral: '' },
          { integral: '' },
          { integral: '' },
          { integral: '' }
        ]
      },
      rules: {
        examName: [
          { required: true, message: '请输入考试名称', trigger: 'blur' }
        ],
        examImg: [
          { required: true, message: '请上传考试封面', trigger: 'blur' }
        ],
        examTime: [
          { required: true, message: '请输入考试时长', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    insertOrModifyModal(val) {
      if (!val) {
        this.requestExamJsonData()
        this.examForm.examId = ''
        this.examForm.examName = ''
        this.examForm.examImg = ''
        this.examForm.examDesc = ''
        this.examForm.examTime = ''
        this.examForm.examLevel[0].integral = ''
        this.examForm.examLevel[1].integral = ''
        this.examForm.examLevel[2].integral = ''
        this.examForm.examLevel[3].integral = ''
        this.examForm.examLevel[4].integral = ''
      }
    }
  },
  created() {
    this.requestExamJsonData()
    if (this.$route.query.type !== 'undefined' && this.$route.query.type === 1) {
      this.insertOrModifyModal = true
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val
      this.requestExamJsonData()
    },
    handleCurrentChange(val) {
      this.requestExamJsonData()
    },
    // 显示删除Dialog
    showDeleteModal(exam) {
      if (exam.status == '2') {
        this.deleteDialog = true
      } else {
        this.deleteExamId = parseInt(exam.id)
        this.affirmDeleteDialog = true
      }
    },
    affirmDeleteExam() {
      this.$axios.post(this.$global.sApi + '/addtest', JSON.stringify({
        'type': 3,
        'id': this.deleteExamId
      })).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.affirmDeleteDialog = false
        this.requestExamJsonData()
      })
    },
    // 显示添加课程Dialog
    showInserModal(flag, obj) {
      if (flag === 1) {
        this.checkStatus(obj)
        this.modifyTitle = flag
      } else {
        this.modifyTitle = flag
        this.insertOrModifyModal = true
      }
    },
    checkStatus(obj) {
      this.$axios.post(this.$global.sApi + '/typeres', JSON.stringify({
        'type': 'test',
        'testid': obj.id
      })).then(res => {
        this.examForm.examId = obj.id
        this.examForm.examName = obj.testname
        this.examForm.examImg = obj.testheader
        this.examForm.examDesc = obj.brief
        this.examForm.examTime = obj.length
        this.examForm.examLevel[0].integral = obj.pointss[0]
        this.examForm.examLevel[1].integral = obj.pointss[1]
        this.examForm.examLevel[2].integral = obj.pointss[2]
        this.examForm.examLevel[3].integral = obj.pointss[3]
        this.examForm.examLevel[4].integral = obj.pointss[4]
        if (!res.data.msg) { 
          this.modifyDialog = true
        } else {
          this.modifyCourse()
        }
      })
    },
    searchExam() {
      this.requestExamJsonData()
    },
    // 获取考试列表
    requestExamJsonData() {
      this.$axios.post(this.$global.sApi + '/addtest', JSON.stringify({
        'type': 4,
        'current_page': this.currentPage,
        'perpage': this.pagesize,
        'status': this.status,
        'testname': this.examSearch
      })).then(res => {
        this.examJsonData = res.data.data.data
        this.total = res.data.data.total
      })
    },
    // 确认编辑
    modifyCourse() {
      this.modifyTitle = 1
      this.modifyDialog = false
      this.insertOrModifyModal = true
    },
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
          this.examForm.examImg = res.data.path
          this.loading = false
        })
      } else {
        this.$message({
          message: fileStatus,
          type: 'error'
        })
      }
    },
    submitInsert(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.modifyTitle === 0) {
            this.insertExamApi()
          } else {
            this.modifyExamApi()
          }
        }
      })
    },
    statusChange(e) {
      if (e === '全部') {
        this.status = 0
        this.requestExamJsonData()
      } else {
        switch (e) {
          case '进行中':
            this.status = 2
            this.requestExamJsonData()
            break;
          case '未开始':
            this.status = 1
            this.requestExamJsonData()
            break;
          case '已结束':
            this.status = 3
            this.requestExamJsonData()
            break;
        }
      }
    },
    // 添加考试
    insertExamApi() {
      var integrals = ''
      this.examForm.examLevel.forEach(element => {
        integrals += element.integral + ','
      });
      this.$axios.post(this.$global.sApi + '/addtest', JSON.stringify({
        'type': 1,
        'testname': this.examForm.examName,
        'testheader': this.examForm.examImg,
        'brief': this.examForm.examDesc,
        'testtime': parseInt(this.examForm.examTime),
        'points': integrals.substring(0, integrals.length - 1)
      })).then(res => {
        this.successDialog = true
        this.countDown()
      })
    },
    // 编辑考试
    modifyExamApi() {
      var integrals = ''
      this.examForm.examLevel.forEach(element => {
        integrals += element.integral + ','
      });
      this.$axios.post(this.$global.sApi + '/addtest', JSON.stringify({
        'type': 2,
        'id': parseInt(this.examForm.examId),
        'testname': this.examForm.examName,
        'testheader': this.examForm.examImg,
        'brief': this.examForm.examDesc == '' ? '暂无' : this.examForm.examDesc,
        'testtime': this.examForm.examTime == '' ? '暂无' : this.examForm.examTime,
        'points': integrals.substring(0, integrals.length - 1)
      })).then(res => {
        this.successDialog = true
        this.countDown()
      })
    },
    countDown() {
      const TIME_COUNT = 3;
      if(!this.timer){
        this.count = TIME_COUNT;
        this.timer = setInterval(()=>{
        if(this.count > 0 && this.count <= TIME_COUNT){
          this.count--;
        }else{
          clearInterval(this.timer);
          this.timer = null;
          this.insertOrModifyModal = false
          this.successDialog = false
        }
        },1000)
      }
    },
    toList() {
      this.insertOrModifyModal = false
      this.successDialog = false
    }
  }
}
</script>

<style scoped>

</style>
