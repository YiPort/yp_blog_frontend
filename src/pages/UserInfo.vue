<!-- 用户中心 -->
<template>
  <div>
      <wbc-nav></wbc-nav>
      <el-tooltip class="item" effect="dark" content="查看收藏" placement="left" :hide-after="1000">
          <el-button
          type="primary"
          icon="el-icon-star-off"
          circle class="collect1 button1"
          @click="getCollectList">
          </el-button>
      </el-tooltip>
      <el-drawer
      title="我的收藏"
      :visible.sync="myCollection"
      direction="ltr"
      size=50%>
          <el-divider></el-divider>
              <ul class="infinite-list" style="overflow:auto">
                  <li v-for="item in collectionList" :key="item.id" class="list">
                      <a :href="'#/DetailArticle?aid='+item.id" target="_blank" class="font1">
                      {{item.title}}/{{item.summary}}
                      </a>
                      <button class="btn btn-danger" @click="deleteCollection(item.id)">取消收藏</button>
                  </li>
              </ul>
      </el-drawer>
      <el-tooltip class="item" effect="dark" content="反馈列表" placement="left" :hide-after="1000">
          <el-button
          type="danger"
          icon="el-icon-question"
          circle class="question1 button1"
          @click="getQuestionList"
          v-show="isAdmin">
          </el-button>
      </el-tooltip>
      <el-drawer
      title="反馈列表"
      :visible.sync="myQuestion"
      direction="ltr"
      size=50%>
      <el-tooltip class="item" effect="dark" content="刷新" placement="left" :hide-after="1000">
          <el-button type="primary" class="refresh1" icon="el-icon-refresh-right" :loading="isLoading" @click="refresh" circle></el-button>
      </el-tooltip>
          <el-divider></el-divider>
              <ul class="infinite-list" style="overflow:auto">
                  <li v-for="item in questionList" :key="item.id" class="list">
                      <a :href="'#/DetailArticle?aid='+item.articleId" target="_blank" class="font1">
                      用户-{{item.createBy}} 提交，文章-{{item.articleId}} 的错误（{{item.createTime}}）
                      </a>
                      <button class="btn btn-danger" @click="deleteQuestion(item.id)">已解决</button>
                      <button class="btn btn-edit" @click="getDetail(item.id)">详情</button>
                  </li>
              </ul>
      </el-drawer>
      <template v-if="haslogin">
          <div class="container">
          <div v-show="isEdit" class="tcommonBox">
              <header>
                  <h1>
                          编辑个人资料
                  </h1>
              </header>
              <section>
                  <ul class="userInfoBox">
                      <li class="avatarlist">
                          <span class="leftTitle">头像</span>
                          <el-upload
                            class="avatar-uploader"
                            name="img"
                            :action="uploadURL"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :headers="headers"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="userInfoObj.avatar" :src="userInfoObj.avatar?userInfoObj.avatar:'static/img/tou.jpg'"  :onerror="$store.state.errorImg" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <div slot="tip" class="el-upload__tip">点击上传头像，只能上传jpg/png文件，且不超过3mb</div>
                          </el-upload>
                      </li>
                      <li>
                          <span class="leftTitle">账号：</span>
                          <span>{{userInfoObj.userName?userInfoObj.userName:"无"}}</span>
                      </li>
                      <li>
                          <span class="leftTitle">UID：</span>
                          <span>{{userInfoObj.uid?userInfoObj.uid:"无"}}</span>
                      </li>
                      <li class="username">
                          <span class="leftTitle">昵称：</span>
                          <el-input v-model="userInfoObj.nickName" placeholder="昵称" clearable></el-input>
                      </li>
                      <li>
                          <span class="leftTitle">邮箱：</span>
                          <el-input v-model="userInfoObj.email" placeholder="邮箱" clearable></el-input>
                      </li>
                      <li>
                          <span class="leftTitle">性别：</span>
                          <template>
                              <el-radio-group v-model="userInfoObj.sex">
                                  <el-radio class="radio" :label="0">男</el-radio>
                                  <el-radio class="radio" :label="1">女</el-radio>
                              </el-radio-group>
                          </template>
                      </li>
                      <li>
                          <span class="leftTitle">修改密码：</span>
                          <span class="">新密码：</span>
                          <el-input v-model="userInfoObj.password" placeholder="新密码" clearable show-password></el-input>
                          <el-divider direction="vertical"></el-divider>
                          <span class="">再次输入密码：</span>
                          <el-input v-model="userInfoObj.checkPassword" placeholder="再次输入密码" clearable show-password></el-input>
                      </li>
                      <li>
                          <span class="leftTitle">注册日期：</span>
                          <span>{{userInfoObj.createTime?userInfoObj.createTime:"无"}}</span>
                      </li>


                  </ul>
                  <div class="saveInfobtn">
                      <a class="tcolors-bg"  href="javascript:void(0);" @click="back">返 回</a>
                      <a class="tcolors-bg" href="javascript:void(0);" @click="saveInfoFun">保 存</a>
                  </div>
              </section>
          </div>
          <div v-show="!isEdit" class="tcommonBox">
              <header>
                  <h1>
                      个人中心
                      <el-button class="gotoEdit" icon="el-icon-edit" @click="isEdit=!isEdit" round>编辑</el-button>
                  </h1>

              </header>
              <section>
                  <ul class="userInfoBox">
                      <li class="avatarlist">
                          <span class="leftTitle">头像</span>
                          <div class="avatar-uploader">
                              <img  :src="userInfoObj.avatar?userInfoObj.avatar:'static/img/tou.jpg'"   :onerror="$store.state.errorImg" class="avatar">
                          </div>
                      </li>
                      <li>
                          <span class="leftTitle">账号：</span>
                          <span>{{userInfoObj.userName?userInfoObj.userName:"无"}}</span>
                      </li>
                      <li>
                          <span class="leftTitle">UID：</span>
                          <span>{{userInfoObj.uid?userInfoObj.uid:"无"}}</span>
                      </li>
                      <li class="username">
                          <span class="leftTitle">昵称：</span>
                          <span>{{userInfoObj.nickName?userInfoObj.nickName:"游客"}}</span>

                      </li>
                      <li>
                          <span class="leftTitle">邮箱：</span>
                          <span>{{userInfoObj.email?userInfoObj.email:"无"}}</span>
                      </li>
                      <li>
                          <span class="leftTitle">性别：</span>
                          <span>{{userInfoObj.sex=="0"?'男':'女'}}</span>
                      </li>
                      <li>
                          <span class="leftTitle">注册日期：</span>
                          <span>{{userInfoObj.createTime?userInfoObj.createTime:"无"}}</span>
                      </li>

                  </ul>
              </section>
          </div>
          </div>
      </template>
      <div class="footer">
          <a style="color:aliceblue">备案号：</a>
          <a href="https://beian.miit.gov.cn/" class="font">闽ICP备2021019654号-1</a>
          <p style="color:aliceblue; margin-top: 10px">Blog ©2021 Created by yiport</p>
      </div>
  </div>
</template>

<script>
import header from '../components/header.vue'
import {getUserInfo,savaUserInfo} from '../api/user.js'//获取用户信息，保存用户信息
import store from '../store'
import { getCollectList,deleteCollection,getQuestionList,deleteQuestion } from '../api/article'
import { updateComment } from '../api/comment'
import { MessageBox } from 'element-ui'
import { getToken } from '../utils/auth'
import router from '@/router'
import axios from 'axios'
  export default {
      name: 'UserInfo',
      data() { //选项 / 数据
          return {
              uploadURL:'',
              isEdit: false,
              userInfo:{},//本地存储的用户信
              userInfoObj:{
                  avatar: "",
                  checkPassword: "",
                  createTime: "",
                  email: "",
                  sex: "",
                  head_start: 0,
                  id: 0,
                  phonenumber: "",
                  uid: 0,
                  userName: "",
                  userPassword: "",
                  userRole: 0,
                  status: 0,
                  nickName: "",
              },//用户的信息
              myCollection: false,//是否显示收藏面板
              collectionList: [],//收藏列表
              myQuestion: false,//是否显示反馈面板
              questionList: [],//反馈列表
              description: '',//问题描述
              isLoading: false,
              haslogin: false,
              ip: ''
          }
      },
      computed: {
          userId: {
              get() {
                  return this.userInfo.id;
              },
              set(newValue) {
                  this.userInfo.id = newValue;
              }
          },
          isAdmin() { //是否是管理员
              if(this.userInfo.userRole === "1") {
                  return true;
              }else {
                  return false;
              }
          },
          headers(){
              return{
                'token': getToken()
              }
          }
      },
      methods: { //事件处理器
          handleAvatarSuccess(res, file) {//上传头像
              if(res.code == 200){
                  this.userInfoObj.avatar = res.data;
                  this.userInfoObj.head_start = 1;
                  updateComment({createBy: this.userInfoObj.id, avatarUrl: res.data})
                    
              }else{
                  this.$message.error('上传图片失败');
              }

          },
          beforeAvatarUpload(file) {//判断头像大小
              const isJPG = file.type == 'image/png'||file.type=='image/jpg'||file.type=='image/jpeg';
              const isLt3M = file.size / 1024 / 1024 / 3 < 1;
              // console.log(file);
              if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG/JPEG/PNG 格式!');
              }
              if (!isLt3M) {
                this.$message.error('上传头像图片大小不能超过 3MB!');
              }
              return isJPG && isLt3M;
          },
          async getUserInfo() {       //获取用户信息
              var that = this;
              await getUserInfo().then((response)=>{
                  this.userInfoObj = response;
                  that.haslogin = true;
                  localStorage.setItem('userInfo',JSON.stringify(response));
                  this.userInfoObj.head_start = 0;
              })
          },
          jsShow(location) {
              this.ip = location;
          },
          back() {        //返回
              this.getUserInfo();
              this.isEdit = false;
          },
          async saveInfoFun(){//保存编辑的用户信息
              var that = this;

              if(that.userInfoObj.nickName.length < 1){ //昵称为必填
                   that.$message.error('昵称为必填项，请填写昵称');
                   return;
              }


              await savaUserInfo(that.userInfoObj).then((response)=>{//保存信息接口，返回展示页
                  that.$message.success( '修改成功！');
                  that.isEdit = false;
                  that.routeChange();
              })
          },
          routeChange: function(){//展示页面信息
              var that = this;
              if(getToken()){
                  that.getUserInfo();
                  that.userInfo = JSON.parse(localStorage.getItem('userInfo'));
                  that.userId = that.userInfo.id;
              }else{
                  that.haslogin = false;
                  that.loginMessage();
              }

          },
          loginMessage() {  //未登录消息提示
              MessageBox.confirm('未登录！请先登录', '系统提示', {
                      confirmButtonText: '登录',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                          localStorage.setItem('logUrl', router.currentRoute.fullPath);
                          router.push({
                              path: '/Login?login=1'
                          });
                       }).catch(() => { })
                          return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
          },
          getCollectList() {  //获取收藏文章列表
              if(!this.userId) this.loginMessage();
              else {
                  getCollectList().then(response => {
                  // console.log(response)
                  this.collectionList =  response.filter(item => item !== null);
              })
              this.myCollection = true;
              }
          },
          deleteCollection(articleId) {   //取消收藏文章
              deleteCollection(articleId).then(response => {
                  this.getCollectList();
                  this.$message({
                      type: 'success',
                      message: '取消收藏成功'
                  })
              })
          },
          getQuestionList() {   //获取反馈列表
              if(!this.isAdmin) {
                  this.$message({
                      type: 'error',
                      message: '无权限'
                  })
                  return
              }
                getQuestionList().then(response => {
                  this.questionList = response;
              })
              this.myQuestion = true;
          },
          getDetail(id) {     //获取文章问题详情
              this.questionList.forEach(question => {
                  if(question.id === id) {
                      this.$confirm(question.questionDescription, '问题详情', {
                      confirmButtonText: '已解决',
                      cancelButtonText: '未解决',
                      type: 'info'
                  }).then(() => {
                      this.$message({
                          type: 'success',
                          message: '删除成功!'
                      });
                      this.deleteQuestion();
                  }).catch(() => {
                      this.$message({
                          type: 'info',
                          message: '已取消删除'
                      });
                  });
                  }
                  return
              })
          },
          deleteQuestion(id) {    //删除文章问题
              deleteQuestion(id).then(response => {
                  this.$message({
                      type: 'success',
                      message: '删除成功'
                  })
                  this.getQuestionList()
              })
          },
          refresh() {     //刷新问题列表
              this.isLoading = true;
              this.questionList = [];
              setTimeout(() => {
                  this.getQuestionList();
                  this.isLoading = false;
              }, 500);
          }
      },
      components: { //定义组件
          'wbc-nav':header,
      },
      watch: {
         // 如果路由有变化，会再次执行该方法
         '$route':'routeChange'
       },
      created() { //生命周期函数
          this.routeChange();
          this.uploadURL = store.state.resourceURL+'upload'
      }
  }
</script>

<style>
.refresh1{
  position: fixed;
  top: 60px;
  left: 45%;
  margin-right: 10px;
}
.font1{
  color: rgb(0, 0, 0);
}
.font1:hover{
  color: #3689db;
}
.a_list{
  width: 548px;
  height: 47px;
  padding: 0 10px 0 10px;
}
.question1{
  position: fixed;
  bottom: 107px;
right: 40px;
  box-shadow: #333;
  z-index:9999;
}
.collect1{
  position: fixed;
  bottom: 60px;
right: 40px;
  box-shadow: #333;
  z-index:9999;
}
.button1 {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
}
/*1.显示滚动条：当内容超出容器的时候，可以拖动：*/
.el-drawer__body {
  overflow: auto;
  /* overflow-x: auto; */
}
/*2.隐藏滚动条*/
/* .el-drawer__container ::-webkit-scrollbar{
  display: none;
} */
.list {
  list-style: none;
  height: 36px;
  line-height: 36px;
  padding: 5px 5px;
  border-bottom: 1px solid #ddd;
}
li button{
  float: right;
  display: none;
  margin-top: 3px;
}
.list:before {
  content: initial;
}
.list:last-child {
  border-bottom: none;
}
.list:hover{
  background-color: #ddd;
}
li:hover button{display: block;}
.btn {display: inline-block;padding: 4px 12px;margin-bottom: 0;font-size: 14px;
  line-height: 20px;text-align: center;vertical-align: middle;cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;}
.btn-edit {color: #fff;background: #409eff;border: 1px solid #409eff;margin-right: 5px;}
.btn-edit:hover{color: #fff;background: #0577e9}
.btn-danger {color: #fff;background-color: #da4f49;border: 1px solid #bd362f;}
.btn-danger:hover {color: #fff;background-color: #bd362f;}
.userInfoBox .avatarlist{
  position: relative;
}

.avatar-uploader {
  display: inline-block;
  vertical-align: top;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  position: absolute;
  top:0;
  left:0;
}
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: block;
  object-fit: cover;
}
.gotoEdit{
  font-size: 15px;
  float:right;
  cursor: pointer;
  color:#999;
}
.gotoEdit:hover {
  color:#333;
}
/*个人设置*/
.userInfoBox .leftTitle{
  display: inline-block;
  width:100px;
  padding: 10px 0;
  font-weight: bold;
}
.userInfoBox .rightInner{
  display: inline-block;
  max-width: calc(100% - 140px);
  vertical-align: top;
}
.userInfoBox li{
  padding:20px;
  border-bottom: 1px solid #ddd;
}
.userInfoBox li:last-child{
  border-bottom: 1px solid transparent;
}
.userInfoBox  .el-input,.userInfoBox  .el-textarea{
  max-width:300px;
  min-width: 100px;
}

.userInfoBox .el-input__inner{
  border-radius: 4px;
}
.userInfoBox  .el-textarea{
  vertical-align: top;
}
.saveInfobtn{
  margin: 20px 0;
  text-align: center;
}
.saveInfobtn a{
  color:#fff;
  padding:6px 20px;
  margin:5px 10px;
  border-radius: 5px;
  font-size: 14px;
}
.userInfoBox .fa-asterisk{
  color: #DF2050;
}
</style>
