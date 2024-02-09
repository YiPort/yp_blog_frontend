<!-- 登录注册 -->
<template>
    <div>
        <div class="container" style="min-height: 86.5vh">
            <div v-if="login==0||login==2" style="margin: auto;width: 50%;padding-top: 5px">
                <el-steps :active="active" finish-status="success">
                    <el-step title="注册"></el-step>
                    <el-step title="绑定邮箱"></el-step>
                </el-steps>
            </div>
            <div v-if="login==2" class="mailBox">
                <div class="lr-title">
                        <h1>绑定邮箱</h1>
                    </div>
                <el-form status-icon ref="dynamicValidateForm1" :model="mailForm">
                    <el-form-item prop="email" :rules="[
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                        ]">
                        <el-input v-model="mailForm.email"
                        placeholder="请输入邮箱"
                        clearable><i slot="prefix" style="color:#409EFF;" class="el-input__icon el-icon-message" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="captcha">
                        <el-input
                        v-model="mailForm.captcha"
                        :disabled="!sengCaptcha"
                        style="width:63%"
                        placeholder="请输入验证码"
                        @keyup.enter.native="verifyMail()"
                        clearable><i slot="prefix" style="color:#409EFF;" class="el-input__icon el-icon-chat-line-round" />
                        </el-input>
                        <time-button :reset="reset" @click.native="sendMailCaptcha()" content="发送验证码"/>
                    </el-form-item>
                </el-form>
                <div style="text-align: center;padding-bottom: 40;">
                    <el-button type="primary" @click="verifyMail()">确 定</el-button>
                </div>
                <div class="lr-title">
                <p>
                    <a href="#/Login?login=1" class="tcolors" >跳过<i class="el-icon-d-arrow-right"></i></a>
                </p>
                </div>
            </div>
            <div v-if="login==1" class="loginTitle"/>
            <!-- 登录 -->
            <div>
                <div v-if="login==1" class="loginBox">
                    <div class="lr-title">
                        <h1>登录</h1>
                    </div>
                    <el-form status-icon ref="dynamicValidateForm" :rules="loRules" :model="loginForm">
                    <el-form-item prop="userName">
                        <el-input
                        type="text"
                        placeholder="请输入用户名"
                        v-model="loginForm.userName"
                        clearable>
                        <i slot="prefix" style="color:#409EFF;" class="el-input__icon el-icon-user" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                        type="password"
                        placeholder="请输入密码"
                        v-model="loginForm.password"
                        autocomplete="new-password"
                        show-password
                        clearable><i slot="prefix" style="color:#409EFF;" class="el-input__icon el-icon-lock" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="captcha">
                        <el-input
                        style="width:200px"
                        placeholder="请输入验证码"
                        @keyup.enter.native="gotoHome"
                        v-model="loginForm.captcha"
                        clearable><i slot="prefix" style="color:#409EFF;" class="el-input__icon el-icon-chat-line-round" />
                        </el-input>
                        <el-button v-if="!loCaptchaImage" type="primary" @click="handleClickImge(1)">获取验证码</el-button>
                        <img v-else style="float:right;cursor:pointer;" :src="loCaptchaImage" alt="请稍后再试" @click="handleClickImge(1)" title="看不清？点击刷新" />
                    </el-form-item>
                    </el-form>
                    <div class="lr-title">
                    <p style="left: 0;">
                        <a class="tcolors" href="#/Help">忘记账号密码？</a>
                    </p>
                    <p>
                        没有账号？<a href="javascript:void(0);" @click="goRegister()" class="tcolors" >注册</a>
                        <!-- 没有账号？<a href="https://user.ultima.ink/#/Register?origin=ultima.ink%2F%23%2FLogin%3Flogin%3D1" class="tcolors" >用户中心注册</a> -->
                    </p>
                    </div>
                    <div class="lr-btn tcolors-bg" @click="gotoHome">登 录</div>
                    <div class="lr-title">
                    <p><a class="tcolors"  href="#/Home">暂不登录<i class="el-icon-d-arrow-right"></i></a></p>
                    </div>
                    <div class="otherLogin" >
                    </div>
                </div>
            </div>
            <!-- 注册 -->
            <div>
                <div v-if="login==0" class="registerBox">
                    <div class="lr-title">
                        <h1>注册</h1>
                    </div>
                    <el-form status-icon ref="dynamicValidateForm" :rules="reRules" :model="registerForm">
                    <el-form-item prop="userName">
                        <el-input
                        type="text"
                        placeholder="请输入用户名"
                        v-model="registerForm.userName"
                        clearable>
                        <i slot="prefix" style="color:#409EFF;" class="el-input__icon el-icon-user" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                        type="password"
                        placeholder="请输入密码"
                        v-model="registerForm.password"
                        autocomplete="new-password"
                        show-password
                        clearable><i slot="prefix" style="color:#409EFF;" class="el-input__icon el-icon-lock" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="checkPassword">
                        <el-input
                        type="password"
                        placeholder="请再次输入密码"
                        v-model="registerForm.checkPassword"
                        autocomplete="new-password"
                        show-password
                        clearable><i slot="prefix" style="color:#409EFF;" class="el-input__icon el-icon-lock" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="captcha">
                        <el-input
                        type="text"
                        style="width:200px"
                        placeholder="请输入验证码"
                        @keyup.enter.native="newRegister"
                        v-model="registerForm.captcha"
                        clearable><i slot="prefix" style="color:#409EFF;" class="el-input__icon el-icon-chat-line-round" />
                        </el-input>
                        <el-button v-if="!reCaptchaImage" type="primary" @click="handleClickImge(0)">获取验证码</el-button>
                        <img v-else style="float:right;cursor:pointer;" :src="reCaptchaImage" alt="请稍后再试" @click="handleClickImge(0)" title="看不清？点击刷新" />
                    </el-form-item>
                    </el-form>
                    <div class="lr-title">
                    <p style="left: 0;">
                        <a class="tcolors" href="#/Help">注册遇到问题？</a>
                    </p>
                    <p>
                        <a href="javascript:void(0);" @click="goLogin()" class="tcolors" >登录</a>
                    </p>
                    </div>
                    <div class="lr-btn tcolors-bg" @click="newRegister">注 册</div>
                    <div class="lr-title">
                    <p><a class="tcolors"  href="#/Home">暂不注册<i class="el-icon-d-arrow-right"></i></a></p>
                    </div>
                    <div class="otherLogin" >
                    </div>
                </div>
            </div>
        </div>
        <div style="text-align: center;">
            <a>备案号：</a>
            <a href="https://beian.miit.gov.cn/" style="text-decoration: underline;">闽ICP备2021019654号-1</a>
            <p style="margin-top: 10px">Blog ©2021 Created by yiport</p>
        </div>
    </div>
</template>

<script>
import {userLogin,getCaptchaImage,userRegister} from '../api/user.js'
import {sendMailCaptcha,verifyMail} from '../api/user.js'
import timeButton from '../components/timeButton.vue'

export default {
    name: 'LoginAndRegister',
    data() {
        // 账号校验
        var validateAcco = (rule, value, callback) => {
            let accountRegexp = /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,9}$/;
            if (value === '') {
                callback(new Error('请输入账号'));
            } else if (!accountRegexp.test(value)) {
                callback(new Error('账号只含有汉字、数字、字母、下划线，并且长度在4-9之间'));
            }else {
                callback();
            }
        };
        // 密码校验
        var validatePass = (rule, value, callback) => {
            let passwordRegexp = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$\%\^\&\*])[0-9a-zA-Z!@#$\%\^\&\*]{8,16}/;
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (!passwordRegexp.test(value)) {
                callback(new Error('密码必须包含[数字][英文字母][!@#$%^&*]且长度在8-16之间'));
            }else {
                if (this.registerForm.checkPassword !== '') {
                    this.$refs.dynamicValidateForm.validateField('checkPassword');
                }
                callback();
            }
        };
        // 二次输入密码校验
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        // 验证码校验
        var validateCaptcha = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入验证码'));
            } else {
                callback();
            }
        };
        // 密码校验
        var validatePass3 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (value.length < 8 || value.length > 16 ) {
                callback(new Error('密码为8~16位'));
            } else {
                callback();
            }
        };
        return {
            mailForm: {
                email: '',
                captcha: ''
            },
            reset: false,
            sengCaptcha: false,
            loginForm: {
                userName: '',
                password: '',
                captcha: '',
                uuid: ''
            },
            registerForm: {
                userName: '',
                password: '',
                checkPassword: '',
                captcha: '',
                uuid: ''
            },
            loCaptchaImage: undefined,//登录图片验证码
            reCaptchaImage: undefined,//注册图片验证码
            login: 0,//是否已经登录
            urlstate: 0,//重新注册
            active: 0,
            userInfoObj: {
                password: '',
                checkPassword: ''
            },
            reRules: {
                userName: [
                    { required: true, validator: validateAcco, trigger: 'blur' }
                ],
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                checkPassword: [
                    { required: true, validator: validatePass2, trigger: 'blur' }
                ],
                captcha: [
                    { required: true, validator: validateCaptcha, trigger: 'blur' }
                ]
            },
            loRules: {
                userName: [
                    { required: true, validator: validateAcco, trigger: 'blur' }
                ],
                password: [
                    { required: true, validator: validatePass3, trigger: 'blur' }
                ],
                captcha: [
                    { required: true, validator: validateCaptcha, trigger: 'blur' }
                ]
            }
        }
    },
    methods: { //事件处理器
        routeChange(){
            this.login = this.$route.query.login==undefined?1:parseInt(this.$route.query.login);//获取传参的login
            this.urlstate = this.$route.query.urlstate==undefined?0:this.$route.query.urlstate;//获取传参的usrlstate状态码
        },
        // 点击获取验证码
        handleClickImge(flag){
            getCaptchaImage().then((res) =>{
                if(flag==1) {
                    this.loCaptchaImage = "data:image/jpg;base64," + res.captcha;
                    this.loginForm.uuid = res.uuid;
                }
                if(flag==0) {
                    this.reCaptchaImage = "data:image/jpg;base64," + res.captcha;
                    this.registerForm.uuid = res.uuid;
                }
            })
        },
        gotoHome(){//用户登录
            this.$refs["dynamicValidateForm"].validate((valid) => {
                if (valid) {
                    userLogin(this.loginForm).then((response)=>{
                        // 存储用户信息
                        localStorage.setItem("userInfo",JSON.stringify(response));
                        // 登录成功提示
                        this.$message.success('登录成功!');
                        if(localStorage.getItem('logUrl')){
                            this.$router.push({path:localStorage.getItem('logUrl')});
                        }else{
                            this.$router.push({path:'/'});
                        }
                    })
                }
            });
        },
        newRegister(){//注册提交
            this.$refs["dynamicValidateForm"].validate((valid) => {
                if (valid) {
                    userRegister(this.registerForm).then((res) => {
                        this.$message.success('注册成功!');
                        this.active = 1;
                        this.goMail();
                    })
                }else {
                    return false;
                }
            });
        },
        sendMailCaptcha(){  //发送邮箱验证码
            this.$refs["dynamicValidateForm1"].validate((valid) => {
                if (valid) {
                    this.reset = false;
                    this.sengCaptcha = true;
                    sendMailCaptcha({email:this.mailForm.email}).then(res => {
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
            this.$refs["dynamicValidateForm1"].validate((valid) => {
                if (valid) {
                    if(!this.mailForm.captcha){
                        this.$message.warning("请填写验证码");
                        return;
                    }
                    verifyMail({email:this.mailForm.email,captcha:this.mailForm.captcha}).then(res => {
                        this.editMail = false;
                        this.sengCaptcha = false;
                        this.mailForm.captcha = '';
                        this.active = 2;
                        this.$message.success("邮箱绑定成功");
                        this.goLogin();
                    })
                } else {
                    return false;
                }
            });
        },
        goLogin(){//去登陆
            this.loginForm = {
                userName: '',
                password: '',
                captcha: '',
                uuid: ''
            };
            this.loCaptchaImage = undefined;
            this.$router.push({path:'/Login?login=1'});
        },
        goRegister(){//去注册
            this.registerForm = {
                userName: '',
                password: '',
                checkPassword: '',
                captcha: '',
                uuid: ''
            };
            this.reCaptchaImage = undefined;
            this.$router.push({path:'/Login?login=0'});
        },
        goMail(){//去绑定邮箱
            this.mailForm = {
                email: '',
                captcha: ''
            };
            this.$router.push({path:'/Login?login=2'});
        }
    },
    components: { //定义组件
        'time-button':timeButton
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route':'routeChange'
    },
    created() { //生命周期函数
        this.routeChange();
    },
}
</script>

<style>
/*登录注册标题*/
.loginTitle{
    padding-top:50px;
    margin-bottom: 10px;
}
.loginBox ,.registerBox{
    background: #fff;
    padding:40px;
    max-width:320px;
    margin:0 auto;
    border-radius: 7px;
}
.loginBox{
    padding-bottom:0;
}
.mailBox{
    background: #fff;
    padding: 40px;
    max-width: 320px;
    margin: 0 auto;
    border-radius: 7px;
}
.lr-title{
    position: relative;
    height:32px;
    line-height: 32px;
    margin-bottom: 20px;
}
.lr-title h1{
    font-size: 24px;
    color:#666;
    font-weight: bold;
    /*width:50%;*/
}
.lr-title p{
    font-size: 14px;
    color:#999;
    position: absolute;
    right:0;
    top:0;
}
.lr-btn{
    color:#fff;
    text-align: center;
    letter-spacing: 5px;
    padding:8px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 30px;
}
.loginBox .el-input input,.registerBox .el-input input{
    border-radius: 4px;
}
.loginBox h3,.registerBox h3{
    text-align: right;
    margin-bottom: 20px;
}
.loginBox h3 a,.registerBox h3 a{
    font-size: 13px;
    color:#999;
}
.loginBox .otherLogin{
    max-width:320px;
    padding:30px 40px;
    background: #ddd;
    text-align: center;
    margin-left:-40px;
    margin-right: -40px;
    visibility: hidden;
}
.loginBox .otherLogin p{
    margin-bottom:20px;
    font-size: 16px;
}
.loginBox .otherLogin a i{
    display: inline-block;
    width: 42px;
    height: 42px;
    line-height: 42px;
    font-size: 18px;
    border-radius: 50%;
    color:#fff;
    margin: 0 10px;
}
.loginBox .otherLogin a i.fa-wechat{
    background: #7bc549;
}
.loginBox .otherLogin a i.fa-qq{
    background: #56b6e7;
}
.loginBox .otherLogin a i.fa-weibo{
    background: #ff763b;
}

/*登录成功*/
.registerSuc{
    padding: 40px;
    margin: 0 auto;
}
.registerSuc .sucIcon{
    text-align: center;
    margin-bottom: 30px;
    padding-left:60px;
}
.registerSuc .sucContent{
    line-height: 1.5;
    font-size: 15px;
    text-align: center;
}
.registerSuc .sucContent p{
    margin-top: 10px;
    font-size: 13px;
    color: #999;
}
.registerSuc .sucContent .lastbtn{
    display: inline-block;
    font-size: 14px;
    padding: 3px 10px;
    border-radius: 5px;
    color:#fff;
    cursor: pointer;
}
.registerSuc .sucContent  .el-icon-close{
    font-size: 13px;
}
/* 图片校验码 */
.codeImage {
width: 110px;
height: 34px;
border: 1px solid #007ACC;
}
</style>
