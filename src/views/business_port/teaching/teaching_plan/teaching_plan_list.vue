<template>
  <div>
    <div v-if="courseTCode" class="business-model-all-page">
      <el-scrollbar style="height:100%">
        <div>
          <span class="top-title">课程二维码</span>
          <p class="top-course">课程：<span>课程名称</span></p>
          <div class="top-tcode-box">
            <img src="../../../../assets/img.jpg" width="432" height="432" alt="">
          </div>
        </div>
      </el-scrollbar>
      <el-button class="blue-btn-two" style="margin-bottom: 0;" @click="tCodeBack">  返回  </el-button>
    </div>
    <div v-if="courseSection" v-loading="loading"
      element-loading-text="拼命上传中...请勿离开当前页面"
      element-loading-spinner="el-icon-loading" class="business-model-all-page">
      <el-scrollbar style="height:100%">
        <div>
          <span class="top-title">课程章节</span>
          <div class="top-control">
            <el-timeline :reverse="reverse">
              <!-- 考试 -->
              <el-timeline-item
                v-for="(activity, index) in planExamSection"
                :key="index">
                <div class="courseItem">
                  <img :src="activity.testheader" width="278" height="160" alt="">
                  <div class="courseItemTile">
                    <span v-if="activity.status == '3'" class="no_start_icon">已结束</span>
                    <span v-if="activity.status == '1'" class="start_icon">未开始</span>
                    <p class="courseItem-title">{{activity.testname}}</p>
                  </div>
                  <div class="course-box">
                    <span class="label-title">监考老师：
                      <span class="value-title">{{activity.persons||'暂无'}}</span>
                    </span>
                  </div>
                  <div class="course-box">
                    <span class="label-title">时&nbsp;&nbsp;&nbsp;间：<span class="value-title">{{activity.testtime}}</span></span>
                  </div>
                  <div class="course-box">
                    <el-upload
                      v-if="activity.mp4 == null"
                      class="avatar-uploader"
                      action
                      :show-file-list="false"
                      multiple
                      :http-request="uploadMp4"
                      >
                      <i class="el-icon-plus avatar-uploader-icon" @click="check(activity.test_info_id, 'test')"></i>
                    </el-upload>  
                    <video ref="vVideo"
                      v-if="activity.mp4 !== null"
                      style="width: 200px; height: 170px;"
                      controls
                      webkit-playsinline
                      playsinline
                      x5-playsinline
                      :src="activity.mp4"
                      ></video> 
                  </div>
                  <span class="msg-title">上传学生上课录像</span>
                  <div class="control-box">
                    <div class="control-item" @click="uploadExamGrade(activity)">
                      <img src="../../../../assets/page/student.png" width="16" height="16" alt="">
                      <span class="control-title">上传考试成绩</span>
                    </div>
                  </div>
                </div>
              </el-timeline-item>
              <!-- 课程 -->
              <el-timeline-item
                v-for="(activity, index) in planSection"
                :key="(index + 1) * 3">
                <div class="courseItem">
                  <img :src="activity.header" width="278" height="160" alt="">
                  <div class="courseItemTile">
                    <span v-if="activity.status == '3'" class="no_start_icon">已结束</span>
                    <span v-if="activity.status == '1'" class="start_icon">未开始</span>
                    <p class="courseItem-title">{{activity.coursename}}</p>
                  </div>
                  <div class="course-box">
                    <span class="label-title">讲&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;师：
                      <span class="value-title">{{activity.persons||'暂无'}}</span>
                    </span>
                  </div>
                  <div class="course-box">
                    <span class="label-title">上课时间：<span class="value-title">{{activity.time}}</span></span>
                  </div>
                  <div class="course-box">
                    <el-upload
                      v-if="activity.mp4 == null"
                      class="avatar-uploader"
                      action
                      :show-file-list="false"
                      multiple
                      :http-request="uploadMp4">
                      <i class="el-icon-plus avatar-uploader-icon" @click="check(activity.id, 'course')"></i>
                    </el-upload>
                    <video ref="vVideo"
                      v-if="activity.mp4 !== null"
                      style="width: 200px; height: 170px;"
                      controls
                      webkit-playsinline
                      playsinline
                      x5-playsinline
                      :src="activity.mp4"
                      ></video>
                  </div>
                  <span class="msg-title">上传学生上课录像</span>
                  <div class="control-box">
                    <div v-if="activity.status == '3' && activity.res.length > 0" class="control-item" @click="lookStudentGrade(activity)">
                      <img src="../../../../assets/page/student.png" width="16" height="16" alt="">
                      <span class="control-title">点击查看学生课后习题并上传成绩</span>
                    </div>
                    <div v-if="activity.status == '3' && activity.res.length < 1" class="control-item">
                      <img src="../../../../assets/page/student_no.png" width="16" height="16" alt="">
                      <span class="control-title" style="color: rgba(0,0,0,0.45);">无考试记录</span>
                    </div>
                    <div v-if="activity.status == '1'" class="control-course" @click="modifyCourse(activity.id)">
                      <img src="../../../../assets/modify.png" width="15" height="15" alt="">
                      <span>修改课程</span>
                    </div>
                    <div class="control-item" @click="lookCourseTCode">
                      <img src="../../../../assets/page/tcode.png" width="14" class="control-img" height="14" alt="">
                      <span class="control-title">课程二维码</span>
                    </div>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <el-button class="blue-btn-two" style="margin-bottom: 0;" @click="sectionBack">  返回  </el-button>
      </el-scrollbar>
      <el-dialog title="课后习题详情：" width="80%" :visible.sync="gradeModal">
        <div class="gradeInfo">
          <p>
            学校: <span>{{ schoolName }}</span>
          </p>
          <p>
            班级：<span>{{ classname }}</span>
          </p>
          <p>
            课程：<span>{{ courseName }}</span>
          </p>
        </div>
        <el-table :data="courseAnswer" tooltip-effect="dark" height="260" style="margin-top: 30px">
          <el-table-column type="index" width="80" label="序号"></el-table-column>
          <el-table-column property="stuname" width="130" label="学生名称"></el-table-column>
          <el-table-column property="img" width="750" label="课后习题（点击放大）">
            <template slot-scope="scope">
              <img v-for="(item, index) in scope.row.img" :key="index" @click="bigImg(item.header)" width="59" height="59" :src="item.header" alt="">
            </template>
          </el-table-column>
          <el-table-column property="res" label="成绩">
            <template slot-scope="scope">
              <el-input-number :step="0.1" :min="1" :max="100" v-model="scope.row.res" @blur="transmitGrade(scope.row)" :controls="false"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="saveAnswerGrade">保存</el-button>
          <el-button type="primary" @click="issueAnswerGrade">发布</el-button>
        </span>
      </el-dialog>
      <!-- 修改课程 -->
      <el-dialog title="修改课程" width="70%" :visible.sync="courseDialog">
        <el-row>
          <el-col class="row" :span="12">
            <el-input v-model="courseSearch" style="width: 70%" placeholder="请输入要搜索的内容"></el-input>
            <el-button class="search-btn" @click="searchCourse">搜索</el-button>
          </el-col>
          <el-col style="text-align: right;" :span="12">
            <span>还没有你想要的课程？先去 <span style="color: red">
              <router-link :to="{path:'/teaching/course/center', query:{ type: 1 }}" class="nav-link">上传课程</router-link>
            </span> 吧！</span>
          </el-col>
        </el-row>
        <el-table :data="courseJsonData" :row-key="(row) => {return row.id}" @selection-change="handleSelectionCourse" height="260">
          <el-table-column
            type="selection"
            :selectable="selectable"
            :reserve-selection="true">
          </el-table-column>
          <el-table-column property="typename" width="140" label="课程分类"></el-table-column>
          <el-table-column property="coursename" width="140" label="课程名称"></el-table-column>
          <el-table-column property="persons" width="130" label="选择讲师">
            <template slot-scope="scope">
              <el-select :disabled="checkRowStatus(scope.row)" v-model="scope.row.persons">
                <el-option
                  v-for="(item, index) in teachingOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column property="ctime" label="选择课程时间">
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.ctime"
                :clearable="false"
                :disabled="checkRowStatus(scope.row)"
                size="mini"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker> 
            </template>
          </el-table-column>
          <el-table-column property="local" label="地点" width="90"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="saveCourse">保存</el-button> -->
          <el-button type="primary" @click="issueNewCourse">发布</el-button>
        </span>
      </el-dialog>
      <!-- 考试成绩上传 -->
      <el-dialog title="考试成绩上传" width="70%" :visible.sync="examGradeUploadDialog">
        <div class="gradeInfo">
          <p>
            学校: <span>{{ schoolName }}</span>
          </p>
          <p>
            考试：<span>{{ examName }}</span>
          </p>
        </div>
        <el-table :data="classobj" height="260">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column property="scname" label="学生姓名"></el-table-column>
          <el-table-column property="res" label="成绩">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.res" @blur="handleGrade(scope.row, scope.row.uid, scope.row.scname, scope.row.res, scope.row.live)" :min="1" :max="100" :controls="false" :step="0.1" :step-strictly="true"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column property="live" label="等级">
            <template slot-scope="scope">
              <el-button v-model="scope.row.live" class="btn_grade" v-if="scope.row.res > 90">A</el-button>
              <el-button v-model="scope.row.live" class="btn_grade" v-if="scope.row.res < 90 && scope.row.res > 80">B</el-button>
              <el-button v-model="scope.row.live" class="btn_grade" v-if="scope.row.res < 80 && scope.row.res > 70">C</el-button>
              <el-button v-model="scope.row.live" class="btn_grade" v-if="scope.row.res < 70 && scope.row.res > 60">D</el-button>
              <el-button v-model="scope.row.live" class="btn_grade" v-if="scope.row.res < 60">E</el-button>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="saveExamApi">保存</el-button>
          <el-button type="primary" @click="issueExamApi">发布</el-button>
        </span>
      </el-dialog>
      <el-dialog title="" width="80%" :visible.sync="imgBigModal">
        <img :src="showBigImgUrl" width="100%" height="100%" alt="">
      </el-dialog>
    </div>
    <div v-if="courseList" class="business-course-all-page">
      <el-scrollbar style="height:100%">
        <div class="business-course-title">
          <span class="top-title">教学计划管理</span>
          <div class="top-control" style="margin-top: 0;">
            <el-row style="margin-top: 16px; margin-bottom: 24px;">
              <el-col class="row" :span="6">
                <el-button icon="el-icon-plus" class="blue-btn" style="margin-bottom: 0;" @click="insertTeachingPlan">制定教学计划</el-button>
              </el-col>
              <el-col class="row" style="justify-content: flex-end;" :span="14">
                <el-input v-model="teachingPlanSearch" style="width: 50%" placeholder="请输入要搜索的内容"></el-input>
                <el-button class="search-btn" @click="teachingSearch">搜索</el-button>
              </el-col>
              <el-col class="row" style="justify-content: flex-end;" :span="3" :offset="1">
                <el-button class="date-btn">
                  <div class="date-img">
                    <img width="16" height="16" src="../../../../assets/page/date.png" alt="">
                  </div>
                  <span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;课程安排表
                  </span>
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="business-course-status">
          <span>状态：</span>
          <el-radio-group v-model="teachingPlanStatus" @change="statusChange" fill="#6A6FCB" size="small">
            <el-radio-button name="0" label="全部"></el-radio-button>
            <el-radio-button name="0" label="进行中"></el-radio-button>
            <el-radio-button name="0" label="未开始"></el-radio-button>
            <el-radio-button name="0" label="已结束"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="business-course-box">
          <div 
            v-for="(course, index) in teachingPlanJsonData" 
            :key="index" 
            class="business-teaching-plan-item">
            <div class="business-course-img-box">
              <img :src="course.header" width="200" height="200" style="height: 160px" alt="">
              <span v-if="course.status == '1'" class="business_no_start business_status">未开始</span>
              <span v-if="course.status == '3'" class="business_finish business_status">已结束</span>
              <span v-if="course.status == '2'" class="business_continue business_status">进行中</span>
            </div>
            <div class="business-course-title-box">
              <p class="plan-title">{{ course.major }}</p>
              <p class="plan-desc">企业：{{ course.cominfo[0].comname }}</p>
              <p class="plan-desc">时间：{{ course.startime }}至 {{ course.endtime }}</p>
              <!-- <p class="plan-desc">地点：{{ course.testlocal[0].local == null ? '暂无' : course.testlocal[0].local }}</p> -->
              <p class="plan-desc">授课对象 ：{{ course.scname == null ? '暂无' : course.scname.scname }} &nbsp; {{ course.classname == null ? '暂无' : course.classname.classname }}</p>
            </div>
            <div class="business-course-bottom">
              <div class="modify-box" @click="showInserModal(course.id)">
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
      <!-- 删除提示 -->
      <el-dialog
        title="提示"
        :visible.sync="deleteDialog"
        width="40%">
        <span>{{ deleteTitle }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialog = false">取 消</el-button>
          <el-button type="primary" @click="deleteTeachingPlan">确 认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { formatDate } from '../../../../utils/formatDate'
export default {
  name: 'manager',
  data () {
    return {
      total: 0,
      currentPage: 1,
      pagesize: 8,
      deleteTitle: '',
      status: 9,
      courseSection: false, // 课程章节
      courseTCode: false, // 课程二维码
      courseList: true, // 课程列表
      gradeModal: false,
      imgBigModal: false,
      deleteDialog: false,
      courseDialog: false,
      examGradeUploadDialog: false,
      courseSearch: '', // 搜索课程内容
      courseJsonData: [], // 课程列表
      deleteTeachingPlanId: '',
      teachingPlanId: '', // 教学计划Id
      modifyCourseNewObj: {
        eventid: '',
        info: []
      },
      teachingPlanSearch: '', // 搜索
      teachingPlanStatus: '全部', // 计划状态
      teachingPlanJsonData: [],
      courseIdList: [], // 已经选择的课程Id
      reverse: true,
      classobj: [],
      teachingOptions: [], // 老师Options
      planSection: [],
      planExamSection: [],
      activities: [],
      uploadMp4Id: '',
      uploadExamMp4Id: '',
      testInfoId: '', // 考试Id
      examList: [],
      schoolName: '',
      classname: '',
      examName: '',
      FileType: '', // course 课程 test 考试
      courseName: '',
      loading: false,
      showBigImgUrl: '',
      courseAnswer: [], // 课后习题
      answerGrade: [], // 课后习题List
      img: ''
    }
  },
  created() {
    this.requestTeachingPlanJsonData()
  },
  methods: {
    // 搜索
    teachingSearch() {
      this.requestTeachingPlanJsonData() 
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.requestTeachingPlanJsonData() 
    },
    handleCurrentChange(val) {
      this.requestTeachingPlanJsonData()
    },
    // 制定教学计划
    insertTeachingPlan() {
      this.$router.push({ path: '/teaching/plan/enact' })
    },
    // 状态筛选
    statusChange(e) {
      if (e === '全部') {
        this.status = 9
        this.requestTeachingPlanJsonData()
      } else {
        switch (e) {
          case '进行中':
            this.status = 2
            this.requestTeachingPlanJsonData()
            break;
          case '未开始':
            this.status = 1
            this.requestTeachingPlanJsonData()
            break;
          case '已结束':
            this.status = 3
            this.requestTeachingPlanJsonData()
            break;
        }
      }
    },
    // 获取课程列表
    requestTeachingPlanJsonData() {
      this.$axios.post(this.$global.sApi + '/eventlist', JSON.stringify({
        'type': 1,
        'current_page': parseInt(this.currentPage),
        'perpage': parseInt(this.pagesize),
        'status': this.status,
        'major': this.teachingPlanSearch == '' ? 9 : this.teachingPlanSearch
      })).then(res => {
        this.teachingPlanJsonData = res.data.data.data
        this.total = res.data.data.total
      })
    },
    // 显示删除
    showDeleteModal(obj) {
      this.deleteTeachingPlanId = obj.id
      if (obj.status == '2') {
        this.deleteTitle = '该教学计划已经在进行中，若删除课程将全部记录会删除掉'
      } else {
        this.deleteTitle = '确定要删除该教学计划吗'
      }
      this.deleteDialog = true
    },
    // 删除计划
    deleteTeachingPlan() {
      this.$axios.post(this.$global.sApi + '/eventlist', JSON.stringify({
        'type': 4,
        'id': parseInt(this.deleteTeachingPlanId)
      })).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.deleteDialog = false
        this.requestTeachingPlanJsonData()
      })
    },
    // 编辑教学计划
    showInserModal(id) {
      this.requestPlanDetail(id)
      this.teachingPlanId = id
      this.courseList = false
      this.courseTCode = false
      this.courseSection = true
    },
    sectionBack() {
      this.courseList = true
      this.courseTCode = false
      this.courseSection = false
    },
    // 获取计划详情
    requestPlanDetail(id) {
      this.$axios.post(this.$global.sApi + '/eventlist', JSON.stringify({
        'type': 5,
        'eventid': id
      })).then(res => {
        this.planSection = res.data.data[0].courseinfo
        this.planSection.forEach(element => {
          this.courseIdList.push(element.courseid)
        });
        this.planExamSection = res.data.data[0].testinfo
        this.classobj = res.data.data[0].classobj
        this.activities = res.data.data
        this.schoolName = this.activities[0].scname.scname
        this.classname = this.activities[0].classname.classname
      })
    },
    check(id, type) {
      this.FileType = type
      this.uploadMp4Id = id
    },
    // 查看课程二维码  
    lookCourseTCode() {
      this.courseList = false
      this.courseSection = false
      this.courseTCode = true
    },
    tCodeBack() {
      this.courseList = false
      this.courseSection = true
      this.courseTCode = false
    },
    // 查看学生成绩
    lookStudentGrade(obj) {
      this.gradeModal = true
      this.courseName = obj.coursename
      this.courseAnswer = obj.res
    },
    bigImg(item) {
      this.imgBigModal = true
      this.showBigImgUrl = item
    },
    // 讲师Options
    requestTeachingApi() {
      this.$axios.post(this.$global.sApi + '/roles').then(res => {
        this.teachingOptions = res.data.data[0]
      })
    },
    // 搜索课程列表
    searchCourse() {
      if (this.courseSearch == '') {
        this.requestCourseJsonData()
      } else {
        this.searchCourseJsonData()
      }
    },
    // 搜索课程列表
    searchCourseJsonData() {
      this.$axios.post(this.$global.sApi + '/course', JSON.stringify({
        'type': 5,
        'coursename': this.courseSearch
      })).then(res => {
        this.courseJsonData = res.data.data[0]
      })
    },
    // 获取课程列表
    requestCourseJsonData() {
      this.$axios.post(this.$global.sApi + '/course', JSON.stringify({
        'type': 4,
        'current_page': 1,
        'perpage': 9999
      })).then(res => {
        this.courseJsonData = res.data.data.data
        this.courseJsonData.forEach(course => {
          this.planSection.forEach(planCourse => {
            if (course.id == planCourse.courseid) {
              course.persons = planCourse.persons
              course.ctime = planCourse.time
              course.local = planCourse.local
            }
          });
        });
      })
    },
    // 选择课程
    handleSelectionCourse(val) {
      this.modifyCourseNewObj.eventid = this.teachingPlanId
      const obj = {
        courseid: '',
        time: '',
        persons: ''
      }
      this.modifyCourseNewObj.info = []
      val.forEach(element => {
        obj.courseid = element.id
        obj.time = formatDate(new Date(element.ctime), 'yyyy-MM-dd hh:mm:ss')
        obj.persons = element.persons || '暂无'
        this.modifyCourseNewObj.info.push(obj)
      });      
    },
    // 发布课程
    issueNewCourse() {
      this.$axios.post(this.$global.sApi + '/addcoures', JSON.stringify({
        'eventid': this.modifyCourseNewObj.eventid,
        'info': this.modifyCourseNewObj.info
      })).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.requestPlanDetail(this.teachingPlanId)
        this.courseDialog = false
      })
    },
    // 修改课程
    modifyCourse() {
      this.courseDialog = true
      this.requestCourseJsonData()
      this.requestTeachingApi()
    },
    // 保存课程
    saveCourse() {
      this.courseDialog = false
    },
    // 发布课程
    issueCourse() {
      this.courseDialog = false
    },
    // 显示上传成绩
    uploadExamGrade(obj) {
      this.examGradeUploadDialog = true
      this.examName = obj.testname
      this.testInfoId = obj.test_info_id
    },
    // 禁用
    checkRowStatus(row) {
      if (this.courseIdList.includes(row.id)) {
        return true
      } else {
        return false
      }
    },
    // 已选课程置灰
    selectable(row, index) {
      if (this.courseIdList.includes(row.id)) {
        return false
      } else {
        return true
      }
    },
    // 配置成绩数据
    handleGrade(row, uid, scname, res, live) {
      var live = 'A'
      if (res > 90) {
        live = 'A'
      } else if (res < 90 && res > 80) {
        live = 'B'
      } else if (res < 80 && res > 70) {
        live = 'C'
      } else if (res < 70 && res > 60) {
        live = 'D'
      } else {
        live = 'E'
      }
      const obj = {
        uid: uid,
        name: scname,
        res: res,
        live: live
      }
      this.examList.forEach(element => {
        if (element.uid == uid) {
          this.examList.splice(this.examList.indexOf(element), 1)
        }
      });
      this.examList.push(obj)
    },
    // 保存成绩
    saveExamApi() {
      this.$axios.post(this.$global.sApi + '/addres', JSON.stringify({
        'test_info_id': this.testInfoId,
        'info': this.examList,
        'status': 1
      })).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.examGradeUploadDialog = false
      })
    },
    // 提交成绩
    issueExamApi() {
      this.$axios.post(this.$global.sApi + '/addres', JSON.stringify({
        'test_info_id': this.testInfoId,
        'info': this.examList,
        'status': 2
      })).then(res => {
        this.$message({
          message: '发布成功',
          type: 'success'
        })
        this.examGradeUploadDialog = false
      })
    },
    // 传递成绩
    transmitGrade(row) {
      this.answerGrade.forEach(element => {
        if (element.uid == row.id) {
          this.answerGrade.splice(this.answerGrade.indexOf(element), 1)
        }
      });
      const obj = {
        uid: row.id,
        res: row.res
      }
      this.answerGrade.push(obj)
    },
    // 保存课后习题
    saveAnswerGrade() {
      console.log(this.courseAnswer[0].course_info_id)
      this.$axios.post(this.$global.sApi + '/addstures', JSON.stringify({
        'course_info_id': this.courseAnswer[0].course_info_id,
        'info': this.answerGrade,
        'type': 1
      })).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.gradeModal = false
      })
    },
    // 发布课后习题
    issueAnswerGrade() {
      this.$axios.post(this.$global.sApi + '/addstures', JSON.stringify({
        'course_info_id': this.courseAnswer[0].course_info_id,
        'info': this.answerGrade,
        'type': 2
      })).then(res => {
        this.$message({
          message: '发布成功',
          type: 'success'
        })
        this.gradeModal = false
      })
    },
    // 前端校验文件上传是否符合条件
    file_info_check (file) {
      var ret = ''
      if (file === undefined) {
        ret = ''
      }
      // eslint-disable-next-line camelcase
      var max_file_size = 100 * 1024 * 1024
      // eslint-disable-next-line camelcase
      if (file.size > max_file_size) {
        ret = '文件不能大于100Mb'
      }
      var typeMp4 = '.mp4'
      if (file.name.indexOf(typeMp4) === -1) {
        ret = '视屏格式要求是.mp4'
      } else {
        ret = 'success'
        return ret
      }
      return ret
    },
    // 课程上传视屏
    uploadMp4 (fileObj) {
      this.loading = true
      let fileStatus = this.file_info_check(fileObj.file)
      if (fileStatus === 'success') {
        let formData = new FormData()
        formData.append('type', 3)
        formData.append('typename', 'course_info')
        formData.append('fname', this.FileType)
        formData.append('course_info_id', this.uploadMp4Id)
        formData.append('file', fileObj.file)
        this.$axios.post('/mp4', formData, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }).then(res => {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.requestPlanDetail(this.teachingPlanId)
          this.loading = false
        }).catch(err => {
          this.loading = false
        })
      } else {
        this.$message({
          message: fileStatus,
          type: 'error'
        })
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
  .courseItemTile {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: 16px;
    padding-bottom: 8px;
  }

  .courseItemTile .no_start_icon {
    padding: 5px;
    font-size: 14px;
    color: white;
    border-radius: 2px;
    background-color: #979797;
    margin-right: 10px;
  }

  .courseItemTile .start_icon {
    padding: 5px;
    font-size: 14px;
    color: white;
    border-radius: 2px;
    background-color: #38EBEB;
    margin-right: 10px;
  }

  .courseItemTile .courseItem-title {
    font-size: 24px;
    color: #000000;
  }

  .label-title {
    font-size: 14px;
    color: rgba(0,0,0,0.85);
  }

  .value-title {
    font-size: 14px;
    color: rgba(0,0,0,0.65);
  }

  .course-box {
    margin: 8px 0;
  }

  .msg-title {
    font-size: 12px;
    color: rgba(0,0,0,0.45);
  }

  .control-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 19px;
    margin-bottom: 43px;
  }

  .control-img {
    margin-left: 56px;
  }

  .control-title {
    font-size: 14px;
    color: #6a6fcb;
    margin-left: 8px;
  }

  .control-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
  }

  .control-course {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #6A6FCB;
    border-radius: 2px;
    padding: 2px 8px;
    cursor: pointer;
  }

  .control-course span {
    font-size: 12px;
    color: white;
    margin-left: 8px;
  }

  .top-course {
    margin-top: 32px;
    margin-bottom: 16px;
  }

  p {
    padding: 0;
    margin: 0;
  }

  .el-dialog__body {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  .gradeInfo p {
    height: 30px;
    line-height: 30px;
  }

  .gradeInfo p span {
    color: rgba(0,0,0,0.65);
  }

  .business-course-img-box {
    position: relative;
    width: 100%;
    height: 160px;
  }

  .business-course-img-box img {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .business_status {
    font-size: 12px;
    color: white;
    padding: 1px 6px;
    border-radius: 2px;
    position: absolute;
    left: 16px;
    bottom: 12px;
  }

  .business_no_start {
    background-color: #38EBEB;
  }

  .business_finish {
    background-color: #979797;
  }

  .business_continue {
    background-color: #F1B237;
  }

</style>
