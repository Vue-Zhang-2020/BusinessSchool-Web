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
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
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
          <el-input v-model="unitForm.unitScale" type="number" style="width: 20%" placeholder="请输入" autocomplete="off"></el-input><span>   人</span>
        </el-form-item>
        <el-form-item label="企业介绍：" prop="unitMsg" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="unitForm.unitMsg" style="width: 60%;" :rows="4"></el-input>
        </el-form-item> 
        <el-form-item label="初始账号：" prop="unitAccount" :label-width="formLabelWidth">
          <el-input v-model="unitForm.unitAccount" style="width: 40%" :disabled="insertOrModifyModel === 1" placeholder="只支持数字和英文字母输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="初始密码：" prop="unitPassword" :label-width="formLabelWidth">
          <el-input v-model="unitForm.unitPassword" style="width: 40%" placeholder="8-20位必须包含数字及字母" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('classForm')">确定添加</el-button>
      </div>
    </el-dialog>
    <!-- 查看Dialog -->
    <el-dialog title="合作企业详情" class="dialog-modal" :visible.sync="lookDialog" style="margin-top: -60px;">
      <el-form :model="unitForm" :rules="rules" ref="classForm">
        <el-form-item label="企业头像：" :label-width="formLabelWidth">
          <img width="104" height="104" src="../../../assets/img.jpg" alt="" style="padding: 8px;border: 1px solid rgba(0,0,0,0.15);border-radius: 2px;">     
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
    return {
      total: 0,
      currentPage: 1,
      pagesize: 5,
      insertDialog: false,
      lookDialog: false,
      formLabelWidth: '110px',
      insertOrModifyModel: 0, // 0 insert 1 modify
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
          { required: true, message: '请输入初始账号', trigger: 'blur' }
        ],
        unitPassword: [
          { required: true, message: '请输入初始密码', trigger: 'blur' }
        ]
      },
      classesJsonData: [], // 班级列表数据
    }
  },
  watch: {
    lookDialog(old) {
      if (!old) {
        this.unitForm = {}
      }
    },
    insertDialog(old) {
      if (!old) {
        this.unitForm = {}
      }
    }
  },
  created() {
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
      this.$axios.post(this.$global.sApi + '/addcom', JSON.stringify({
        'unitId': row.id
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
        if (json.length > 0) {
          this.classesJsonData = json
        }
      })
    },
    // 显示编辑Dialog
    showModifyModal(index, row, flag) {
      this.insertOrModifyModel = flag
      if (this.insertOrModifyModel === 1) {
        this.unitForm.unitId = row.id
        this.unitForm.unitName = row.comname
        // this.unitForm.unitManager = row
        this.unitForm.unitScale = row.num
        // this.unitForm.unitMsg = row
        this.unitForm.unitAccount = row.usernumber
        // this.unitForm.unitPassword = row
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
      this.unitForm.unitImg = row
      this.unitForm.unitName = row.comname
      this.unitForm.unitManager = row 
      this.unitForm.unitScale = row.num
      this.unitForm.unitMsg = row
      this.unitForm.unitAccount = row.usernumber
      this.unitForm.unitPassword = row.userpass
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
        'imageUrl': this.unitForm.unitImg,
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
    // 上传图片
    handleAvatarSuccess(res, file) {
        this.unitForm.unitImg = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
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
