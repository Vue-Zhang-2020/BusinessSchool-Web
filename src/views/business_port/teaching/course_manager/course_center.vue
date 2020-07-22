<template>
  <div>
    <div v-if="insertOrModifyModal" class="business-model-all-page" :visible.sync="loading"
      v-loading="loading"
      element-loading-text="拼命上传中...">
      <el-scrollbar style="height:100%">
        <span class="top-title">{{modifyTitle === 0 ? '添加新课程' : '编辑课程'}}</span>
        <div class="business-model-box">
          <span>课程信息</span>
        </div>
        <el-form v-if="modifyTitle === 1" :model="courseForm" :rules="rules" ref="modifyCourseForm">
          <el-form-item label="课程名称：" prop="courseName" :label-width="formLabelWidth">
            <el-input v-model="courseForm.courseName" style="width: 20%" placeholder="请输入" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="课程分类：" prop="courseType" :label-width="formLabelWidth">
            <el-select v-model="courseForm.courseType" placeholder="全部">
              <el-option  
                v-for="item in courseType" 
                :key="item.id"
                :label="item.typename"
                :value="item.id">
              </el-option>  
            </el-select>
          </el-form-item>
          <el-form-item label="课程封面：" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              action
              :show-file-list="false"
              multiple
              :http-request="uploadImg">
              <img v-if="courseForm.courseImg" :src="courseForm.courseImg" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>      
            <p class="teachingPlanDesc">建议图片长宽比为2 : 1，建议200*100，支持jpg、jpeg、png格式，图片大小不超过2M</p>
          </el-form-item>
          <el-form-item label="课程简介：" prop="courseDesc" :label-width="formLabelWidth">
            <el-input type="textarea" maxlength="500" show-word-limit v-model="courseForm.courseDesc" style="width: 60%; min-height: 160px;" :rows="8"></el-input>
          </el-form-item>
          <div class="business-model-box">
            <span>其他设置</span>
          </div>
          <el-form-item label="一个课程完成积分：" prop="courseIntegral" :label-width="formLabelWidth">
            <div>
              <el-input v-model="courseForm.courseIntegral" style="width: 10%; margin: 0 8px;" placeholder="请输入" autocomplete="off"></el-input>
              <span class="title-desc title-right">积分</span>
              <span style="color: rgba(0,0,0,0.45);font-size: 12px;margin-left:30px">每个课程完成后学员获得得积分奖励</span>
            </div>
          </el-form-item>
        </el-form>
        <el-button v-if="modifyTitle === 1" class="blue-btn-two" style="margin-bottom: 0;" @click="insertOrModifyModal = false">  返回  </el-button>
        <el-button v-if="modifyTitle === 1" class="blue-btn" style="margin-bottom: 0;" @click="submitModify('modifyCourseForm')">  保存  </el-button>
        <el-form v-if="modifyTitle === 0" :model="courseInsertForm" :rules="insertRules" ref="insertCourseForm">
          <el-form-item label="课程名称：" prop="courseName" :label-width="formLabelWidth">
            <el-input v-model="courseInsertForm.courseName" style="width: 20%" placeholder="请输入" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="选择学校：" prop="courseSchool" :label-width="formLabelWidth">
            <el-select v-model="courseInsertForm.courseSchool" placeholder="全部">
              <el-option
                v-for="item in studentJsonData"
                :key="item.id"
                :label="item.scname"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程时长：" prop="courseTime" :label-width="formLabelWidth">
            <el-input v-model="courseInsertForm.courseTime" style="width: 20%" placeholder="请输入" autocomplete="off"></el-input>
            <span>分钟</span>
          </el-form-item>
          <el-form-item label="课程封面：" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              action
              :show-file-list="false"
              multiple
              :http-request="uploadImgInsert">
              <img v-if="courseInsertForm.courseImg" :src="courseInsertForm.courseImg" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>        
            <p class="teachingPlanDesc">建议图片长宽比为2 : 1，建议200*100，支持jpg、jpeg、png格式，图片大小不超过2M</p>
          </el-form-item>
          <el-form-item label="课程简介：" prop="courseDesc" :label-width="formLabelWidth">
            <el-input type="textarea" maxlength="500" show-word-limit v-model="courseInsertForm.courseDesc" style="width: 60%; min-height: 160px;" :rows="8"></el-input>
          </el-form-item>
        </el-form>
        <el-button v-if="modifyTitle === 0" class="blue-btn-two" style="margin-bottom: 0;" @click="insertOrModifyModal = false">  返回  </el-button>
        <el-button v-if="modifyTitle === 0" class="blue-btn" style="margin-bottom: 0;" @click="submitInsert('insertCourseForm')">  保存  </el-button>
      </el-scrollbar>
    </div>
    <div v-if="!insertOrModifyModal" class="business-course-all-page">
      <el-scrollbar style="height:100%">
        <div class="business-course-title">
          <span class="top-title">课程中心</span>
          <div class="top-control" style="margin-top: 0;">
            <el-row style="margin-top: 16px; margin-bottom: 24px;">
              <el-col class="row" :span="12">
                <el-button icon="el-icon-plus" class="blue-btn" style="margin-bottom: 0;" @click="showInserModal(0, '')">添加新的课程</el-button>
              </el-col>
              <el-col class="row" style="justify-content: flex-end;" :span="12">
                <el-input v-model="courseSearch" style="width: 50%" placeholder="请输入要搜索的内容"></el-input>
                <el-button class="search-btn" @click="searchCourse">搜索</el-button>
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
          <div v-for="(course, index) in courseJsonData" :key="index" class="business-course-item">
            <div class="business-course-img-box">
              <img :src="course.header" width="200" height="200" style="height: 160px" alt="">
            </div>
            <div class="business-course-title-box">
              <span>{{ course.coursename }}</span>
            </div>
            <div class="business-course-bottom">
              <div class="modify-box" @click="showInserModal(1, course)">
                <img src="../../../../assets/page/modify.png" alt="">
              </div>
              <div class="course_line"></div>
              <div class="delete-box" @click="showDeleteModal(course)">
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
        <el-button type="primary" @click="deleteCourse">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示 -->
    <el-dialog
      title="提示"
      :visible.sync="affirmDeleteDialog"
      width="40%">
      <span>确定要删除此课程吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="affirmDeleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="affirmDeleteCourse">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 关闭提示 -->
    <el-dialog
      title="提示"
      :visible.sync="successDialog"
      width="40%">
      <span>保存成功！</span>
      <p style="color: rgba(0,0,0,0.45);font-size: 12px;">{{count}}s后跳转到课程中心页面</p> 
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
      total: 0,
      currentPage: 1,
      pagesize: 8,
      courseSearch: '', // 课程搜索
      courseStatus: '全部', // 课程状态
      insertOrModifyModal: false,
      deleteDialog: false,
      modifyDialog: false,
      affirmDeleteDialog: false,
      loading: false,
      successDialog: false,
      modifyTitle: 0, // 0 添加 1 修改
      formLabelWidth: '150px',
      count: 3,
      courseJsonData: [],
      studentJsonData: [],
      deleteCourseId: '',
      courseType: [],
      courseForm: {
        courseId: '',
        courseName: '',
        courseType: '',
        courseImg: '',
        courseDesc: '',
        courseTime: '',
        courseIntegral: ''
      },
      courseInsertForm: {
        courseName: '',
        courseSchool: '',
        courseTime: '',
        courseImg: '',
        courseDesc: ''
      },
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        courseType: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ],
        courseIntegral: [
          { required: true, message: '请输入完成积分', trigger: 'blur' }
        ]
      },
      insertRules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        courseSchool: [
          { required: true, message: '请选择学校', trigger: 'change' }
        ],
        courseTime: [
          { required: true, message: '请输入课程时长', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    insertOrModifyModal(val) {
      if (!val) {
        this.requestCourseJsonData()
      }
    }
  },
  created() {
    if (this.$route.query.type !== 'undefined' && this.$route.query.type === 1) {
      this.requestSchoolJsonData()
      this.insertOrModifyModal = true
    }
    this.requestCourseJsonData()
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val
      this.requestCourseJsonData() 
    },
    handleCurrentChange(val) {
      this.requestCourseJsonData()
    },
    // 搜索
    searchCourse() {
      this.$axios.post(this.$global.sApi + '/course', JSON.stringify({
        'type': 5,
        'coursename': this.courseSearch
      })).then(res => {
        this.courseJsonData = res.data.data[0]
      })
    },
    toList() {
      this.successDialog = false
      this.insertOrModifyModal = false
    },
    // 显示删除Dialog
    showDeleteModal(obj) {
      if (obj.status == '2') {
        this.deleteDialog = true
      } else {
        this.deleteCourseId = parseInt(obj.id)
        this.affirmDeleteDialog = true
      }
    },
    affirmDeleteCourse() {
      this.$axios.post(this.$global.sApi + '/course', JSON.stringify({
        'type': 3,
        'id': this.deleteCourseId
      })).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.affirmDeleteDialog = false
        this.requestCourseJsonData()
      })
    },
    // 显示添加课程Dialog
    showInserModal(flag, obj) {
      if (flag === 1) {
        this.checkStatus(obj)
        this.modifyTitle = flag
      } else {
        this.requestSchoolJsonData()
        this.modifyTitle = flag
        this.insertOrModifyModal = true
      }
    },
    checkStatus(obj) {
      this.$axios.post(this.$global.sApi + '/typeres', JSON.stringify({
        'type': 'course',
        'courseid': obj.id
      })).then(res => {
        this.requestCouseTypeJsonData()
        this.modifyDialog = true
        this.courseForm.courseId = obj.id
        this.courseForm.courseName = obj.coursename
        this.courseForm.courseType = obj.typename
        this.courseForm.courseImg = obj.header
        this.courseForm.courseDesc = obj.brief
        this.courseForm.courseIntegral = obj.points
        this.courseForm.courseTime = obj.length
        if (!res.data.msg) { 
          this.modifyDialog = true
        } else {
          this.modifyCourse()
        }
      })
    },
    statusChange(e) {
      if (e === '全部') {
        this.requestCourseJsonData()
      } else {
        switch (e) {
          case '进行中':
            this.requestCourseStatusJsonData(2)
            break;
          case '未开始':
            this.requestCourseStatusJsonData(1)
            break;
          case '已结束':
            this.requestCourseStatusJsonData(3)
            break;
        }
      }
    },
    // 删除课程
    deleteCourse() {
      this.$axios.post(this.$global.sApi + '/course', JSON.stringify({
        'id': parseInt(this.deleteCourseId)
      })).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.requestCourseJsonData()
      })
    }, 
    // 获取学校信息
    requestSchoolJsonData() {
      this.$axios.post(this.$global.sApi + '/addscuser', JSON.stringify({
        'type': 3,
        'current_page': 1,
        'perpage': 9999
      })).then(res => {
        this.studentJsonData = res.data.data.data
      })
    },
    // 获取课程类型
    requestCouseTypeJsonData() {
      this.$axios.post(this.$global.sApi + '/addtype', JSON.stringify({
        'type': 4
      })).then(res => {
        this.courseType = res.data.data[0]
      })
    },
    // 获取课程列表
    requestCourseJsonData() {
      this.$axios.post(this.$global.sApi + '/course', JSON.stringify({
        'type': 4,
        'current_page': this.currentPage,
        'perpage': this.pagesize
      })).then(res => {
        this.courseJsonData = res.data.data.data
        this.total = res.data.data.total
      })
    },
    // 获取课程状态列表
    requestCourseStatusJsonData(status) {
      this.$axios.post(this.$global.sApi + '/course', JSON.stringify({
        'type': 6,
        'status': status
      })).then(res => {
        this.courseJsonData = res.data.data.data
        this.total = res.data.data.total
      })
    },
    // 确认编辑
    modifyCourse() {
      this.modifyTitle = 1
      this.modifyDialog = false
      this.insertOrModifyModal = true
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
          this.courseForm.courseImg = res.data.path
          this.loading = false
        })
      } else {
        this.$message({
          message: fileStatus,
          type: 'error'
        })
      }
    },
    uploadImgInsert (fileObj) {
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
          this.courseInsertForm.courseImg = res.data.path
          this.loading = false
        })
      } else {
        this.$message({
          message: fileStatus,
          type: 'error'
        })
      }
    },
    submitModify(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.modifyCourseApi()
        }
      })
    },
    submitInsert(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.insertCourseApi()
        }
      })
    },
    // 添加课程
    insertCourseApi() {
      this.$axios.post(this.$global.sApi + '/course', JSON.stringify({
        'type': 1,
        'coursename': this.courseInsertForm.courseName,
        'scinfoid': parseInt(this.courseInsertForm.courseSchool),
        'length': parseInt(this.courseInsertForm.courseTime),
        'header': this.courseInsertForm.courseImg,
        'brief': this.courseInsertForm.courseDesc,
        'typename': '暂无'
      })).then(res => {
        this.successDialog = true
        this.countDown()
      })
    },
    // 编辑课程
    modifyCourseApi() {
      this.$axios.post(this.$global.sApi + '/course', JSON.stringify({
        'type': 2,
        'coursename': this.courseForm.courseName,
        'typename': parseInt(this.courseForm.courseType),
        'points': parseInt(this.courseForm.courseIntegral),
        'header': this.courseForm.courseImg == '' ? '暂无' : this.courseForm.courseImg,
        'brief': this.courseForm.courseDesc == '' ? '暂无' : this.courseForm.courseDesc,
        'id': this.courseForm.courseId
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
    }
  }
}
</script>

<style scoped>
  .business-course-img-box {
    height: 160px;
  }
</style>
