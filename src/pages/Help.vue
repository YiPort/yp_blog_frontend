<template>
    <div>
        <wbc-nav></wbc-nav>
        <el-card class="box-card">
        <div>
            <el-collapse v-model="activeName" accordion>
            <el-collapse-item name="1">
                <template slot="title">
                    <p style="font-weight: bold;">账号安全</p>
                </template>
                <el-button type="primary" @click="getAccount()" icon="el-icon-user">找回账号</el-button>
                <!-- <el-button type="primary" icon="el-icon-lock">忘记密码</el-button> -->
            </el-collapse-item>
            <el-collapse-item name="2">
                <template slot="title">
                    <p style="font-weight: bold;">问题反馈</p>
                </template>
                <div>
                    发送到邮箱：<a style="color: #409eff">{{email}} </a>
                    <i style="cursor: pointer;" @click="copyMail(email)" class="el-icon-copy-document"/>
                </div>
            </el-collapse-item>
            </el-collapse>
        </div>
        </el-card>
        <el-dialog title="找回账号" :visible.sync="accountDialog" center destroy-on-close :close-on-click-modal="false">
        <el-form v-if="showForm" label-width="250px" ref="dynamicValidateForm" :model="form">
            <el-form-item label="邮箱" prop="email" :rules="[
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]">
                <el-input v-model="form.email"
                style="width:50%"
                :disabled="sengCaptcha"
                placeholder="请输入账号绑定的邮箱"
                clearable></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
                <el-input
                v-model="form.captcha"
                style="width:50%"
                :disabled="!sengCaptcha"
                placeholder="请输入验证码"
                clearable></el-input>
                <el-button type="primary" :loading="sendLoading" @click="sendMailCaptcha()">发送验证码</el-button>
            </el-form-item>
        </el-form>
        <div v-else>
            您的账号为：<a style="color: #409eff">{{myAccount}} </a>
            <i style="cursor: pointer;" @click="copyMail(myAccount)" class="el-icon-copy-document"/>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="accountDialog=false">关 闭</el-button>
            <el-button v-show="showForm" type="primary" @click="retrieveAccount()">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import header from '../components/header.vue'
import { sendRetrieveAccountCaptcha,retrieveAccount } from '../api/user.js'

export default {
    data() {
        return {
            email: 'blog@yiport.top',
            accountDialog: false,
            form: {
                email: '',
                captcha: ''
            },
            sendLoading: false,
            sengCaptcha: false,
            showForm: true,
            myAccount: ''
        }
    },
    created(){

    },
    methods: {
        sendMailCaptcha(){  //发送邮箱验证码
            this.$refs["dynamicValidateForm"].validate((valid) => {
                if (valid) {
                    this.sendLoading = true;
                    this.sengCaptcha = true;
                    sendRetrieveAccountCaptcha({email:this.form.email}).then(res => {
                        this.sendLoading = false;
                        this.$message.success("验证码已发送到邮箱，注意查收");
                    })
                } else {
                    return false;
                }
            });
        },
        retrieveAccount(){   //找回账号
            this.$refs["dynamicValidateForm"].validate((valid) => {
                if (valid) {
                    if(!this.form.captcha){
                        this.$message.warning("请填写验证码");
                        return;
                    }
                    retrieveAccount({email:this.form.email,captcha:this.form.captcha}).then(res => {
                        this.showForm = false;
                        this.myAccount = res;
                    })
                } else {
                    return false;
                }
            });
        },
        getAccount(){
            this.form = {
                email: '',
                captcha: ''
            }
            this.myAccount = '';
            this.showForm = true;
            this.sendLoading = false;
            this.sengCaptcha = false;
            this.accountDialog = !this.accountDialog;
        },
        copyMail(msg){
            navigator.clipboard.writeText(msg).then(() => {
            this.$message({
                type:'success',
                message:'已复制到剪贴板',
                duration: 1000
            })
          });
        }
    },
    components: { //定义组件
        'wbc-nav':header,
    },
}
</script>

<style>
.text {
    font-size: 14px;
}
.item {
    padding: 18px 0;
}
.box-card {
    width: 45%;
    height: 700px;
    margin: auto;
    text-align: center;
}
</style>