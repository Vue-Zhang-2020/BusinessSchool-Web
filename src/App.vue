<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// 初始element-ui版本-
// "element-ui": "2.7.2",
export default {
  name: 'App'
}
</script>
<style lang="scss">
.root{
  margin: 50px 25px 0px 25px
}

.my-flex{
  display: flex;
}

.business-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  position: absolute;
  margin-top: -16px;
  margin-left: -16px;
  border-top: 1px solid #EFEFEF;
}

.business-box .business-left-nav {
  width: 130px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  position: absolute;
  padding-top: 20px;
}

.box-model-page {
  width: 97.5%;
  height: 95%;
  position: absolute;
  padding: 24px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 2px;
}
.top-title {
  font-size: 16px;
  color: #262626;
  font-weight: 700;
  font-family: PingFang SC, PingFang SC-Bold;
}
.top-control {
  margin-top: 16px;
}

// button
.search-btn {
  color: #FFFFFF;
  font-size: 16px;
  background-color: #6A6FCB;
  border-radius: 0px 2px 2px 0px;
  border: none;
  height: 40px;
  margin-left: -10px;
  z-index: 99;
  cursor: pointer;
  font-family: PingFang SC, PingFang SC-Regular;
}

.blue-btn {
  color: #FFFFFF;
  font-size: 14px;
  background-color: #6A6FCB;
  margin-bottom: 24px;
  border: none;
  cursor: pointer;
  font-family: PingFang SC, PingFang SC-Regular;
}

.blue-btn-two {
  color: #6A6FCB;
  font-size: 14px;
  background-color: #F8F8FF;
  margin-bottom: 24px;
  cursor: pointer;
  border: none;
  font-family: PingFang SC, PingFang SC-Regular;
  margin-left: 24px;
}

.blue-btn:hover {
  color: #FFFFFF;
  background-color: #6A6FCB;
}

.search-btn:hover {
  color: #FFFFFF;
  background-color: #6A6FCB;
}

.blue-btn-two:hover {
  color: #6A6FCB;
  background-color: #F8F8FF;
}

.blue-btn:active {
  color: #FFFFFF;
  background-color: #6A6FCB;
}

.search-btn:active {
  color: #FFFFFF;
  background-color: #6A6FCB;
}

.blue-btn-two:active {
  color: #6A6FCB;
  background-color: #F8F8FF;
}

.blue-btn:focus {
  color: #FFFFFF;
  background-color: #6A6FCB;
}

.search-btn:focus {
  color: #FFFFFF;
  background-color: #6A6FCB;
}

.blue-btn-two:focus {
  color: #6A6FCB;
  background-color: #F8F8FF;
}

.marginT22 {
  margin-left: auto;
  margin-top: 22px;
}

// table
.el-table {
  color: #595959;
}

.el-table thead {
  color: #262626;
}

.el-table th {
  font-size: 14px;
  font-weight: 500;
  color: #262626 !important;
  background-color: #fafafa;
}

.el-table::before {
  height: 0;
}

.table-box {
  display: flex;
  flex-direction: column;
}

.table-pagina {
  margin-left: auto;
  margin-top: 22px;
  margin-right: -45px;
}

.el-icon-close:before {
  content: '';
}

.el-dialog__footer .dialog-footer .el-button {
  padding: 0;
}

.el-dialog__footer .dialog-footer .el-button--default {
  width: 80px;
  height: 40px;
  color: #6A6FCB;
  background-color: #f8f8ff;
  border: none;
}

.el-dialog__footer .dialog-footer .el-button--primary {
  width: 80px;
  height: 40px;
  color: #FFFFFF;
  background-color: #6a6fcb;
  border: none;
}

label {
  font-weight: 100;
}

// 分页
.el-pagination.is-background .el-pager li {
  background-color: #FFFFFF;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  font-weight: 100;
  color: #595959;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #6a6fcb;
  border: 1px solid #6a6fcb;
  border-radius: 2px;
}

.el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next {
  background-color: #FFFFFF;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}

// 日期选择器
.el-input--prefix .el-input__inner {
  padding-left: 15px;
}

.el-input__prefix {
  position: absolute;
  top: 0;
  left: auto;
  right: 10px;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.label-titile {
  margin-right: 8px;
}

.screen-box {
  margin-bottom: 24px;
}

.contrl-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.control-span {
  font-size: 14px;
  color: #6a6fcb;
  font-weight: 400;
  cursor: pointer;
}

.folder-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.folder-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  background: url('./assets/page/folder.png') no-repeat;
  background-size: 100% 100%;
}

.el-tree-node__content {
  height: 30px;
}

.h_line {
  width: 1px;
  height: 14px;
  background: #efefef;
  margin: 0 16px;
}

.s_line {
  width: 1px;
  height: 100%;
  position: absolute;
  background-color: #E8E8E8;
  margin: 0 15px;
}
</style>
