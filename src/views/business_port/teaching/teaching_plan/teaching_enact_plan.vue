<template>
  <div class="business-content">
    <div v-show="insertObj" class="business-obj-model-page">
      <el-scrollbar style="height: 100%">
        <div>
          <span class="top-title">添加对象</span>
        </div>
        <div style="margin-top: 40px;">
          <el-row>
            <el-col :span="4">
              <el-tree :data="studentJsonData" :props="defaultProps" @node-click="handleNodeClick" :render-content="renderContent"></el-tree>
            </el-col>
            <el-col :span="1">
              <div class="s_line"></div>
            </el-col>
            <el-col class="table-box" :span="19">
              <el-table
                @selection-change="handleSelectionStudent"
                :data="studentInfoJsonData"
                style="width: 100%;">
                <el-table-column
                  type="selection">
                </el-table-column>
                <el-table-column
                  type="index"
                  label="序号"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="username"
                  label="学生姓名"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="proname"
                  label="专业"
                  width="140">
                </el-table-column>
                <el-table-column
                  prop="age"
                  label="出生年月"
                  width="110">
                  <template slot-scope="scope">
                    <span>{{scope.row.age !== null ? scope.row.age.substring(2, scope.row.age.indexOf('月') > -1 ? scope.row.age.indexOf('月') + 1 : scope.row.age) : '暂无'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="live"
                  label="年级"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="classname"
                  label="班级"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="phone"
                  label="联系方式"
                  width="150">
                </el-table-column>
              </el-table>
              <div class="display: flex;">
                <el-button class="blue-btn-two" @click="insertObj = false">返回</el-button>
                <el-button class="blue-btn" @click="checkStudent">确认选中</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-scrollbar>
    </div>
    <div v-if="!insertObj" class="business-model-page">
      <el-scrollbar style="height:100%">
        <span class="top-title">{{modify === true ? '修改教学计划' : '制定教学计划'}}</span>
        <div class="business-model-box">
          <span>培训信息</span>
        </div>
        <el-form :model="teachingPlanForm" :rules="rules" ref="teachingForm">
          <el-form-item label="上课企业：" prop="attendFirm" :label-width="formLabelWidth">
            <div class="firm-box">
              <el-tag
                v-for="(tag, index) in this.teachingPlanForm.attendFirm"
                :key="index"
                :closable="true"
                class="button-new-tag item_tag"
                size="small"
                :type="index == 0 ? '' :
                index == 1 ? 'success' :
                index == 2 ? 'warning' :
                index == 3 ? 'danger' :
                index == 4 ? 'info' :
                index == 5 ? '' :
                index == 6 ? 'success' : 'warning'"
                @close="handleClose(tag)">
                <span v-if="!modify">
                  {{tag.comname}}
                </span>
                <span v-if="modify">
                  {{tag.scname}}
                </span>
              </el-tag>
              <el-button class="button-new-tag" size="mini" icon="el-icon-plus" @click="showFirmModal">选择上课企业</el-button>
            </div>
          </el-form-item>
          <el-form-item label="教学计划主题：" prop="teachingPlan" :label-width="formLabelWidth">
            <el-input v-model="teachingPlanForm.teachingPlan" style="width: 20%" placeholder="请输入" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="教学计划内容：" :label-width="formLabelWidth">
            <div class="row marT">
              <el-button class="button-new-tag" size="mini" icon="el-icon-plus" @click="showCourseModal">添加课程</el-button>
              <el-button class="button-new-tag" size="mini" icon="el-icon-plus" @click="showExamModal">添加考试</el-button>
            </div>
            <p class="teachingPlanDesc">可以选择课程+考试，也可以只选择课程</p>
          </el-form-item>
          <el-form-item label="教学计划说明：" prop="teachingPlanInfo" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="teachingPlanForm.teachingPlanInfo" style="width: 60%; min-height: 160px;" :rows="8"></el-input>
          </el-form-item>
          <el-form-item label="教学计划封面：" prop="imageUrl" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              action
              :show-file-list="false"
              multiple
              :http-request="uploadImg">
              <img v-if="teachingPlanForm.imageUrl" :src="teachingPlanForm.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>    
            <p class="teachingPlanDesc">图片建议尺寸800*400，比例2：1，仅支持jpg、jpeg、png，图片大小不超过2mb</p>
          </el-form-item>
          <div class="business-model-box">
            <span>学员设置</span>
          </div>
          <el-form-item label="选择学校：" prop="teachingPlanSchool" :label-width="formLabelWidth">
            <el-select v-model="teachingPlanForm.teachingPlanSchool" placeholder="全部">
              <el-option
                v-for="item in schoolSelectorJsonData"
                :key="item.id"
                :label="item.scname"
                :value="item.scnameid">
              </el-option>
            </el-select>        
          </el-form-item>
          <el-form-item label="选择上课对象：" prop="teachingPlanObj" :label-width="formLabelWidth">
            <el-button class="button-new-tag marT" size="mini" icon="el-icon-plus" @click="showObjModal">添加对象</el-button>
          </el-form-item>
          <div class="business-model-box">
            <span>其他设置</span>
          </div>
          <el-form-item label="认证勋章：" prop="teachingPlanMedal" :label-width="formLabelWidth">
            <div style="display: flex; flex-direction: row;">
              <div v-for="(medal, index) in this.teachingPlanForm.teachingPlanMedal" :key="index" style="margin-right: 20px;">
                <img width="24" height="36" :src="medal.head" alt="">
              </div>
            </div>
            <el-button class="button-new-tag marT" size="mini" icon="el-icon-plus" @click="showMedalModal">添加勋章</el-button>
          </el-form-item>
          <el-form-item label="勋章获取条件：" prop="teachingPlanComplete" :label-width="formLabelWidth">
            <div>
              <span class="title-desc">课程完成率</span>  
                <el-input-number :min="1" :max="99" :controls="false" v-model="teachingPlanForm.teachingPlanComplete" style="width: 10%; margin: 0 8px;" placeholder="请输入" autocomplete="off"></el-input-number>
              <span class="title-desc title-right">%以上</span>
            </div>
          </el-form-item>
          <el-form-item label="" prop="teachingPlanIntegral" :label-width="formLabelWidth">
            <div class="title-box">
              <span class="title-desc">获取积分</span>
                <el-input-number :min="1" :max="9999" :step="1" :step-strictly="true" :controls="false" v-model="teachingPlanForm.teachingPlanIntegral" style="width: 10%; margin: 0 8px;" placeholder="请输入" autocomplete="off"></el-input-number>
              <span class="title-desc title-right">以上</span>
            </div>
          </el-form-item>
          <el-form-item label="" prop="teachingPlanGrade" :label-width="formLabelWidth">
            <div class="title-box">
              <span class="title-desc">考试成绩</span>
                <el-input-number :step="0.1" :precision="1" :min="1" :max="100" :controls="false" v-model="teachingPlanForm.teachingPlanGrade" style="width: 10%; margin: 0 8px;" placeholder="请输入" autocomplete="off"></el-input-number>
              <span class="title-desc title-right">以上</span>
            </div>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
    <div v-if="!insertObj" class="business-bottom-box">
      <div class="business-control">
        <el-button class="blue-btn-back" @click="toBack">  返回  </el-button>
        <el-button class="blue-btn-two" style="margin-bottom: 0;" @click="dateFormat">  预览  </el-button>
        <el-button class="blue-btn" style="margin-bottom: 0;" @click="submitTeachingPlan('teachingForm')">  {{modify === true ? '修改' : '发布'}}  </el-button>
      </div>
    </div>
    <!-- 上课企业 -->
    <el-dialog title="选择上课的企业" :visible.sync="skFirmDialog">
      <el-row>
        <el-col class="row" :span="12">
          <el-input v-model="skFirmSearch" style="width: 70%" placeholder="请输入要搜索的内容"></el-input>
          <el-button class="search-btn" @click="searchFirm">搜索</el-button>
        </el-col>
        <el-col style="text-align: right;" :span="12">
          <span>还没有你想要的课程？先去 <span style="color: red">
            <router-link :to="{path:'/unit/firm/coop', query:{ type: 1 }}" class="nav-link">上传企业</router-link>
          </span> 吧！</span>
        </el-col>
      </el-row>
      <el-table :data="firmJsonData" row-key="id" ref="firmTable" @select-all="selectAll" @selection-change="handleSelectionFirm" height="260">
        <el-table-column
          type="index" label="序号" width="200"></el-table-column>
        <el-table-column
          type="selection"
          width="200">
        </el-table-column>
        <el-table-column property="comname" label="企业"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFirm">取 消</el-button>
        <el-button type="primary" @click="checkFirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加课程 -->
    <el-dialog title="添加课程" width="70%" :visible.sync="courseDialog">
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
          :reserve-selection="true"
          type="selection">
        </el-table-column>
        <el-table-column property="typename" width="140" label="课程分类"></el-table-column>
        <el-table-column property="coursename" width="140" label="课程名称"></el-table-column>
        <el-table-column property="persons" width="130" label="选择讲师"></el-table-column>
        <el-table-column property="ctime" label="选择课程时间">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.ctime"
              :clearable="false"
              size="mini"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker> 
          </template>
        </el-table-column>
        <el-table-column property="local" label="地点" width="90"></el-table-column>
        <el-table-column property="points" align="center" label="完成课程得到多少积分"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="courseDialog = false">取 消</el-button>
        <el-button type="primary" @click="checkCourse">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加考试 -->
    <el-dialog title="添加考试" width="60%" :visible.sync="examDialog">
      <el-row>
        <el-col class="row" :span="12">
          <el-input v-model="examSearch" placeholder="请输入要搜索的内容"></el-input>
          <el-button class="search-btn" @click="searchExam">搜索</el-button>
        </el-col>
        <el-col style="text-align: right;" :span="12">
          <span>还没有你想要的考试？先去 <span style="color: red">
            <router-link :to="{path:'/teaching/exam/center', query:{ type: 1 }}" class="nav-link">上传考试</router-link>
          </span> 吧！</span>
        </el-col>
      </el-row>
      <el-table :data="examJsonData" :row-key="(row) => { return row.id }" @selection-change="handleSelectionExam" tooltip-effect="dark" height="260">
        <el-table-column
        :reserve-selection="true"
          type="selection">
        </el-table-column>
        <el-table-column property="testname" label="考试名称"></el-table-column>
        <!-- <el-table-column property="date" label="添加监考人员"></el-table-column> -->
        <!-- <el-table-column property="date" label="添加考试时间"></el-table-column> -->
        <el-table-column property="testtime" label="考试时间"></el-table-column>
        <el-table-column property="date" label="地点"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="examDialog = false">取 消</el-button>
        <el-button type="primary" @click="checkExam">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加勋章 -->
    <el-dialog title="添加勋章" width="60%" :visible.sync="medalDialog">
      <el-row>
        <el-col class="row" :span="12">
          <el-input v-model="medalSearch" placeholder="请输入要搜索的内容"></el-input>
          <el-button class="search-btn" @click="searchMedal">搜索</el-button>
        </el-col>
        <el-col style="text-align: right;" :span="12">
          <span>还没有你想要的勋章？先去 <span style="color: red">
            <router-link :to="{path:'/teaching/plan/medal', query:{ type: 1 }}" class="nav-link">上传勋章</router-link>
          </span> 吧！</span>
        </el-col>
      </el-row>
      <el-table :data="medalJsonData" :row-key="(row) => { return row.id }" @selection-change="handleSelectionMedal" tooltip-effect="dark" height="260">
        <el-table-column
        :reserve-selection="true"
          type="selection">
        </el-table-column>
        <el-table-column property="name" label="勋章名称"></el-table-column>
        <el-table-column property="head" label="勋章">
          <template slot-scope="scope">
            <img width="24" height="36" :src="scope.row.head" alt="">
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="medalDialog = false">取 消</el-button>
        <el-button type="primary" @click="checkMedal">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from '../../../../utils/formatDate'
export default {
  name: '',
  data () {
    return {
      schoolId: 0,
      modify: false,
      skFirmDialog: false, // 上课企业 Dialog
      skFirmSearch: '', // 上课企业 搜索内容
      courseDialog: false, // 添加课程 Dialog
      courseSearch: '', // 添加课程 搜索内容
      examDialog: false, // 添加考试 Dialog
      examSearch: '', // 添加考试 搜索内容
      medalDialog: false, // 添加勋章 Dialog
      medalSearch: '', // 添加勋章 搜索内容
      firmJsonData: [], // 企业
      medalJsonData: [], // 勋章
      courseJsonData: [], // 课程
      examJsonData: [], // 考试
      defaultSelected: [],
      copyFirm: [],
      studentJsonData: [],
      integralNumber: '',
      clickMajor: '',
      clickClasses: '',
      studentInfoJsonData: [],
      schoolSelectorJsonData: [],
      insertObj: false,
      formLabelWidth: '120px',
      defaultProps: {
        children: 'classinfo',
        label: 'classname'
      },
      firmCheck: [],
      courseCheck: [],
      examCheck: [],
      medalCheck: [],
      stduentCheck: [],
      teachingPlanForm: {
        planId: '',
        attendFirm: [], // 上课企业
        teachingPlan: '',  // 请输入教学计划主题
        teachingPlanCourse: [],  // 教学计划内容 - 课程
        teachingPlanCourseTeacher: [], // 老师
        teachingPlanCourseTime: [], // 上课时间
        teachingPlanExam: [],  // 教学计划内容 - 考试
        teachingPlanInfo: '', // 教学计划说明
        imageUrl: '', // 教学计划封面
        teachingPlanSchool: '', // 学校
        teachingPlanObj: [], // 上课对象
        teachingPlanMedal: [], // 认证勋章
        teachingPlanComplete: '', // 完成度
        teachingPlanIntegral: '', // 积分
        teachingPlanGrade: '' // 成绩
      },
      rules: {
        attendFirm: [
          { required: true, message: '请选择上课企业', trigger: 'change' }
        ],
        teachingPlan: [
          { required: true, message: '请输入教学计划主题', trigger: 'blur' }
        ],
        teachingPlanDesc: [
          { required: true, message: '请选择教学计划内容', trigger: 'change' }
        ],
        teachingPlanSchool: [
          { required: true, message: '请选择学校', trigger: 'change' }
        ],
        teachingPlanObj: [
          { required: true, message: '请选择上课对象', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    var objModi = this.$route.query.obj
    if (objModi !== undefined && objModi !== null) {
      this.teachingPlanForm = {
        planId: objModi.id,
        attendFirm: objModi.scinfo, // 上课企业
        teachingPlan: objModi.major,  // 请输入教学计划主题
        teachingPlanCourse: [],  // 教学计划内容 - 课程
        teachingPlanCourseTeacher: objModi.courseinfo, // 老师
        teachingPlanCourseTime: [], // 上课时间
        teachingPlanExam: [],  // 教学计划内容 - 考试
        teachingPlanInfo: objModi.brief, // 教学计划说明
        imageUrl: objModi.header, // 教学计划封面
        teachingPlanSchool: parseInt(objModi.scname.id), // 学校
        teachingPlanObj: [], // 上课对象
        teachingPlanMedal: [], // 认证勋章
        teachingPlanComplete: objModi.class, // 完成度
        teachingPlanIntegral: objModi.points, // 积分
        teachingPlanGrade: objModi.res // 成绩
      }
      this.modify = true
    }
    this.schoolId = this.$store.getters.schoolId
    this.requestSchoolSelectorJsonData()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取学校列表
    requestSchoolSelectorJsonData() {
      this.$axios.post(this.$global.sApi + '/addscuser', JSON.stringify({
        'type': 3,
        'current_page': 1,
        'perpage': 9999
      })).then(res => {
        this.schoolSelectorJsonData = res.data.data.data
      })
    },
    // 显示企业选择
    showFirmModal() {
      this.skFirmDialog = true
      this.requestFirmJsonData()
    },
    // 搜索企业列表
    searchFirm() {
      if (this.skFirmSearch == '') {
        this.requestFirmJsonData()
      } else {
        this.requestFirmSearchJsonData()
      }
    },
    // 企业列表
    requestFirmJsonData() {
      this.$axios.post(this.$global.sApi + '/findmsg', JSON.stringify({
        'type': 1,
        'current_page': 1,
        'perpage': 9999
      })).then(res => {
        this.firmJsonData = res.data.data[0]
        setTimeout(() => {
          this.toggleSelection()
        }, 200)
      })
    },
    requestFirmSearchJsonData() {
      this.$axios.post(this.$global.sApi + '/findmsg', JSON.stringify({
        'type': 4,
        'current_page': 1,
        'perpage': 9999,
        'work': this.skFirmSearch
      })).then(res => {
        this.firmJsonData = res.data.data[0]
        setTimeout(() => {
          this.toggleSelection()
        }, 200)
      })
    },
    cancelFirm() {
      this.defaultSelected = []
      this.copyFirm = []
      this.skFirmDialog = false
    },
    toggleSelection() {
      this.firmJsonData.forEach(row => {
        if (this.defaultSelected.includes(row.id)) {
          this.$refs.firmTable.toggleRowSelection(row, true)
        } else {
          this.$refs.firmTable.toggleRowSelection(row, false)
        }
      });
    },
    // 显示添加课程
    showCourseModal() {
      this.requestCourseJsonData()
      this.courseDialog = true
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
      })
    },
    // 显示添加考试
    showExamModal() {
      this.requestExamJsonData()
      this.examDialog = true
    },
    // 搜索考试列表
    searchExam() {
      if (this.examSearch == '') {
        this.requestExamJsonData()
      } else {
        this.searchExamJsonData()
      }
    },
    // 搜索考试列表
    searchExamJsonData() {
      this.$axios.post(this.$global.sApi + '/addtest', JSON.stringify({
        'type': 5,
        'testname': this.examSearch
      })).then(res => {
        this.examJsonData = res.data.data[0]
      })
    },
    // 获取考试列表
    requestExamJsonData() {
      this.$axios.post(this.$global.sApi + '/addtest', JSON.stringify({
        'type': 4,
        'current_page': 1,
        'perpage': 9999
      })).then(res => {
        this.examJsonData = res.data.data.data
      })
    },
    // 显示添加对象
    showObjModal() {
      if (this.teachingPlanForm.teachingPlanSchool == '') {
        this.$message({
          message: '请先选择学校',
          type: 'warning'
        })
      } else {
        this.requestSchoolJsonData()
        // this.requestStudentInfoJsonData()
        this.insertObj = true
      }
    },
    // 获取学生资料列表
    requestStudentInfoJsonData() {
      this.$axios.post(this.$global.sApi + '/findstu', JSON.stringify({
        'scinfoid': this.teachingPlanForm.teachingPlanSchool,
        'current_page': 1,
        'perpage': 9999,
        'phone': '',
        'username': '',
        'proinfoid': parseInt(this.clickMajor),
        'classinfoid': parseInt(this.clickClasses)
      })).then(res => {
        // this.total = res.data.data.total
        const json = res.data.data.data
        this.studentInfoJsonData = json
      })
    },
    // 获取学校数据
    requestSchoolJsonData() {
      this.$axios.post(this.$global.sApi + '/navigation', JSON.stringify({
        'scinfoid': this.teachingPlanForm.teachingPlanSchool,
      })).then(res => {
        const json = res.data.data
        this.studentJsonData = json
      })
    },
    // 显示添加勋章
    showMedalModal() {
      this.requestMedalJsonData()
      this.medalDialog = true
    },
    // 搜索勋章列表
    searchMedal() {
      if (this.medalSearch == '') {
        this.requestMedalJsonData()
      } else {
        this.searchMedalJsonData()
      }
    },
    // 搜索勋章列表
    searchMedalJsonData() {
      this.$axios.post(this.$global.sApi + '/addexz', JSON.stringify({
        'type': 5,
        'name': this.medalSearch
      })).then(res => {
        this.medalJsonData = res.data.data[0]
      })
    },
    // 勋章列表
    requestMedalJsonData() {
      this.$axios.post(this.$global.sApi + '/addexz', JSON.stringify({
        'type': 4,
        'current_page': 1,
        'perpage': 9999
      })).then(res => {
        this.medalJsonData = res.data.data.data
      })
    },
    handleClose(tag) {
      if (this.defaultSelected.indexOf(tag.id) > -1) {
        this.defaultSelected.splice(this.defaultSelected.indexOf(tag.id), 1)
      }
      if (this.firmCheck.indexOf(tag) > -1) {
        this.$delete(this.firmCheck, this.firmCheck.indexOf(tag))
      }
      if (this.teachingPlanForm.attendFirm.indexOf(tag) > -1) {
        this.$delete(this.teachingPlanForm.attendFirm, this.teachingPlanForm.attendFirm.indexOf(tag))
      }
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
          this.teachingPlanForm.imageUrl = res.data.path
          this.loading = false
        })
      } else {
        this.$message({
          message: fileStatus,
          type: 'error'
        })
      }
    },
    // 全选企业
    selectAll() {
      if (this.firmJsonData.length > 10) {
        this.$message({
          message: '企业不得超过10家，无法全选',
          type: 'warning'
        })
        this.$refs.firmTable.clearSelection()
        this.defaultSelected = []
        this.copyFirm = []
        this.firmCheck = []
        this.teachingPlanForm.attendFirm = []
      }
    },
    handleSelectionFirm(val) {
      val.forEach(element => {
        if (!this.defaultSelected.includes(element.id)) {
          this.defaultSelected.push(element.id)
          this.copyFirm.push(element)
        }
      });
      this.firmCheck = this.copyFirm
    },
    checkFirm() {
      if (this.firmCheck.length > 10) {
        this.$message({
          message: '最多只能选择10个，当前已选择：' + this.firmCheck.length + '个',
          type: 'warning'
        })
      } else {
        this.teachingPlanForm.attendFirm = this.firmCheck
        this.skFirmDialog = false
      }
    },
    handleSelectionCourse(val) {
      this.courseCheck = val
    },
    checkCourse() {
      this.teachingPlanForm.teachingPlanCourse = this.courseCheck
      this.courseDialog = false
    },
    handleSelectionExam(val) {
      this.examCheck = val
    },
    checkExam() {
      this.teachingPlanForm.teachingPlanExam = this.examCheck
      this.examDialog = false
    },
    handleSelectionMedal(val) {
      this.medalCheck = val
    },
    checkMedal() {
      this.teachingPlanForm.teachingPlanMedal = this.medalCheck
      this.medalDialog = false
    },
    handleSelectionStudent(val) {
      this.stduentCheck = val
    },
    checkStudent() {
      this.teachingPlanForm.teachingPlanObj = this.stduentCheck
      this.insertObj = false
    },
    // 院校专业菜单
    handleNodeClick(data) {
      if (data.type !== 'undefined' && data.type === 1) {
        // this.teachingPlanForm.teachingPlanSchool = data.id
        // this.clickMajor = 0
        // this.clickClasses = 0
      } else if (typeof data.classinfo === "object") {
        this.clickMajor = data.id
      } else {
        this.clickClasses = data.id
        this.stduentCheck = []
        this.teachingPlanForm.teachingPlanObj = []
        this.requestStudentInfoJsonData()
      }
    },
    // 树形菜单
    renderContent(h,{node,data,store}) {
      let addElement = arguments[0];
      return addElement('span',{class:"folder-box"},[
        addElement('i',{class:"folder-icon"}),
        addElement('span',"    "),
        addElement('span',arguments[1].node.label)
      ]);
    },
    // 提交
    submitTeachingPlan(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.courseCheck.length > 0) {
            if (this.modify) {
              this.modifyTeachingPlan(formName)
            } else {
              this.insertTeachingPlan(formName)
            }
          } else {
            this.$message({
              message: '请选择教学计划内容',
              type: 'warning'
            })
          }
        } else {
          return false;
        }
      });
    },  
    // 添加教学计划
    insertTeachingPlan(formName) {
      var firmList = ''
      this.teachingPlanForm.attendFirm.forEach(element => {
        firmList += element.id + ','
      });
      var courseList = ''
      this.teachingPlanForm.teachingPlanCourse.forEach(element => {
        courseList += element.id + ','
      });
      var teacherList = ''
      this.teachingPlanForm.teachingPlanCourse.forEach(element => {
        teacherList += element.persons + ','
      });
      var timeList = ''
      this.teachingPlanForm.teachingPlanCourse.forEach(element => {
        timeList += formatDate(new Date(element.ctime), 'yyyy-MM-dd hh:mm:ss') + ','
      });
      var examList = ''
      this.teachingPlanForm.teachingPlanExam.forEach(element => {
        examList += element.id + ','
      });
      var medalList = ''
      this.teachingPlanForm.teachingPlanMedal.forEach(element => {
        medalList += element.id + ','
      });
      var studentList = ''
      this.teachingPlanForm.teachingPlanObj.forEach(element => {
        studentList += element.id + ','
      });
      this.$axios.post(this.$global.sApi + '/addevent', JSON.stringify({
        'scinfoid': firmList.substring(0, firmList.length - 1),
        'major': this.teachingPlanForm.teachingPlan,
        'course': courseList.substring(0, courseList.length - 1),
        'test': examList.substring(0, examList.length - 1),
        'brief': this.teachingPlanForm.teachingPlanInfo == '' ? '暂无' : this.teachingPlanForm.teachingPlanInfo,
        'header': this.teachingPlanForm.imageUrl,
        'schoolid': parseInt(this.teachingPlanForm.teachingPlanSchool),
        'school': sessionStorage.getItem('schName'),
        'medal': medalList.substring(0, medalList.length - 1),
        'points': this.teachingPlanForm.teachingPlanIntegral,
        'res': this.teachingPlanForm.teachingPlanGrade,
        'class': this.teachingPlanForm.teachingPlanComplete,
        'classid': parseInt(this.clickClasses),
        'classobj': studentList.substring(0, studentList.length - 1),
        'persons': teacherList.substring(0, teacherList.length - 1),
        'classtime': timeList.substring(0, timeList.length - 1)
      })).then(res => {
        this.$message({
          message: '制定成功',
          type: 'success'
        })
        this.$refs[formName].resetFields()
        this.firmCheck = []
        this.courseCheck = []
        this.examCheck = []
        this.medalCheck = []
        this.stduentCheck = []
        this.clickClasses = ''
        this.clickMajor = ''
        this.copyFirm = []
        this.defaultSelected = []
        this.$router.go(0);
      })
    },
    toBack() {
      this.$router.push({ path: '/teaching/plan/list' })
    },
    dateFormat() {
      console.log(formatDate(new Date('2020-12-26 12:23:26'), 'yyyy-MM-dd hh:mm:ss'))
    }
  }
}
</script>

<style>
  .business-model-page .firm-box {
    display: flex;
    margin-top: 10px;
    flex-direction: row;
    align-items: center;
    width: 60%;
    flex-wrap: wrap;
  }

  .business-model-page .firm-box .el-tag--small {
    margin-right: 16px;
  }

  .button-new-tag {
    height: 22px;
    border: 1px dashed rgba(0,0,0,0.15);
    font-size: 12px;
    display: flex;
    align-items: center;
  }

  .marT {
    margin-top: 10px;
  } 

  .teachingPlanDesc {
    height: 17px;
    line-height: 17px;
    font-size: 12px;
    color: rgba(0,0,0,0.45);
    margin-top: 12px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  
  .title-desc {
    width: 80px;
    display: inline-block;
    text-align: right;
    color: rgba(0,0,0,0.65);
  }

  .title-right {
    text-align: left;
  }

  .title-box {
    margin-top: 16px;
  }

  .business-bottom-box {
    width: 100%;
    height: 60px;
    position: absolute;
    bottom: 0;
    left: -16px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .business-control {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .el-row {
    margin-top: -20px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .item_tag {
    margin-bottom: 10px;
  }
</style>
