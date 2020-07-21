<template>
  <div class="business-model-all-page">
    <el-scrollbar style="height:100%">
      <span class="top-title">合作单位</span>
      <div class="top-control">
        <el-button icon="el-icon-plus" class="blue-btn" @click="showModifyModal(0, '', 0)">合作企业</el-button>
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
            prop="comname"
            label="合作企业"
            width="160">
          </el-table-column>
          <el-table-column
            prop="usernumber"
            label="企业账号"
            width="160">
          </el-table-column>
          <el-table-column
            prop="num"
            label="企业规模"
            width="160">
          </el-table-column>
          <el-table-column
            prop="userpass"
            label="初始密码"
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
    <el-dialog :title="insertOrModifyModel == 0 ? '新增合作企业' : '编辑合作企业'" class="dialog-modal" :visible.sync="insertDialog" style="margin-top: -60px;">
      <el-form :model="unitForm" :rules="rules" ref="classForm">
        <el-form-item label="企业头像：" v-if="insertOrModifyModel === 0" prop="teachingPlanImg" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action
            :show-file-list="false"
            multiple
            :http-request="uploadImg">
            <img v-if="unitForm.unitImg" :src="unitForm.unitImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>        
        </el-form-item>
        <el-form-item label="企业名称：" prop="unitName" :label-width="formLabelWidth">
          <el-input v-model="unitForm.unitName" style="width: 40%" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="主要经营：" prop="unitManager" :label-width="formLabelWidth">
          <el-input v-model="unitForm.unitManager" style="width: 40%" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="规模：" prop="unitScale" :label-width="formLabelWidth">
          <el-input-number :min="1" :max="999999" :controls="false" v-model="unitForm.unitScale" type="number" style="width: 20%" placeholder="请输入" autocomplete="off"></el-input-number><span>   人</span>
        </el-form-item>
        <el-form-item label="企业介绍：" prop="unitMsg" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="unitForm.unitMsg" style="width: 60%;"></el-input>
        </el-form-item> 
        <el-form-item label="初始账号：" prop="unitAccount" :label-width="formLabelWidth">
          <el-input v-model="unitAccount" ref="unitAccount" minlength="8" maxlength="40" style="width: 40%" :disabled="insertOrModifyModel === 1" placeholder="只支持数字和英文字母输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="初始密码：" prop="unitPassword" :label-width="formLabelWidth">
          <el-input v-model="unitPassword" ref="unitPassword" minlength="8" maxlength="20" style="width: 40%" placeholder="8-20位必须包含数字及字母" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertDialog = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="submitForm('classForm')">{{ insertOrModifyModel == 0 ? '确认添加' : '确认编辑' }}</el-button>
      </div>
    </el-dialog>
    <!-- 查看Dialog -->
    <el-dialog title="合作企业详情" class="dialog-modal" :visible.sync="lookDialog" style="margin-top: -60px;">
      <el-form :model="unitForm" :rules="rules" ref="classForm">
        <el-form-item label="企业头像：" :label-width="formLabelWidth">
          <img width="104" height="104" :src="unitForm.unitImg" alt="" style="padding: 8px;border: 1px solid rgba(0,0,0,0.15);border-radius: 2px;">     
        </el-form-item>
        <el-form-item label="企业名称：" :label-width="formLabelWidth">
          <span class="unit-span">{{unitForm.unitName}}</span>
        </el-form-item>
        <el-form-item label="主要经营："  :label-width="formLabelWidth">
          <span class="unit-span">{{unitForm.unitManager}}</span>
        </el-form-item>
        <el-form-item label="规模：" :label-width="formLabelWidth">
          <span class="unit-span">{{unitForm.unitScale}}</span>
        </el-form-item>
        <el-form-item label="企业介绍：" :label-width="formLabelWidth">
          <span class="unit-span">{{unitForm.unitMsg}}</span>
        </el-form-item> 
        <el-form-item label="初始账号：" :label-width="formLabelWidth">
          <span class="unit-span">{{unitForm.unitAccount}}</span>
        </el-form-item>
        <el-form-item label="初始密码：" :label-width="formLabelWidth">
          <span class="unit-span">{{unitForm.unitPassword}}</span>
        </el-form-item>
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
    const validateUnitAccount = (rule, value, callback) => {
      var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
      if (value.length > 7 && value.length < 41 && reg.test(value)) {
        callback();
      } else {
        callback(new Error("只支持数字和英文字母输入"));
      }
    };
    const validateUnitPassword = (rule, value, callback) => {
      var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
      if (value.length > 7 && value.length < 21 && reg.test(value)) {
        callback();
      } else {
        callback(new Error("8-20位必须包含数字及字母"));
      }
    };
    return {
      total: 0,
      currentPage: 1,
      pagesize: 5,
      insertDialog: false,
      lookDialog: false,
      formLabelWidth: '110px',
      insertOrModifyModel: 0, // 0 insert 1 modify
      unitAccount: '',
      unitPassword: '',
      unitForm: {
        unitId: '',
        unitImg: '',
        unitName: '',
        unitManager: '',
        unitScale: '',
        unitMsg: '',
        unitAccount: '',
        unitPassword: ''
      },
      rules: {
        unitName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        unitManager: [
          { required: true, message: '请输入主要经营', trigger: 'blur' }
        ],
        unitScale: [
          { required: true, message: '请输入规模', trigger: 'blur' }
        ],
        unitAccount: [
          { required: true, trigger: 'blur', validator: validateUnitAccount }
        ],
        unitPassword: [
          { required: true, trigger: 'blur', validator: validateUnitPassword }
        ]
      },
      classesJsonData: [], // 班级列表数据
    }
  },
  watch: {
    lookDialog(old) {
      if (!old) {
        this.unitAccount = '',
        this.unitPassword = '',
        this.unitForm = {
          unitId: '',
          unitImg: '',
          unitName: '',
          unitManager: '',
          unitScale: '',
          unitMsg: '',
          unitAccount: '',
          unitPassword: ''
        }
      }
    },
    insertDialog(old) {
      if (!old) {
        this.unitAccount = '',
        this.unitPassword = '',
        this.unitForm = {
          unitId: '',
          unitImg: '',
          unitName: '',
          unitManager: '',
          unitScale: '',
          unitMsg: '',
          unitAccount: '',
          unitPassword: ''
        }
        
        this.$nextTick(function () {
          this.$refs['classForm'].clearValidate();
        })
      }
    },
    unitAccount() {
      this.unitForm.unitAccount = this.unitAccount.trim()
    },
    unitPassword() {
      this.unitForm.unitPassword = this.unitPassword.trim()
    }
  },
  created() {
    if (this.$route.query.type !== 'undefined' && this.$route.query.type === 1) {
      setTimeout(() => {
        this.insertOrModifyModel = 0
        this.insertDialog = true
      }, 500)
    }
    this.schoolId = this.$store.getters.schoolId
    this.requestCoopeUnitJsonData()
  }, 
  methods: {
    handleSizeChange(val) {
      this.pagesize = val
      this.requestCoopeUnitJsonData()
    },
    handleCurrentChange(val) {
      this.requestCoopeUnitJsonData()
    },
    // 改变企业状态
    changeUnitStatus(index, row, e) {
      console.log(row.status)
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
    // 获取企业列表
    requestCoopeUnitJsonData() {
      this.$axios.post(this.$global.sApi + '/addcom', JSON.stringify({
        'current_page': this.currentPage,
        'perpage': this.pagesize,
        'type': 3
      })).then(res => {
        const json = res.data.data.data
        this.total = res.data.data.currentPage
        this.classesJsonData = json
      })
    },
    // 显示编辑Dialog
    showModifyModal(index, row, flag) {
      this.insertOrModifyModel = flag
      if (this.insertOrModifyModel === 1) {
        this.unitForm.unitId = row.id
        this.unitForm.unitName = row.comname
        this.unitForm.unitManager = row.work
        this.unitForm.unitScale = row.num
        this.unitForm.unitMsg = row.brief
        this.unitForm.unitAccount = row.usernumber
        this.unitForm.unitPassword = row.userpass
        this.unitAccount = row.usernumber
        this.unitPassword = row.userpass
      }
      this.insertDialog = true
    },
    // 提交
    submitForm(formName) {
      this.$refs.classForm.validate((valid) => {
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
      this.unitForm.unitImg = row.header
      this.unitForm.unitName = row.comname
      this.unitForm.unitManager = row.work
      this.unitForm.unitScale = row.num
      this.unitForm.unitMsg = row.brief
      this.unitForm.unitAccount = row.usernumber
      this.unitForm.unitPassword = row.userpass
      console.log(this.unitForm.unitImg)
      this.lookDialog = true
    },
    // 添加企业
    insertClassesApi(formName) {
      this.$axios.post(this.$global.sApi + '/addcom', JSON.stringify({
        'usernumber': this.unitForm.unitAccount,
        'userpass': this.unitForm.unitPassword,
        'brief': this.unitForm.unitMsg,
        'work': this.unitForm.unitManager,
        'comname': this.unitForm.unitName,
        'num': this.unitForm.unitScale,
        'header': this.unitForm.unitImg,
        'type': 1
      })).then(res => {
        this.insertDialog = false
        this.$refs[formName].resetFields();
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.requestCoopeUnitJsonData()
      })
    },
    // 编辑企业
    modifyClassesApi(formName) {
      this.$axios.post(this.$global.sApi + '/addcom', JSON.stringify({
        'userpass': this.unitForm.unitPassword,
        'brief': this.unitForm.unitMsg,
        'work': this.unitForm.unitManager,
        'comname': this.unitForm.unitName,
        'num': this.unitForm.unitScale,
        'id': this.unitForm.unitId,
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
        this.requestCoopeUnitJsonData()
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
          this.unitForm.unitImg = res.data.path
          this.loading = false
        })
      } else {
        this.$message({
          message: fileStatus,
          type: 'error'
        })
      }
    },
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
</style>
