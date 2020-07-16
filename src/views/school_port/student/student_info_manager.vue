<template>
  <div class="box-model-page">
    <el-scrollbar style="height: 100%">
      <span class="top-title">学生资料管理</span>
      <div class="top-control">
        <el-button icon="el-icon-plus" class="blue-btn" @click="showInserModal(0, '', 0)">添加学生资料</el-button>
        <el-button icon="el-icon-plus" class="blue-btn-two" @click="showBatchModal">批量录入学生资料</el-button>
      </div>
      <div>
        <el-row class="screen-box">
          <el-col class="row" :span="6">
            <label class="label-titile">专业</label>
            <el-select v-model="major" :clearable="true" @clear="clearMajor" placeholder="全部" @change="majorSelect">
              <el-option
                v-for="item in majorOptions"
                :key="item.id"
                :label="item.proname"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col class="row" :span="6">
            <label class="label-titile">班级</label>
            <el-select v-model="classes" :clearable="true" @clear="clearClasses" placeholder="全部" @change="classesSelect">
              <el-option
                v-for="item in classesOptions"
                :key="item.id"
                :label="item.classname"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col class="row" :span="12">
            <el-input v-model="searchContent" style="width: 50%" placeholder="请输入要搜索的内容"></el-input>
            <el-button class="search-btn" @click="searchStudentInfo">搜索</el-button>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="4">
          <el-tree :data="studentJsonData" :props="defaultProps" @node-click="handleNodeClick" :render-content="renderContent"></el-tree>
        </el-col>
        <el-col :span="1">
          <div class="s_line"></div>
        </el-col>
        <el-col class="table-box" :span="19">
          <el-table
            :data="studentInfoJsonData"
            style="width: 100%; margin-left: 35px;">
            <el-table-column
              prop="date"
              label="序号"
              width="80">
              <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pagesize + 1}} </span></template>
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
              label="出生年月"
              width="110">
              <template slot-scope="scope">
                <span>{{scope.row.age.substring(2, scope.row.age.indexOf('月') + 1)}}</span>
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
            <!-- <el-table-column
              prop="number"
              label="人数"
              width="80">
            </el-table-column> -->
            <el-table-column
              label="操作">
              <template slot-scope="scope"> 
                <div class="contrl-box">
                  <span class="control-span" @click="showInserModal(scope.$index, scope.row, 1)">编辑</span>
                  <!-- <div class="h_line"></div>
                  <span class="control-span">查看</span> -->
                  <div class="h_line"></div>
                  <span class="control-span" @click="showDeleteModal(scope.$index, scope.row)">删除</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
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
      class="table-pagina"
      style="margin-right: 0;">
    </el-pagination>
    <!-- 添加学生资料 -->
    <el-dialog :title="insertOrModifyModel === 0 ? '添加学生资料' : '编辑学生资料'" width="40%" :visible.sync="insertSingleStudentInfoDialog">
      <el-form :model="studentInfoForm" :rules="rules" ref="studentForm">
        <el-form-item label="姓名：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="studentInfoForm.name" style="width: 37%" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业：" prop="major" :label-width="formLabelWidth">
          <el-select v-model="studentInfoForm.major" style="width: 37%" placeholder="请选择" @change="formMajorSelect">
            <el-option
              v-for="item in majorOptions"
              :key="item.id"
              :label="item.proname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生年月：" prop="birthday" :label-width="formLabelWidth">
          <el-date-picker
            style="width: 60%"
            v-model="studentInfoForm.birthday"
            :clearable="false"
            type="date"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="年级："  prop="grade" :label-width="formLabelWidth">
          <el-select v-model="studentInfoForm.grade" style="width: 50%" placeholder="请选择">
            <el-option
              v-for="item in gradeOptions"
              :key="item.id"
              :label="item.grade"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级：" prop="classes" :label-width="formLabelWidth">
          <el-select v-model="studentInfoForm.classesId" value-key="id" style="width: 37%" placeholder="请选择" @change="formClassesSelect">
            <el-option
              v-for="item in classesOptions"
              :key="item.id"
              :label="item.classname"
              v-bind:value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式：" prop="photo" :label-width="formLabelWidth">
          <el-input v-model="studentInfoForm.photo" maxlength="11" style="width: 60%" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertSingleStudentInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('studentForm')">确定添加</el-button>
      </div>
    </el-dialog>
    <!-- 批量录入学生资料 -->
    <el-dialog
      title="批量录入学生资料"
      :visible.sync="batchDialog"
      v-loading="loading"
      element-loading-text="拼命上传中...请勿离开当前页面"
      element-loading-spinner="el-icon-loading"
      width="60%">
      <div class="batch-box" @click="downloadModal">
        <img src="../../../assets/page/excel.png" width="16" height="16" alt="">
        <span class="batch-title">学生资料模板</span>
        <span class="batch-msg">（点击下载模板）</span>
      </div>
      <div class="batch-desc">
        <span>
          填写要求：不能改变第一行的内容，保持表头不变，标记*为必填项 <br>
          其他填写按照要求： <br>
          姓名：只能输入汉字，最多输入10个字 <br>
          年级：只能输入：一年级、二年级、三年级、四年级、五年级 <br>
          班级名称：按照班级管理录入的填写 <br>
          专业名称：按照专业管理录入的填写 <br>
          手机号码：只能填写11位数字 <br>
          文件不能超过10MB
        </span>
      </div>
      <p class="batch-upload-title">上传文件：</p>
      <el-upload
        class="upload-demo"
        action
        multiple
        :show-file-list="false"
        :http-request="uploadImg">
        <el-button size="small" icon="el-icon-upload2">上传文件</el-button>
        <div slot="tip" class="upload-desc">(只能上传xlxs/xls格式的文件)</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchDialog = false">取 消</el-button>
        <el-button type="primary" @click="batchDialog = false">{{ insertOrModifyModel === 0 ? '确认添加' : '确认修改' }}</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteStudentDialog"
      width="40%">
      <span>确认删除此学生吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteStudentDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteStudent()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {formatDate} from '../../../utils/formatDate'
export default {
  name: 'info',
  data () {
    return {
      schoolId: 0, // 学校Id
      major: '', // 专业
      clickMajor: 0,
      classes: '', // 班级
      clickClasses: 0,
      deleteStudentId: '', // 删除学生Id
      insertOrModifyModel: 0,  // 0 添加 1 编辑
      total: 0,
      currentPage: 1,
      pagesize: 5,
      loading: false,
      searchContent: '', // 搜索内容
      insertSingleStudentInfoDialog: false, // 添加单个学生 Dailog
      deleteStudentDialog: false, // 删除Dialog
      batchDialog: false,
      formLabelWidth: '120px',
      gradeOptions: [ // 年级Json
        {
          id: '1',
          grade: '一年级'
        },
        {
          id: '2',
          grade: '二年级'
        },
        {
          id: '3',
          grade: '三年级'
        },
        {
          id: '4',
          grade: '四年级'
        },
        {
          id: '5',
          grade: '五年级'
        }
      ],
      birthday: '',
      studentInfoForm: { // 学生Form
        id: '',
        name: '',
        major: '',
        birthday: '',
        grade: '',
        classesId: 0,
        classes: {
          classname: '',
          id: ''
        },
        photo: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        major: [
          { required: true, message: '请选择专业', trigger: 'change' }
        ],
        birthday: [
          { type: 'date', required: true, message: '请选择出生年月', trigger: 'change' }
        ],
        grade: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        classes: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ],
        photo: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ]
      },
      initData: [],
      majorOptions: [], // 专业数据
      classesOptions: [], // 学校数据
      studentInfoJsonData: [], // 学生资料
      studentJsonData: [], // 学校数据
      defaultProps: {
        children: 'classinfo',
        label: 'classname'
      }
    }
  },
  created() {
    this.schoolId = this.$store.getters.schoolId
    this.requestStudentInfoJsonData()
    this.requestSchoolJsonData()
    this.requestMajorJsonData()
  },
  watch: {
    insertSingleStudentInfoDialog(val) {
      if (!val) {
        this.$refs.studentForm.resetFields()
        this.studentInfoForm.id = ''
        this.studentInfoForm.name = ''
        this.studentInfoForm.major = ''
        this.studentInfoForm.birthday = ''
        this.studentInfoForm.grade = ''
        this.studentInfoForm.classesId = 0
        this.studentInfoForm.classes.classname = ''
        this.studentInfoForm.photo = ''
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val
      this.requestStudentInfoJsonData()
    },
    handleCurrentChange(val) {
      this.requestStudentInfoJsonData()
    },
    // 添加学生资料
    showInserModal(index, row, flag) {
      this.requestClassesJsonData()
      this.insertOrModifyModel = flag
      if (this.insertOrModifyModel === 1) {
        this.studentInfoForm.id = row.id
        this.studentInfoForm.name = row.username
        this.studentInfoForm.major = row.proname
        this.studentInfoForm.birthday = this.stringToDate(row.age)
        this.studentInfoForm.grade = row.live
        this.studentInfoForm.classes.classname = row.classname
        this.studentInfoForm.classes.id = row.classinfoid
        this.studentInfoForm.classesId = parseInt(row.classinfoid)
        this.studentInfoForm.photo = row.phone
      }
      this.insertSingleStudentInfoDialog = true
    },
    // 时间格式化
    stringToDate(str) {
      var year = str.substring(0, str.indexOf('年'))
      var month = str.substring(str.indexOf('年') + 1, str.indexOf('月'))
      var day = str.substring(str.indexOf('月') + 1, str.indexOf('日'))
      let date = `${year}-${month}-${day}`
      return new Date(date)
    },
    // 清空专业筛选
    clearMajor() {
      this.major = ''
      this.classes = ''
      this.classesOptions = this.initData
      console.log(this.classesOptions)
      this.requestStudentInfoJsonData(0, 0)
    },
    // 清空班级筛选
    clearClasses() {
      if (this.major != '') {
        this.requestStudentInfoJsonData(this.major, 0)
      } else {
        this.requestStudentInfoJsonData(0, 0)
      }
    },
    // 批量录入学生资料
    showBatchModal() {
      this.batchDialog = true
    },
    searchStudentInfo() {
      this.requestStudentInfoJsonData(this.major, this.classes)
    },
    // 获取学生资料列表
    requestStudentInfoJsonData(major, classes) {
      this.$axios.post(this.$global.sApi + '/findstu', JSON.stringify({
        'scinfoid': this.schoolId,
        'current_page': this.currentPage,
        'perpage': this.pagesize,
        'phone': '',
        'username': this.searchContent,
        'proinfoid': major,
        'lclassinfoid': classes
      })).then(res => {
        this.total = res.data.data.total
        const json = res.data.data.data
        this.studentInfoJsonData = json
      })
    },
    // 获取学校数据
    requestSchoolJsonData() {
      this.$axios.post(this.$global.sApi + '/navigation', JSON.stringify({
        'scinfoid': this.schoolId
      })).then(res => {
        this.studentJsonData = res.data.data
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
    },
    // 获取班级列表
    requestClassesJsonData() {
      this.$axios.post(this.$global.sApi + '/listclass', JSON.stringify({
        'scinfoid': this.schoolId,
        'current_page': 1,
        'perpage': 9999
      })).then(res => {
        const json = res.data.data.data
        this.classesOptions = json
      })
    },
    // 显示删除学生 Dialog
    showDeleteModal(index, row) {
      this.deleteStudentId = row.id
      this.deleteStudentDialog = true
    },
    // 删除学生信息
    deleteStudent() {
      this.$axios.post(this.$global.sApi + '/addstuinfo', JSON.stringify({
        'stuinfoid': parseInt(this.deleteStudentId),
        type: 3
      })).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.deleteStudentDialog = false
        this.requestStudentInfoJsonData()
      })
    },
    // 专业选择
    majorSelect() {
      this.requestStudentInfoJsonData(this.major, 0)
      this.requestClassesJsonData()
    },
    // 班级选择
    classesSelect() {
      this.requestStudentInfoJsonData(this.major, this.classes)
    },
    // 表单专业选择
    formMajorSelect() {

    },
    // 表单班级选择
    formClassesSelect(e) {
      
    },
    // 院校专业菜单
    handleNodeClick(data) {
      if (data.type !== 'undefined' && data.type === 1) {
        this.schoolId = data.id
        this.clickMajor = 0
        this.clickClasses = 0
      } else if (typeof data.classinfo === "object") {
        this.clickMajor = parseInt(data.id)
      } else {
        this.clickClasses = parseInt(data.id)
      }
      this.requestStudentInfoJsonData(this.clickMajor, this.clickClasses)
    },
    // 树形菜单
    renderContent(h,{node,data,store}) {
      let addElement = arguments[0];
      return addElement('span',{class:"folder-box"},[
        addElement('i',{class:"folder-icon"}),
        addElement('span',"    "),
        addElement('span', arguments[1].node.label)
      ]);
    },
    // 下载模板
    downloadModal() {
      // 加载loading
      this.loading = true
      this.$axios.get(this.$global.sApi + '/article/批量导入模板.xlsx')
      .then((res) => {
        // 关闭loading
        this.loading = false
        const content = res.data
        const blob = new Blob([content])
        const fileName = '学生资料模板.xls'
        if ('download' in document.createElement('a')) { 
          const link = document.createElement('a')
          link.download = fileName 
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          document.body.appendChild(link)
          link.click() 
          URL.revokeObjectURL(link.href) 
          document.body.removeChild(link)
        } else { 
          navigator.msSaveBlob(blob, fileName)
        }
      }).catch((error) => {
        console.log(error)
        // 关闭loading
        this.loading = false
      })
    },
    // 文件选择
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    // 前端校验文件上传是否符合条件
    file_info_check(file){
      var ret = "";
      if(file === undefined){
          ret = "";
      }
      var max_file_size = 2 *1024 *1024;
      if(file.size > max_file_size){
          ret = "文件不能大于2Mb";
      }
      var allow_type = ".xlsx";
      var allow_type2 = ".xls";
      if(file.name.indexOf(allow_type) === -1){
        ret = "文件格式要求是.xls/.xlsx";
      } else {
        ret = 'success';
        return ret
      }
      if(file.name.indexOf(allow_type2) === -1){
        ret = "文件格式要求是.xls/.xlsx";
      } else {
        ret = 'success';
        return ret
      }
      this.loading = false
      return ret;
    },
    uploadImg(fileObj) {
      this.loading = true
      let fileStatus = this.file_info_check(fileObj.file)
      if (fileStatus === 'success') {
        let formData = new FormData();
        formData.append("file", fileObj.file);
        formData.append("scinfoid", this.schoolId);
        this.$axios.post(this.$global.sApi + '/exclein', formData, {
          headers: {
            "Content-type": "multipart/form-data"
          }
        }).then(res => {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.loading = false
        })
      } else {
        this.$message({
          message: fileStatus,
          type: 'error'
        })
        this.loading = false
      }
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.insertOrModifyModel === 0) {
            this.insertStudentInfoApi(formName)
          } else {
            this.modifyStudentInfoApi(formName) 
          }
        } else {
          return false;
        }
      });
    },
    // 添加学生资料
    insertStudentInfoApi(formName) {
      this.$axios.post(this.$global.sApi + '/addstuinfo', JSON.stringify({
        'username': this.studentInfoForm.name,
        'age': formatDate(this.studentInfoForm.birthday, 'yyyy年MM月dd日'),
        'live': this.studentInfoForm.grade,
        'classname': this.studentInfoForm.classes.classname,
        'classinfoid': parseInt(this.studentInfoForm.classes.id),
        'scinfoid': this.schoolId,
        'phone': this.studentInfoForm.photo,
        'type': 1
      })).then(res => {
        this.insertSingleStudentInfoDialog = false
        this.$refs[formName].resetFields();
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.requestStudentInfoJsonData()
      })
    },
    // 编辑学生资料
    modifyStudentInfoApi(formName) {
      this.$axios.post(this.$global.sApi + '/addstuinfo', JSON.stringify({
        'stuinfoid': parseInt(this.studentInfoForm.id),
        'username': this.studentInfoForm.name,
        'age': formatDate(this.studentInfoForm.birthday, 'yyyy年MM月dd日'),
        'live': this.studentInfoForm.grade,
        'classname': this.studentInfoForm.classes.classname,
        'classinfoid': parseInt(this.studentInfoForm.classes.id),
        'phone': this.studentInfoForm.photo,
        'scinfoid': this.schoolId,
        'type': 2
      })).then(res => {
        this.insertSingleStudentInfoDialog = false
        this.studentInfoForm.id = ''
        this.studentInfoForm.name = ''
        this.studentInfoForm.major = ''
        this.studentInfoForm.birthday = ''
        this.studentInfoForm.grade = ''
        this.studentInfoForm.classes.classname = ''
        this.studentInfoForm.photo = ''
        this.$refs[formName].resetFields();
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.requestStudentInfoJsonData()
      })
    }
  }
}
</script>

<style scoped>
  .batch-box {
    cursor: pointer;
    padding: 0 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .batch-title {
    font-size: 14px;
    color: #E23628;
    margin: 0 6px;
  }

  .batch-msg {
    font-size: 14px;
    color: rgba(0,0,0,0.45);
  }

  .batch-desc {
    padding: 0 5px;
    margin: 13px 0 30px 0;
  }

  .batch-desc span {
    font-size: 12px;
    color: rgba(0,0,0,0.55);
    line-height: 22px;
  }

  .batch-upload-title {
    font-size: 14px;
    color: rgba(0,0,0,0.85);;
  }

  .upload-desc {
    font-size: 12px;
    margin-top: 8px;
    color: rgba(0,0,0,0.45);
  }

</style>
