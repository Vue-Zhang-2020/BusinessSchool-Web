<template>
  <div class="business-course-all-page">
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
        <div v-for="(course, index) in teachingPlanJsonData" :key="index" class="business-teaching-plan-item">
          <div class="business-course-img-box">
            <img :src="course.header" width="200" height="200" style="height: 160px" alt="">
          </div>
          <div class="business-course-title-box">
            <p class="plan-title">{{ course.major }}</p>
            <p class="plan-desc">企业：{{ course.scinfo[0].scname }}</p>
            <p class="plan-desc">时间：{{ course.startime }}至 {{ course.endtime }}</p>
            <p class="plan-desc">地点：{{ course.coursename == '' ? '暂无' : course.coursename }}</p>
            <p class="plan-desc">授课对象 ：{{ course.scname.scname }} &nbsp; {{ course.classname.classname }}</p>
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
      deleteDialog: false,
      deleteTeachingPlanId: '',
      teachingPlanSearch: '', // 搜索
      teachingPlanStatus: '全部', // 计划状态
      teachingPlanJsonData: [],
    }
  },
  created() {
    this.requestTeachingPlanJsonData()
  },
  methods: {
    // 搜索
    teachingSearch() {

    },
    handleSizeChange(val) {
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
        this.requestTeachingPlanJsonData()
      } else {
        switch (e) {
          case '进行中':
            this.requestTeachingPlanStatusJsonData(2)
            break;
          case '未开始':
            this.requestTeachingPlanStatusJsonData(1)
            break;
          case '已结束':
            this.requestTeachingPlanStatusJsonData(3)
            break;
        }
      }
    },
    // 获取课程列表
    requestTeachingPlanJsonData() {
      this.$axios.post(this.$global.sApi + '/eventlist', JSON.stringify({
        'type': 1,
        'current_page': parseInt(this.currentPage),
        'perpage': parseInt(this.pagesize)
      })).then(res => {
        this.teachingPlanJsonData = res.data.data.data
      })
    },
    // 获取筛选课程列表
    requestTeachingPlanStatusJsonData(flag) {
      this.$axios.post(this.$global.sApi + '/eventlist', JSON.stringify({
        'type': 2,
        'status': flag
      })).then(res => {
        this.teachingPlanJsonData = res.data.data.data
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
    }
  }
}
</script>

<style scoped>

</style>
