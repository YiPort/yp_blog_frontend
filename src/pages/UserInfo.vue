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
        <!-- 个人信息 -->
        <div class="container">
            <div class="tcommonBox">
            <el-skeleton :loading="loadingInfo" animated>
            <!-- 骨架屏 -->
            <template slot="template">
                <header>
                        <h1>
                                个人中心
                            <el-button class="gotoEdit" type="primary" icon="el-icon-edit" @click="isEdit=!isEdit" round>编辑资料</el-button>
                            <el-button class="gotoEdit" type="primary" icon="el-icon-lock" @click="editPassword=!editPassword" round>修改密码</el-button>
                        </h1>
                    </header>
                <div style="padding: 28px 20px;border-bottom: 1px solid #ddd;">
                    <span style="font-weight: bold;padding-right: 55px;">头像</span>
                    <el-skeleton-item
                    variant="image"
                    style="width: 120px;
                        height: 120px;
                        margin: -16.8px 0 56px 100px;
                        border-radius: 50%;
                        object-fit: cover;"/>
                </div>

                <div style="padding: 28px 20px;border-bottom: 1px solid #ddd;">
                    <span style="font-weight: bold;padding-right: 55px;">账号：</span>
                    <el-skeleton-item variant="h1" style="width: 20%;" />
                </div>

                <div style="padding: 28px 20px;border-bottom: 1px solid #ddd;">
                    <span style="font-weight: bold;padding-right: 55px;">UID：</span>
                    <el-skeleton-item variant="h1" style="width: 20%;" />
                </div>

                <div style="padding: 28px 20px;border-bottom: 1px solid #ddd;">
                    <span style="font-weight: bold;padding-right: 55px;">昵称：</span>
                    <el-skeleton-item variant="h1" style="width: 20%;" />
                </div>
                <div style="padding: 28px 20px;border-bottom: 1px solid #ddd;">
                    <span style="font-weight: bold;padding-right: 55px;">邮箱：
                        <el-tooltip style="cursor: pointer;" effect="dark" content="可以使用邮箱登录、找回账号、修改密码" placement="top-start">
                            <a href="#/Help">
                                <i class="el-icon-info" />
                            </a>
                        </el-tooltip>
                    </span>
                    <el-skeleton-item variant="h1" style="width: 20%;" />
                </div>

                <div style="padding: 28px 20px;border-bottom: 1px solid #ddd;">
                    <span style="font-weight: bold;;padding-right: 55px;">性别：</span>
                    <el-skeleton-item variant="h1" style="width: 20%;" />
                </div>

                <div style="padding: 28px 20px;border-bottom: 1px solid #ddd;">
                    <span style="font-weight: bold;;padding-right: 55px;">注册日期：</span>
                    <el-skeleton-item variant="h1" style="width: 20%;" />
                </div>
            </template>

            <template>
                <div v-if="!isEdit">
                    <header>
                        <h1>
                                个人中心
                            <el-button class="gotoEdit" type="primary" icon="el-icon-edit" @click="isEdit=!isEdit" round>编辑资料</el-button>
                            <el-button class="gotoEdit" type="primary" icon="el-icon-lock" @click="editPassword=!editPassword" round>修改密码</el-button>
                        </h1>
                    </header>
                    <section>
                        <ul class="userInfoBox">
                            <li class="avatarlist">
                                <span class="leftTitle">头像</span>
                                <div class="avatar-uploader">
                                    <img :src="userInfoObj.avatar?userInfoObj.avatar:'/static/img/defaultAvatar.png'" :onerror="$store.state.errorImg" class="avatar">
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
                            <li class="nickName">
                                <span class="leftTitle">昵称：</span>
                                <span>{{userInfoObj.nickName?userInfoObj.nickName:"无"}}</span>

                            </li>
                            <li>
                                <span class="leftTitle">邮箱：
                                    <el-tooltip style="cursor: pointer;" effect="dark" content="可以使用邮箱登录、找回账号、修改密码" placement="top-start">
                                        <a href="#/Help">
                                            <i class="el-icon-info" />
                                        </a>
                                    </el-tooltip>
                                </span>
                                <el-button v-show="!editMail" type="primary" @click="editEmail" plain>{{userInfoObj.email?'修改邮箱':'绑定邮箱'}}</el-button>
                                <span>{{userInfoObj.email?userInfoObj.email:"无"}}</span>
                            </li>
                            <li>
                                <span class="leftTitle">性别：</span>
                                <span>{{userInfoObj.sex==0?'男':'女'}}</span>
                            </li>
                            <li>
                                <span class="leftTitle">注册日期：</span>
                                <span>{{userInfoObj.createTime?userInfoObj.createTime:"无"}}</span>
                            </li>
                        </ul>
                    </section>
                </div>
                <div v-else>
                    <header>
                        <h1>
                            编辑个人资料
                        </h1>
                    </header>
                    <section>
                        <ul class="userInfoBox">
                            <li class="avatarlist">
                                <span class="leftTitle">头像</span>
                                <div class="avatar-uploader">
                                    <img :src="userInfoObj.avatar?userInfoObj.avatar:'/static/img/defaultAvatar.png'" :onerror="$store.state.errorImg" class="avatar">
                                </div>
                                <el-upload
                                class="avatar-uploader"
                                drag
                                name="img"
                                :action="uploadURL"
                                :headers="headers"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                                accept=".jpg,.png,.jpeg">
                                <i class="el-icon-upload" style="margin-top:10px"></i>
                                <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
                                </el-upload>
                                <div slot="tip" class="upload-tip el-upload__tip">只能上传&nbsp;<em style="font-size: 1.2em;color:#409EFF">jpg/jpeg/png</em>&nbsp;文件，且不超过1MB<p style="color:red">(每日只能上传两次头像，请确认后上传)</p></div>

                            </li>
                            <li>
                                <span class="leftTitle">账号：</span>
                                <span>{{userInfoObj.userName?userInfoObj.userName:"无"}}</span>
                            </li>
                            <li>
                                <span class="leftTitle">UID：</span>
                                <span>{{userInfoObj.uid?userInfoObj.uid:"无"}}</span>
                            </li>
                            <li class="nickName">
                                <span class="leftTitle">昵称：</span>
                                <el-input v-model="userInfoObj.nickName" placeholder="昵称" clearable></el-input>
                            </li>
                            <li>
                                <span class="leftTitle">邮箱：
                                    <el-tooltip style="cursor: pointer;" effect="dark" content="可以使用邮箱登录、找回账号、修改密码" placement="top-start">
                                        <a href="#/Help">
                                            <i class="el-icon-info" />
                                        </a>
                                    </el-tooltip>
                                </span>
                                <el-button v-show="!editMail" type="primary" @click="editEmail" plain>{{userInfoObj.email?'修改邮箱':'绑定邮箱'}}</el-button>
                                <span>{{userInfoObj.email?userInfoObj.email:"无"}}</span>
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
                                <span class="leftTitle">注册日期：</span>
                                <span>{{userInfoObj.createTime?userInfoObj.createTime:"无"}}</span>
                            </li>
                        </ul>
                        <div class="saveInfobtn">
                            <a class="tcolors-bg"  href="javascript:void(0);" @click="back">取 消</a>
                            <a class="tcolors-bg" href="javascript:void(0);" @click="saveInfoFun">保 存</a>
                        </div>
                    </section>
                </div>

                <el-dialog width="500px" :title="userInfoObj.email?'修改邮箱':'绑定邮箱'" :visible.sync="editMail" center destroy-on-close>
                <el-form :inline="true" class="edit-form" status-icon ref="dynamicValidateForm" :model="form">
                    <el-form-item label="邮箱" prop="email" :rules="[
                        { required: true, message: '请输入邮箱地址', trigger: ['blur', 'change'] },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                        ]">
                        <el-input v-model="form.email"
                        placeholder="请输入新邮箱"
                        clearable><i slot="prefix" style="color:#409EFF;" class="el-input__icon el-icon-message" />
                        </el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="captcha">
                        <el-input
                        v-model="form.captcha"
                        style="width:50%"
                        :disabled="!sengCaptcha"
                        placeholder="请输入验证码"
                        @keyup.enter.native="verifyMail()"
                        clearable><i slot="prefix" style="color:#409EFF;" class="el-input__icon el-icon-chat-line-round" />
                        </el-input>
                        <time-button :reset="reset" @click.native="sendMailCaptcha()" content="发送验证码"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editMail = false,sengCaptcha = false">取 消</el-button>
                    <el-button type="primary" @click="verifyMail()">确 定</el-button>
                </div>
                </el-dialog>
                <el-dialog width="500px" title="修改密码" :visible.sync="editPassword" center destroy-on-close>
                <el-form :inline="true" class="edit-form" label-position="right" label-width="110px" status-icon ref="validatePasswordForm" :rules="rules" :model="passwordForm">
                    <el-form-item label="新密码" prop="password">
                        <el-input
                        type="password"
                        placeholder="请输入新密码"
                        v-model="passwordForm.password"
                        autocomplete="new-password"
                        show-password
                        clearable>
                        <i slot="prefix" style="color:#409EFF;" class="el-input__icon el-icon-lock" />
                        </el-input>
                    </el-form-item>
                    <el-form-item label="再次输入密码" prop="checkPassword">
                        <el-input
                        type="password"
                        placeholder="请再次输入密码"
                        v-model="passwordForm.checkPassword"
                        autocomplete="new-password"
                        @keyup.enter.native="updatePassword()"
                        show-password
                        clearable>
                        <i slot="prefix" style="color:#409EFF;" class="el-input__icon el-icon-lock" />
                        </el-input>
                    </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                    <el-button @click="editPassword = false">取 消</el-button>
                    <el-button type="primary" @click="updatePassword()">确 定</el-button>
                </div>
                </el-dialog>
            </template>
            </el-skeleton>
            </div>
        </div>
        <div class="footer">
            <a style="color:aliceblue">备案号：</a>
            <a href="https://beian.miit.gov.cn/" class="font">闽ICP备2021019654号-1</a>
            <p style="color:aliceblue; margin-top: 10px">Blog ©2021 Created by yiport</p>
        </div>
    </div>
</template>

<script>
import header from '../components/header.vue'
import {getUserInfo,savaUserInfo,updatePassword,sendMailCaptcha,verifyMail} from '../api/user.js'
import { getCollectList,deleteCollection,getQuestionList,deleteQuestion } from '../api/article'
import { updateComment } from '../api/comment'
import { getToken } from '../utils/auth'
import router from '@/router'
import timeButton from '../components/timeButton.vue'
    export default {
        name: 'UserInfo',
        data() { //选项 / 数据
            // 密码校验
            var validatePass = (rule, value, callback) => {
                let passwordRegexp = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$\%\^\&\*])[0-9a-zA-Z!@#$\%\^\&\*]{8,16}/;
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (!passwordRegexp.test(value)) {
                    callback(new Error('密码必须包含[数字][英文字母][!@#$%^&*]且长度在8-16之间'));
                }else {
                    if (this.passwordForm.checkPassword !== '') {
                        this.$refs.validatePasswordForm.validateField('checkPassword');
                    }
                    callback();
                }
            };
            // 二次输入密码校验
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.passwordForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                loadingInfo: true,
                reset: false,
                sengCaptcha: false,
                editMail: false,
                uploadURL:this.$store.state.resourceURL + 'uploadAvatar',
                isEdit: false,
                userInfo:{},//本地存储的用户信息
                userInfoObj:{
                    avatar: "",
                    createTime: "",
                    email: "",
                    sex: "",
                    id: 0,
                    uid: 0,
                    userName: "",
                    userRole: 0,
                    userStatus: 0,
                    nickName: "",
                },//用户的信息
                passwordForm: {
                    id: 0,
                    password: "",
                    checkPassword: ""
                },
                editPassword: false,
                myCollection: false,//是否显示收藏面板
                collectionList: [],//收藏列表
                myQuestion: false,//是否显示反馈面板
                questionList: [],//反馈列表
                description: '',//问题描述
                isLoading: false,
                haslogin: false,
                ip: '',
                form: {
                    email: '',
                    captcha: ''
                },
                rules: {
                    password: [
                        { required: true, validator: validatePass, trigger: ['blur', 'change'] }
                    ],
                    checkPassword: [
                        { required: true, validator: validatePass2, trigger: ['blur', 'change'] }
                    ]
                },
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
                if(this.userInfo.userRole === 1) {
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
            sendMailCaptcha(){  //发送邮箱验证码
                this.$refs["dynamicValidateForm"].validate((valid) => {
                    if (valid) {
                        this.reset = false;
                        this.sengCaptcha = true;
                        sendMailCaptcha({email:this.form.email}).then(res => {
                            this.$message.success("验证码已发送到邮箱，注意查收");
                        }).catch(() => {
                            this.reset = true;
                            this.sengCaptcha = false;
                        })
                    } else {
                        this.reset = true;
                        return false;
                    }
                });
            },
            verifyMail(){   //验证邮箱
                this.$refs["dynamicValidateForm"].validate((valid) => {
                    if (valid) {
                        if(!this.form.captcha){
                            this.$message.warning("请填写验证码");
                            return;
                        }
                        verifyMail({email:this.form.email,captcha:this.form.captcha}).then(res => {
                            this.editMail = false;
                            this.sengCaptcha = false;
                            this.form.captcha = '';
                            this.$message.success("邮箱修改成功");
                            this.routeChange();
                        })
                    } else {
                        return false;
                    }
                });
            },
            editEmail(){
                this.form = {
                    email: '',
                    captcha: ''
                }
                this.reset = false;
                this.editMail = !this.editMail;
            },
            handleAvatarSuccess(res,params) {//上传头像
              if(res.code == 200){
                this.userInfoObj.avatar = res.data;
                this.userInfoObj.head_start = 1;
                this.$message.success('上传成功！');
                let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                userInfo.avatar = res.data;
                localStorage.setItem('userInfo',JSON.stringify(userInfo));
                updateComment({createBy: this.userInfoObj.id, avatarUrl: res.data})
              }else{
                this.$message.error(res.msg);
              }
            },
            async beforeAvatarUpload(file) {//判断头像大小
                const isJPG = file.type == 'image/png'||file.type=='image/jpg'||file.type=='image/jpeg';
                const isLt3M = file.size / 1024 / 1024 < 3;
                // console.log(file);
                await this.$confirm('是否确认上传？每日只能上传两次头像，请确认后上传', '系统提示', {
                    confirmButtonText: '上传',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                if (!isJPG) {
                  this.$message.error('上传头像图片只能是 JPG/JPEG/PNG 格式!').then(() => {
                    return false;
                  });
                }
                if (!isLt3M) {
                  this.$message.error('上传头像图片大小不能超过 3MB!').then(() => {
                    return false;
                  });
                }
                return true;
            },
            async getUserInfo() {       //获取用户信息
                await getUserInfo().then((response)=>{
                    this.userInfoObj = response;
                    this.passwordForm.id = response.id;
                    this.haslogin = true;
                    this.loadingInfo = false;
                    localStorage.setItem('userInfo',JSON.stringify(response));
                })
            },
            jsShow(location) {
                this.ip = location;
            },
            back() {        //返回
                this.getUserInfo();
                this.isEdit = false;
            },
            async saveInfoFun(){    //保存编辑的用户信息
                if(this.userInfoObj.nickName.length < 1){ //昵称为必填
                     this.$message.error('昵称为必填项，请填写昵称');
                     return;
                }
                await savaUserInfo(this.userInfoObj).then((response)=>{//保存信息接口，返回展示页
                    if(this.userInfoObj.nickName != this.userInfo.nickName){
                        updateComment({createBy: this.userInfoObj.id, createNick: this.userInfoObj.nickName})
                    }
                    this.$message.success( '修改成功！');
                    this.isEdit = false;
                    this.routeChange();
                })
            },
            updatePassword(){ //修改密码
                this.$refs["validatePasswordForm"].validate((valid) => {
                    if (valid) {
                        updatePassword(this.passwordForm).then(res => {//保存信息接口，返回展示页
                            this.$message.success( '修改成功！');
                            this.editPassword = false;
                        })
                    }else {
                        return false;
                    }
                });
            },
            routeChange(){//展示页面信息
                if(getToken()){
                    this.getUserInfo();
                    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    this.userId = this.userInfo.id;
                }else{
                    this.haslogin = false;
                    this.loginMessage();
                }
            },
            loginMessage() {  //未登录消息提示
                this.$confirm('未登录！请先登录', '系统提示', {
                        confirmButtonText: '登录',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                            localStorage.setItem('logUrl', router.currentRoute.fullPath);
                            this.$router.push({path: '/Login?login=1'})
                         }).catch(() => {
                            this.$router.push({path: '#/Home'})
                          })
            },
            getCollectList() {  //获取收藏文章列表
                if(!this.userId) this.loginMessage();
                else {
                    getCollectList().then(response => {
                    // console.log(response)
                    this.collectionList = response
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
                        this.deleteQuestion(id);
                    }).catch(() => {
                        });
                    }
                    return
                })
            },
            deleteQuestion(id) {    //删除文章问题
                deleteQuestion(id).then(response => {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
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
            'time-button':timeButton
        },
        watch: {
           // 如果路由有变化，会再次执行该方法
           '$route':'routeChange'
         },
        created() { //生命周期函数
            this.$nextTick(() => {
                if(localStorage.getItem('userInfo')){
                    this.routeChange();
                }else{
                    this.$message.warning('请先登录！')
                    this.$router.push({path: '/Login?login=1'})
                }
            })
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
.avatar-uploader .el-icon-upload {
    font-size: 67px;
    color: #C0C4CC;
    margin: 10px 0 16px;
    line-height: 50px;
}
.avatar-uploader .div {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 120px;
    height: 120px;
}
.avatar-uploader .el-upload-dragger {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 220px;
    height: 120px;
    text-align: center;
    position: relative;
    overflow: hidden;
    margin-left: 20px;
}
.avatar-uploader .el-upload-dragger:hover {
    border-color: #409EFF;
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
.upload-tip {
    margin-left: 250px;
}
@media screen and (max-width: 500px) {
    .avatar {
        width: 70px;
        height: 70px;
    }
    .userInfoBox .leftTitle{
        width: auto !important;
    }
    .upload-tip {
        margin-left: auto;
    }
}
.gotoEdit{
    font-size: 15px;
    float:right;
    cursor: pointer;
    margin-left: 10px;
    /* color:#999; */
}
.gotoEdit:hover {
    /* color:#333; */
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
