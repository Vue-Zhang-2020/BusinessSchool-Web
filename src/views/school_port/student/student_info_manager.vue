<template>
  <div class="box-model-page">
    <span class="top-title">学生成绩管理</span>
    <div class="top-control">
      <el-button icon="el-icon-plus" class="blue-btn" @click="showInserModal">添加学生资料</el-button>
      <el-button icon="el-icon-plus" class="blue-btn-two" @click="showBatchModal">批量录入学生资料</el-button>
    </div>
    <el-row class="screen-box">
      <el-col class="row" :span="6">
        <label class="label-titile">专业</label>
        <el-select v-model="major" placeholder="全部" @change="majorSelect">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.majorName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="row" :span="6">
        <label class="label-titile">班级</label>
        <el-select v-model="classes" placeholder="全部" @change="classesSelect">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.majorName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="row" :span="12">
        <el-input v-model="searchContent" style="width: 50%" placeholder="请输入要搜索的内容"></el-input>
        <el-button class="search-btn">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" :render-content="renderContent"></el-tree>
      </el-col>
      <el-col :span="1">
        <div class="s_line"></div>
      </el-col>
      <el-col class="table-box" :span="19">
        <el-table
          :data="tableData"
          style="width: 100%; margin-left: 35px;">
          <el-table-column
            prop="date"
            label="序号"
            width="80">
            <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pagesize + 1}} </span></template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="学生姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="major"
            label="专业"
            width="140">
          </el-table-column>
          <el-table-column
            prop="birthday"
            label="出生年月"
            width="110">
          </el-table-column>
          <el-table-column
            prop="grade"
            label="年级"
            width="100">
          </el-table-column>
          <el-table-column
            prop="classes"
            label="班级"
            width="150">
          </el-table-column>
          <el-table-column
            prop="number"
            label="人数"
            width="80">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope"> 
              <div class="contrl-box">
                <span class="control-span">编辑</span>
                <div class="h_line"></div>
                <span class="control-span">查看</span>
                <div class="h_line"></div>
                <span class="control-span">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size='pagesize'
          layout="sizes, prev, pager, next"
          :total="total"
          class="table-pagina">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 添加学生资料 -->
    <el-dialog title="添加学生资料" width="40%" :visible.sync="insertSingleStudentInfoDialog">
      <el-form :model="studentInfoForm" :rules="rules" ref="studentForm">
        <el-form-item label="姓名：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="studentInfoForm.name" style="width: 37%" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业：" prop="major" :label-width="formLabelWidth">
          <el-select v-model="studentInfoForm.major" style="width: 37%" placeholder="请选择" @change="formMajorSelect">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.majorName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生年月：" prop="birthday" :label-width="formLabelWidth">
          <el-date-picker
            style="width: 60%"
            v-model="studentInfoForm.birthday"
            type="date"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="年级："  prop="grade" :label-width="formLabelWidth">
          <el-select v-model="studentInfoForm.grade" style="width: 50%" placeholder="请选择" @change="formMajorSelect">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.majorName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级：" prop="classes" :label-width="formLabelWidth">
          <el-select v-model="studentInfoForm.classes" style="width: 37%" placeholder="请选择" @change="formMajorSelect">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.majorName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式：" prop="photo" :label-width="formLabelWidth">
          <el-input v-model="studentInfoForm.photo" style="width: 60%" placeholder="请输入" autocomplete="off"></el-input>
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
        <el-button type="primary" @click="batchDialog = false">确认添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'info',
  data () {
    return {
      major: '', // 专业
      classes: '', // 班级
      total: 100,
      currentPage: 1,
      pagesize: 5,
      loading: false,
      searchContent: '', // 搜索内容
      insertSingleStudentInfoDialog: false,
      batchDialog: false,
      formLabelWidth: '120px',
      studentInfoForm: { // 学生Form
        name: '',
        major: '',
        birthday: '',
        grade: '',
        classes: '',
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
      options: [ // 模拟数据
        {
          id: '1',
          majorName: '软件工程'
        },
        {
          id: '2',
          majorName: '建筑工程'
        }
      ],
      data: [{
          label: '东莞中职院',
          children: [{
            label: '计算机专业',
            children: [
              {
                label: '计算机专业1班'
              },
              {
                label: '计算机专业2班'
              }
            ]
          }]
        }, {
          label: '软件专业',
          children: [{
            label: '软件专业2',
            children: [{
              label: '软件专业3'
            }]
          }, {
            label: '软件专业 2-2',
            children: [{
              label: '软件专业 2-2-1'
            }]
          }]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [
        {
          id: '1',
          name: '张三',
          major: '软件工程',
          birthday: '20年7月',
          grade: '大三',
          classes: '计算机1班',
          number: '99'
        }
      ]

    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 添加学生资料
    showInserModal() {
      this.insertSingleStudentInfoDialog = true
    },
    // 批量录入学生资料
    showBatchModal() {
      this.batchDialog = true
    },
    // 专业选择
    majorSelect() {

    },
    // 班级选择
    classesSelect() {

    },
    // 表单专业选择
    formMajorSelect() {

    },
    // 院校专业菜单
    handleNodeClick(data) {
      console.log(data);
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
    // 下载模板
    downloadModal() {
      // 加载loading
      this.loading = true
      this.$axios.post('', JSON.stringify({}))
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
      return ret;
    },
    uploadImg(fileObj) {
      this.loading = true
      let fileStatus = this.file_info_check(fileObj.file)
      if (fileStatus === 'success') {
        let formData = new FormData();
        formData.append("file", fileObj.file);
        formData.append("id", this.compeSelect);
        formData.append("gameUrl", this.gameUrl);
        this.$axios.post(this.$global.proUrl + '/uploadingFile', formData, {
          headers: {
            "Content-type": "multipart/form-data"
          }
        }).then(res => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
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
          this.insertSingleStudentInfoDialog = false
          this.$refs[formName].resetFields();
        } else {
          return false;
        }
      });
    },
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
