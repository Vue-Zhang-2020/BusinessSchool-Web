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
  border-top: 1px solid #EFEFEF;
}

.business-box .business-left-nav {
  width: 140px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  position: absolute;
  padding-top: 20px;
}

.business-model-box {
  width: 100%;
  height: 54px;
  margin-top: 16px;
  margin-bottom: 22px;
  padding: 17px 24px;
  background-color: #FAFAFA;
}

.business-model-box span {  
  font-size: 14px;
  color: #262626;
}

.business-course-img-box img {
  width: 100%;
  height: 160px;
}

.business-course-title-box {
  width: 100%;
  padding: 16px 16px 22px 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.business-course-title-box .plan-title {
  font-size: 16px;
  color: rgba(0,0,0,0.85);
  margin: 0;
}

.business-course-title-box .plan-desc {
  font-size: 12px;
  color: rgba(0,0,0,0.65);
  margin-top: 6px;
}

.business-course-title-box .plan-desc:last-child {
  margin-bottom: 0;
}

.business-course-title-box span {
  font-size: 16px;
  color: rgba(0,0,0,0.85);
}

.business-course-bottom {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: #F8F8FF;
}

.business-course-bottom .course_line {
  width: 1px;
  height: 16px;
  background-color: #E8E8E8;
}

.business-course-bottom .modify-box, .delete-box {
  width: 49%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.business-course-bottom .modify-box img, .delete-box img {
  width: 16px;
  height: 16px;
}

.business-course-status {
  width: 100%;
  height: 32px;
  margin-top: 22px;
  margin-bottom: 16px;
}

.business-course-status span {
  font-size: 14px;
  color: rgba(0,0,0,0.85)
}

.business-course-box {
  width: 100%;
}

.business-teaching-plan-item {
  width: 24%;
  height: 100%;
  margin-right: 1%;
  float: left;
  margin-bottom: 13px;
  border: 1px solid #EBEBEB;
  background-color: white;
}

.business-course-item {
  width: 24%;
  height: 260px;
  margin-right: 1%;
  float: left;
  margin-bottom: 13px;
  border: 1px solid #EBEBEB;
  background-color: white;
}

.business-course-all-page {
  width: 98.5%;
  height: 95%;
  display: flex;
  position: absolute;
  flex-direction: column;
  border-radius: 2px;
  margin-top: 16px;
}

.business-course-title {
  width: 100%;
  height: 130px;
  padding: 24px;
  background-color: white;
  border-radius: 2px;
}

.business-model-all-page {
  width: 98.5%;
  height: 95%;
  padding: 24px;
  display: flex;
  position: absolute;
  flex-direction: column;
  background-color: white;
  border-radius: 2px;
  margin-top: 16px;
}

.business-model-page {
  width: 98.5%;
  height: 87%;
  padding: 24px;
  display: flex;
  position: absolute;
  flex-direction: column;
  background-color: white;
  border-radius: 2px;
  margin-top: 16px;
}

.business-obj-model-page {
  width: 98.5%;
  height: 95%;
  position: absolute;
  padding: 24px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 2px;
  margin-top: 16px;
}

.business-obj-model-page .el-row {
  display: flex;
  align-items: unset;
}

.box-model-page .el-row {
  display: block !important;
  margin-top: 0 !important;
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
  margin-bottom: 24px;
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

.date-btn {
  color: #D9B765;
  background-color: #FFFAEE;
  border: 1px solid #D9B765;
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0;
}

.btn_grade {
  background-color: transparent;
  border: none; 
}

.date-btn .date-img {
  width: 32px;
  height: 40px;
  display: inline-block;
  background-color: #D9B765;
  margin-left: -1px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.date-btn span {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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

.blue-btn-back {
  color: #6A6FCB;
  font-size: 14px;
  background-color: #FFFFFF;
  cursor: pointer;
  border: 1px solid #6A6FCB;
  font-family: PingFang SC, PingFang SC-Regular;
  margin-left: 24px;
}

.blue-btn:hover {
  color: #FFFFFF;
  background-color: #6A6FCB;
}

.blue-btn-back:hover {
  color: #6A6FCB;
  background-color: #FFFFFF;
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

.blue-btn-back:active {
  color: #6A6FCB;
  background-color: #FFFFFF;
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

.blue-btn-back:focus {
  color: #6A6FCB;
  background-color: #FFFFFF;
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

.el-scrollbar__wrap{
  overflow-x: hidden;
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
  display: flex !important;
  flex-direction: column !important;
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
  margin-bottom: 24px !important;
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
  height: 30px !important;
}

.h_line {
  width: 1px;
  height: 14px;
  background: #efefef;
  margin: 0 16px;
}

.s_line {
  width: 1px !important;
  height: 100% !important;
  position: absolute !important;
  background-color: #E8E8E8 !important;
  margin: 0 15px !important;
}

.folder-box {
  width: 100% !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
