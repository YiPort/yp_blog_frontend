<template>
    <div>
        <wbc-nav></wbc-nav>
        <el-card class="box-card">
        <div>
            <el-collapse accordion>
            <el-collapse-item name="1">
                <template slot="title">
                    <p style="font-weight: bold;">账号安全</p>
                </template>
                <el-button type="primary" @click="getAccount()" icon="el-icon-user">找回账号</el-button>
                <el-button type="primary" @click="updatePassword()" icon="el-icon-lock">忘记密码</el-button>
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
        <el-form v-if="showForm" label-width="250px" ref="dynamicValidateForm" :model="accountForm">
            <el-form-item label="邮箱" prop="email" :rules="[
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]">
                <el-input v-model="accountForm.email"
                style="width:50%"
                placeholder="请输入账号绑定的邮箱"
                clearable></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
                <el-input
                v-model="accountForm.captcha"
                style="width:50%"
                :disabled="!sengCaptcha"
                placeholder="请输入验证码"
                @keyup.enter.native="sendForm('account')"
                clearable></el-input>
                <el-button type="primary" :loading="sendLoading" @click="sendMailCaptcha('account')">发送验证码</el-button>
            </el-form-item>
        </el-form>
        <div v-else>
            您的账号为：<a style="color: #409eff">{{myAccount}} </a>
            <i style="cursor: pointer;" @click="copyMail(myAccount)" class="el-icon-copy-document"/>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="accountDialog=false">关 闭</el-button>
            <el-button v-show="showForm" type="primary" @click="sendForm('account')">确 定</el-button>
        </div>
        </el-dialog>

        <el-dialog title="修改密码" :visible.sync="passwordDialog" center destroy-on-close :close-on-click-modal="false">
        <el-form label-width="250px" status-icon ref="dynamicValidateForm" :rules="rules" :model="passwordForm">
            <el-form-item label="邮箱" prop="email">
                <el-input
                v-model="passwordForm.email"
                style="width:50%"
                autocomplete="off"
                placeholder="请输入账号绑定的邮箱"
                clearable></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
                <el-input
                v-model="passwordForm.password"
                style="width:50%"
                placeholder="请输入新密码"
                autocomplete="off"
                clearable></el-input>
            </el-form-item>
            <el-form-item label="再次输入密码" prop="checkPassword">
                <el-input
                v-model="passwordForm.checkPassword"
                style="width:50%"
                placeholder="请输入再次输入密码"
                autocomplete="off"
                @keyup.enter.native="sendForm('password')"
                clearable></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
                <el-input
                v-model="passwordForm.captcha"
                style="width:50%"
                :disabled="!sengCaptcha"
                placeholder="请输入验证码"
                @keyup.enter.native="sendForm('password')"
                clearable></el-input>
                <el-button type="primary" :loading="sendLoading" @click="sendMailCaptcha('password')">发送验证码</el-button>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="passwordDialog=false">关 闭</el-button>
            <el-button type="primary" @click="sendForm('password')">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import header from '../components/header.vue'
import { sendRetrieveAccountCaptcha,retrieveAccount,sendUpdatePasswordCaptcha,updatePasswordByMail } from '../api/user.js'

export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (value.length < 8 || value.length > 16 ) {
                callback(new Error('密码为8~16位'));
            }else {
                if (this.passwordForm.password !== '') {
                    this.$refs.dynamicValidateForm.validateField('checkPassword');
                }
                callback();
            }
        };
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
            email: 'blog@yiport.top',
            accountDialog: false,
            passwordDialog: false,
            accountForm: {
                email: '',
                captcha: ''
            },
            sendLoading: false,
            sengCaptcha: false,
            showForm: true,
            myAccount: '',
            passwordForm: {
                email: '',
                captcha: '',
                password: '',
                checkPassword: ''
            },
            rules: {
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' }
                ],
                checkPassword: [
                    { required: true, validator: validatePass2, trigger: 'blur' }
                ]
            }
        }
    },
    created(){

    },
    methods: {
        sendMailCaptcha(flag){  //发送邮箱验证码
            this.$refs["dynamicValidateForm"].validate((valid) => {
                if (valid) {
                    this.sendLoading = true;
                    setTimeout(() => {
                        this.sendLoading = false;
                    }, 5000);
                    this.sengCaptcha = true;
                    if(flag==='account'){
                        sendRetrieveAccountCaptcha({email:this.accountForm.email}).then(res => {
                            this.sendLoading = false;
                            this.$message.success("验证码已发送到邮箱，注意查收");
                        })
                    }
                    if(flag==='password'){
                        sendUpdatePasswordCaptcha({email:this.passwordForm.email}).then(res => {
                            this.sendLoading = false;
                            this.$message.success("验证码已发送到邮箱，注意查收");
                        })
                    }
                } else {
                    return false;
                }
            });
        },
        sendForm(flag){   //找回账号
            this.$refs["dynamicValidateForm"].validate((valid) => {
                if (valid) {
                    if(flag==='account'){
                        if(!this.accountForm.captcha){
                            this.$message.warning("请填写验证码");
                            return;
                        }
                        retrieveAccount(this.accountForm).then(res => {
                            this.showForm = false;
                            this.myAccount = res;
                        })
                    }
                    if(flag==='password'){
                        if(!this.passwordForm.captcha){
                            this.$message.warning("请填写验证码");
                            return;
                        }
                        updatePasswordByMail(this.passwordForm).then(res => {
                            this.$message.success("密码修改成功");
                            this.passwordDialog = false;
                        })
                    }
                } else {
                    return false;
                }
            });
        },
        getAccount(){
            this.accountForm = {
                email: '',
                captcha: ''
            }
            this.myAccount = '';
            this.sendLoading = false;
            this.showForm = true;
            this.sengCaptcha = false;
            this.accountDialog = !this.accountDialog;
        },
        updatePassword(){
            this.passwordForm = {
                email: '',
                captcha: '',
                password: '',
                checkPassword: ''
            }
            this.sendLoading = false;
            this.sengCaptcha = false;
            this.passwordDialog = !this.passwordDialog;
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
