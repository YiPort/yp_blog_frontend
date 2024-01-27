<!-- 登录注册 -->
<template>
    <div>
        <div class="container" style="min-height: 86.5vh">
            <h1 class="loginTitle">
                
            </h1>
            <!-- 登录 -->
            <div class="">
                <div v-if="login==1" class="registerBox">
                    <div class="lr-title">
                        <h1>登录</h1>
                    </div>
                    <el-alert
                        v-show="loginErr"
                        :title="loginTitle"
                        type="error"
                        show-icon  :closable="false">
                    </el-alert>
                    <el-input
                        type="text"
                        placeholder="用户名"
                        v-model="username">
                    </el-input>
                    <el-alert
                        v-show="usernameErr"
                        title="账号为4~9位的字母或数字"
                        type="error"
                        show-icon  :closable="false">
                    </el-alert>

                    <el-input
                            type="password"
                          placeholder="密码"
                           @keyup.enter.native="loginEnterFun"
                          v-model="password"
                          show-password>
                    </el-input>
                    <el-alert
                        v-show="passwordErr"
                        title="密码为8~16位,且不能含有空字符"
                        type="error"
                        show-icon  :closable="false">
                    </el-alert>
                    <el-input
                        type="text"
                        style="width:200px"
                        placeholder="验证码"
                        @keyup.enter.native="loginEnterFun"
                        v-model="captcha">
                    </el-input>
                    <img slot="append" style="float:right;cursor:pointer;" :src="changeImage" alt="请稍后再试" @click="handleClickImge" title="看不清？点击刷新" />
                    <el-alert
                        v-show="captchaErr"
                        title="验证码为1~4位"
                        type="error"
                        show-icon  :closable="false">
                    </el-alert>

                    <div class="lr-title">
                    <p style="left: 0; cursor: pointer;">
                        <a class="tcolors" href="#/Help">忘记账号密码？</a>
                    </p>
                    <p>
                        没有账号？<a href="http://localhost:8080/#/Login?login=0" class="tcolors" >用户中心注册</a>
                    </p>
                    </div>
                    <div class="lr-btn tcolors-bg" @click="gotoHome">登录</div>
                    <div class="otherLogin" >
                    </div>
                </div>
            </div>
        </div>
           <div style="text-align: center;">
            <a style="color:aliceblue">备案号：</a>
            <a href="https://beian.miit.gov.cn/" class="font">闽ICP备2021019654号-1</a>
            <p style="color:aliceblue; margin-top: 10px">Blog ©2021 Created by yiport</p>
        </div>
    </div>
</template>

<script>
import {userLogin,getCaptchaImage} from '../api/user.js'
import {savaUserInfo} from '../api/user.js'//获取用户信息，保存用户信息
export default {
    name: 'Login',
    data() { //选项 / 数据
        return {
            username: '',//用户名
            email: '',//邮箱
            password: '',//密码
            captcha: '',//验证码
            changeImage: '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',//图片验证码
            uuid: '',//全局唯一id
            nusername: '',//新用户注册名
            nemail: '',//新用户注册邮箱
            npassword: '',//新用户注册密码
            npassword2: '',//新用户注册重复密码
            login: 0,//是否已经登录
            usernameErr:false,//账号错误
            passwordErr:false,//密码错误
            captchaErr:false,//验证码错误
            loginErr: false,//登录错误
            loginTitle:'用户名或密码错误',
            nusernameErr:false,//新用户注册用户名错误
            nemailErr: false,//新用户注册邮箱错误
            npasswordErr: false,//新用户注册密码错误
            npassword2Err: false,//新用户注册重复密码错误
            registerErr: false,//已注册错误
            registerTitle: '该邮箱已注册',
            step: 1,//注册进度
            fullscreenLoading: false,//全屏loading
            urlstate: 0,//重新注册
            userInfoObj: {
                userPassword: '',
                checkPassword: ''
            }
        }
    },
    mounted() {
        this.handleClickImge();  //加载刷新验证码
    },
    methods: { //事件处理器
        editPassword() {
            savaUserInfo(that.userInfoObj).then((response)=>{//保存信息接口，返回展示页
                that.$message.success( '修改成功！');
                that.isEdit = false;
                that.routeChange();
            })
        },
        routeChange:function(){
            var that = this;
            that.login = that.$route.query.login==undefined?1:parseInt(that.$route.query.login);//获取传参的login
            that.urlstate = that.$route.query.urlstate==undefined?0:that.$route.query.urlstate;//获取传参的usrlstate状态码
            // console.log(that.login,that.urlstate);

        },
        // 点击获取验证码
        handleClickImge: function(){
            getCaptchaImage().then((response) =>{
                this.changeImage = "data:image/jpg;base64," + response.captcha;
                this.uuid = response.uuid;
            })
        },
        loginEnterFun: function(e){
            var keyCode = window.event? e.keyCode:e.which;
            // console.log('回车登录',keyCode,e);
            if(keyCode == 13 ){
                this.gotoHome();
            }
        },
        gotoHome:function(){//用户登录
            this.checkLogin();
            if (this.usernameErr === false && this.passwordErr === false){
                userLogin(this.username,this.password,this.captcha,this.uuid).then((response)=>{
                    // 存储用户信息
                    localStorage.setItem("userInfo",JSON.stringify(response));
                    // 登录成功提示
                    this.$message({
                        type: 'success',
                        message: '登录成功!'
                    });
                    if(localStorage.getItem('logUrl')){
                        this.$router.push({path:localStorage.getItem('logUrl')});
                    }else{
                        this.$router.push({path:'/'});
                    }
                })
            }  
        },
        registerEnterFun: function(e){
            var keyCode = window.event? e.keyCode:e.which;
            // console.log('回车注册',keyCode,e);
            if(keyCode == 13 ){
                this.newRegister();
            }
        },
        checkLogin:function(){ // 登录提交
            var that = this;
            var name = /^.{4,9}$/;
            var name1 = /[\s`!@#$%^&*_\-~()+=|{}':;,\[\].<>/\\?！￥…（）—【】‘；：”“’。，、？]/;
            var pas = /^.{8,16}$/;
            var pas1 = /[\s]/;
            var cap = /^.{1,4}$/;
            if(!name.test(that.username) || name1.test(that.username)){
                that.usernameErr = true;
            }else {
                that.usernameErr = false;
            }
            if(!pas.test(that.password) || pas1.test(that.password)){
                that.passwordErr = true;
            }else{
                that.passwordErr = false;
            }
            if(!cap.test(that.captcha)){
                that.captchaErr = true;
            }else{
                that.captchaErr = false;
            }
        },
        /* newRegister:function(){//注册提交
            var that = this;
            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ;
            var preg = /^(\w){6,12}$/;
            if(that.nusername){
                that.nusernameErr = false;
            }else{
                that.nusernameErr = true;
            }
            if(reg.test(that.nemail)){
                that.nemailErr = false;
            }else{
                that.nemailErr = true;
            }
            if(that.npassword&&preg.test(that.npassword)){
                that.npasswordErr = false;
                if(that.npassword==that.npassword2){
                    that.npassword2Err = false;
                }else{
                    that.npassword2Err = true;
                }
            }else{
                that.npasswordErr = true;
            }
            if(!that.nusernameErr&&!that.nemailErr&&!that.npasswordErr){
                that.fullscreenLoading = true;
                userRegister(that.nusername,that.nnickName,that.nemail,that.npassword).then((response)=>{
                        //注册成功后调整到登录
                        that.goLogin()
                }).catch((error)=>{
                    that.fullscreenLoading = false;
                })
            }
        }, */
        goLogin:function(){//去登陆
            this.$router.push({path:'/Login?login=1'});
        },
        goRegister: function(){//去注册
            this.$router.push({path:'/Login?login=0'});
        }

    },
    components: { //定义组件

    },
    watch: {
    // 如果路由有变化，会再次执行该方法
    '$route':'routeChange'
    },
    created() { //生命周期函数
        var that = this;
        that.routeChange();
    },
}
</script>

<style>
/*登录注册标题*/
.loginTitle{
    text-align: center;
    font-size: 26px;
    padding-top:50px;
    margin-bottom: 20px;
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
.loginBox .el-input,.registerBox .el-input{
    margin-bottom: 20px;
}
.loginBox .el-alert ,.registerBox .el-alert{
    top:-18px;
    background-color: #888;
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
