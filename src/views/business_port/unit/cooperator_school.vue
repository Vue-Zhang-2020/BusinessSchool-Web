<template>
  <div class="business-model-all-page">
    <el-scrollbar style="height:100%">
      <span class="top-title">合作学校</span>
      <div class="top-control">
        <el-button icon="el-icon-plus" class="blue-btn" @click="showModifyModal(0, '', 0)">合作学校</el-button>
      </div>
      <div>
        <el-table
          :data="classesJsonData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="序号"
            width="80">
            <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pagesize + 1}} </span></template>
          </el-table-column>
          <el-table-column
            prop="scname"
            label="合作学校"
            width="160">
          </el-table-column>
          <el-table-column
            prop="pros"
            label="主要专业"
            width="160">
            <template slot-scope="scope">
              <span v-for="(major, index) in scope.row.pros" :key="index">
                <span>{{major.proname}}</span><br>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="usernumber"
            label="学校账号"
            width="160">
          </el-table-column>
          <el-table-column
            prop="sumnum"
            label="人数"
            width="230">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="150">
            <template slot-scope="scope">
              <el-switch
                style="display: block"
                v-model="scope.row.status"
                @change="changeUnitStatus(scope.$index, scope.row, $event)"
                active-color="#6A6FCB"
                inactive-color="#D9D9D9">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope"> 
              <div class="contrl-box">
                <span class="control-span" @click="showLookModal(scope.$index, scope.row)">查看</span>
                <div class="h_line"></div>
                <span class="control-span" @click="showModifyModal(scope.$index, scope.row, 1)">编辑</span>
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
    <!-- 添加/编辑 -->
    <el-dialog :title="insertOrModifyModel == 0 ? '新增合作学校' : '编辑合作学校'" class="dialog-modal" :visible.sync="insertDialog">
      <el-form :model="schoolForm" :rules="rules" ref="classForm">
        <el-form-item label="名称：" prop="schoolName" :label-width="formLabelWidth">
          <el-input v-model="schoolForm.schoolName" style="width: 40%" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="初始账号：" prop="schoolAccount" :label-width="formLabelWidth">
          <el-input v-model="schoolForm.schoolAccount" style="width: 40%" :disabled="insertOrModifyModel === 1" placeholder="只支持数字和英文字母输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="初始密码：" prop="schoolPassword" :label-width="formLabelWidth">
          <el-input v-model="schoolForm.schoolPassword" style="width: 40%" placeholder="8-20位必须包含数字及字母" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('classForm')">{{ insertOrModifyModel == 0 ? '确认添加' : '确认编辑' }}</el-button>
      </div>
    </el-dialog>
    <!-- 查看Dialog -->
    <el-dialog title="合作学校详情" class="dialog-modal-box" style="margin-top: -30px;" :visible.sync="lookDialog">
      <el-form :model="schoolForm" :rules="rules" ref="classForm">
        <el-form-item label="学校名称：" :label-width="formLabelWidth">
          <span class="unit-span">{{schoolForm.schoolName}}</span>
        </el-form-item>
        <el-form-item label="人数："  :label-width="formLabelWidth">
          <span class="unit-span">{{schoolForm.schoolPerson}}</span>
        </el-form-item>
        <el-form-item label="学校账号：" :label-width="formLabelWidth">
          <span class="unit-span">{{schoolForm.schoolAccount}}</span>
        </el-form-item>
        <el-form-item label="学校密码：" :label-width="formLabelWidth">
          <span class="unit-span">{{schoolForm.schoolPassword}}</span> 
        </el-form-item> 
        <el-form-item label="学校专业以及各专业人数" :label-width="'230px'">
        </el-form-item>
        <table class="table-style" border="1px solid #D9D9D9" cellspacing="0" cellpadding="0">
          <tr>
            <td width="206">专业</td>
            <td width="206">人数</td>
          </tr>
          <tr v-for="(major, index) in schoolForm.schoolMajorData" :key="index">
            <td width="206">{{major.proname}}</td>
            <td width="206">{{major.pronum}}</td>
          </tr>
        </table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookDialog = false">返回</el-button>
      </div>
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
      pagesize: 5,
      insertDialog: false,
      lookDialog: false,
      formLabelWidth: '110px',
      insertOrModifyModel: 0, // 0 insert 1 modify
      schoolForm: {
        schoolId: '',
        schoolName: '',
        schoolAccount: '',
        schoolPassword: '',
        schoolPerson: '',
        schoolMajorData: []
      },
      rules: {
        schoolName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        schoolAccount: [
          { required: true, message: '请输入初始账号', trigger: 'blur' }
        ],
        schoolPassword: [
          { required: true, message: '请输入初始密码', trigger: 'blur' }
        ]
      },
      classesJsonData: [], // 班级列表数据
    }
  },
  created() {
    this.schoolId = this.$store.getters.schoolId
    this.requestCoopeSchoolJsonData()
  },
  watch: {
    lookDialog(old) {
      if (!old) {
        this.schoolForm = {
          schoolId: '',
          schoolName: '',
          schoolAccount: '',
          schoolPassword: '',
          schoolPerson: '',
          schoolMajorData: []
        }
      }
    },
    insertDialog(old) {
      if (!old) {
        this.schoolForm = {
          schoolId: '',
          schoolName: '',
          schoolAccount: '',
          schoolPassword: '',
          schoolPerson: '',
          schoolMajorData: []
        }
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val
      this.requestCoopeSchoolJsonData()
    },
    handleCurrentChange(val) {
      this.requestCoopeSchoolJsonData()
    },
    // 改变学校状态
    changeUnitStatus(index, row, e) {
      this.$axios.post(this.$global.sApi + '/addcom', JSON.stringify({
        'id': row.id,
        'type': 5,
        'status': row.status === false ? 1 : 2
      })).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    // 获取学校列表
    requestCoopeSchoolJsonData() {
      this.$axios.post(this.$global.sApi + '/addscuser', JSON.stringify({
        'current_page': this.currentPage,
        'perpage': this.pagesize,
        'type': 3
      })).then(res => {
        const json = res.data.data.data
        this.total = res.data.data.total
        if (json.length > 0) {
          this.classesJsonData = json
        }
      })
    },
    // 显示编辑Dialog
    showModifyModal(index, row, flag) {
      this.insertOrModifyModel = flag
      if (this.insertOrModifyModel === 1) {
        this.schoolForm.schoolId = row.id
        this.schoolForm.schoolName = row.scname
        this.schoolForm.schoolAccount = row.usernumber
      }
      this.insertDialog = true
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.insertOrModifyModel === 0) {
            this.insertClassesApi(formName)
          } else {
            this.modifyClassesApi(formName)
          }
        } else {
          return false;
        }
      });
    },
    // 显示查看Dialog
    showLookModal(index, row) {
      this.$axios.post(this.$global.sApi + '/addscuser', JSON.stringify({
        'type': 4,
        'id': row.id
      })).then(res => {
        this.schoolForm.schoolName = row.scname
        this.schoolForm.schoolPerson = row.sumnum
        this.schoolForm.schoolAccount = row.usernumber
        this.schoolForm.schoolPassword = row.userpass
        this.schoolForm.schoolMajorData = res.data.data[0].proinf
        this.lookDialog = true
      })
    },
    // 添加学校
    insertClassesApi(formName) {
      this.$axios.post(this.$global.sApi + '/addscuser', JSON.stringify({
        'usernumber': this.schoolForm.schoolAccount,
        'userpass': this.schoolForm.schoolPassword,
        'scname': this.schoolForm.schoolName,
        'type': 1
      })).then(res => {
        this.insertDialog = false
        this.$refs[formName].resetFields();
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.requestCoopeSchoolJsonData()
      })
    },
    // 编辑学校
    modifyClassesApi(formName) {
      this.$axios.post(this.$global.sApi + '/addscuser', JSON.stringify({
        'scnameid': this.schoolId,
        'scname': this.schoolForm.schoolName,
        'userpass': this.schoolForm.schoolPassword,
        'id': parseInt(this.schoolForm.schoolId),
        'type': 2
      })).then(res => {
        console.log(res)
        this.insertDialog = false
        this.unitForm = {}
        this.$refs[formName].resetFields();
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.requestCoopeSchoolJsonData()
      })
    }
  }
}
</script>

<style>
  .dialog-modal .el-dialog .el-dialog__body {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  .avatar-uploader-icon {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }

  .unit-span {
    font-size: 14px;
    color: rgba(0,0,0,0.65);
  }

  .table-style tr td {
    font-size: 14px;
    color: rgba(0,0,0,0.65);
    padding: 6px 16px;
  }

  .dialog-modal-box .el-form-item {
    margin-bottom: 0px !important;
  }
</style>
