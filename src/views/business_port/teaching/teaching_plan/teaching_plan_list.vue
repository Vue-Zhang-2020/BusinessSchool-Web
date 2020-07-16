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
    </div>
    <div v-if="courseSection" class="business-model-all-page">
      <el-scrollbar style="height:100%">
        <div>
          <span class="top-title">课程章节</span>
          <div class="top-control">
            <el-timeline :reverse="reverse">
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index">
                <div class="courseItem">
                  <img src="../../../../assets/img.jpg" width="278" height="160" alt="">
                  <div class="courseItemTile">
                    <img src="" width="52" height="24" alt="">
                    <p class="courseItem-title">python知识的提升课程</p>
                  </div>
                  <div class="course-box">
                    <span class="label-title">讲&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;师：<span class="value-title"></span></span>
                  </div>
                  <div class="course-box">
                    <span class="label-title">上课时间：<span class="value-title"></span></span>
                  </div>
                  <div class="course-box">
                    <el-upload
                      class="avatar-uploader"
                      action
                      :show-file-list="false"
                      multiple>
                      <!-- :http-request="" -->
                      <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>   
                  </div>
                  <span class="msg-title">上传学生上课录像</span>
                  <div class="control-box">
                    <div class="control-item">
                      <img src="../../../../assets/page/student.png" width="16" height="16" alt="">
                      <span class="control-title">点击查看学生课后习题并上传成绩</span>
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
      </el-scrollbar>
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
            class="business-teaching-plan-item"
            @click="goToDetails(course)">
            <div class="business-course-img-box">
              <img :src="course.header" width="200" height="200" style="height: 160px" alt="">
            </div>
            <div class="business-course-title-box">
              <p class="plan-title">{{ course.major }}</p>
              <p class="plan-desc">企业：{{ course.scinfo[0].scname }}</p>
              <p class="plan-desc">时间：{{ course.startime }}至 {{ course.endtime }}</p>
              <p class="plan-desc">地点：{{ course.testlocal[0].local == null ? '暂无' : course.testlocal[0].local }}</p>
              <p class="plan-desc">授课对象 ：{{ course.scname == null ? '暂无' : course.scname.scname }} &nbsp; {{ course.classinfo == null ? '暂无' : course.classinfo.classname }}</p>
            </div>
            <div class="business-course-bottom">
              <div class="modify-box" @click="showInserModal(course)">
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
      deleteDialog: false,
      deleteTeachingPlanId: '',
      teachingPlanSearch: '', // 搜索
      teachingPlanStatus: '全部', // 计划状态
      teachingPlanJsonData: [],
      reverse: true,
        activities: [{
          content: '活动按期开始',
          timestamp: '2018-04-15'
        }, {
          content: '通过审核',
          timestamp: '2018-04-13'
        }, {
          content: '创建成功',
          timestamp: '2018-04-11'
        }]
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
    showInserModal(obj) {
      this.$router.push({
        path: '/teaching/plan/enact',
        query: {'obj': obj}
      })
    },
    // 查看计划详情
    goToDetails(plan) {
      // this.courseList = false
      // this.courseTCode = false
      // this.courseSection = true
    },
    // 查看课程二维码
    lookCourseTCode() {
      // this.courseList = false
      // this.courseSection = false
      // this.courseTCode = true
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

  .top-course {
    margin-top: 32px;
    margin-bottom: 16px;
  }

  p {
    padding: 0;
    margin: 0;
  }
</style>
