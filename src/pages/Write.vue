<!-- 写博客 -->
<template>
    <div>
        <yp-nav></yp-nav>
        <div class="container">
            <!-- 回到顶部 -->
            <el-backtop :bottom="185" class="back-top" :visibility-height="2000">
                <div
                style="
                {
                    position: fixed;
                    bottom: 180px;
                    right: 40px;
                    box-shadow: #333;
                    z-index:9999;
                }
                ">up</div>
            </el-backtop>
            <div class="tcommonBox">
                <el-divider>文章标题/摘要</el-divider>
                <el-input
                ref="title"
                type="text"
                placeholder="文章标题"
                v-model="title"
                maxlength="20"
                prefix-icon="el-icon-edit"
                show-word-limit>
                </el-input>
                <el-input
                type="text"
                placeholder="文章摘要"
                v-model="summary"
                maxlength="50"
                prefix-icon="el-icon-notebook-2"
                show-word-limit>
                </el-input>
                <el-divider>文章配置
                    <el-tooltip class="item" effect="dark" content="每个用户每天只能上传10张图片（包括缩略图和文章图片）" placement="top">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-divider>
                <el-input
                type="text"
                placeholder="缩略图"
                v-model="thumbnail"
                prefix-icon="el-icon-picture">
                <template slot="prepend">https://</template>
                <!-- <el-button slot="append" @click="handleThumbnailSuccess" type="primary" plain icon="el-icon-upload">上传</el-button> -->
                <el-upload
                action="#"
                slot="append"
                name="thumbnail"
                :show-file-list="false"
                :http-request="handleThumbnailSuccess"
                :before-upload="beforeThumbnailUpload"
                accept=".jpg,.png,.jpeg">
                <el-button icon="el-icon-upload">上传</el-button>
                </el-upload>
                </el-input>
                <el-divider></el-divider>
                <el-switch
                v-model="isComment"
                active-text="允许评论"
                inactive-text="禁止评论"
                active-value="1"
                inactive-value="0">
                </el-switch>
                <el-divider direction="vertical"></el-divider>
                <el-tooltip class="item" effect="dark" content="请选择文章所属分类" placement="top">
                <el-select ref="select" v-model="id" placeholder="请选择文章所属分类">
                    <el-option
                    v-for="item in classListObj"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
                </el-tooltip>

                <el-tooltip class="item" effect="dark" content="查看编辑记录" placement="left" :hide-after="1000">
                    <el-button
                    type="primary"
                    icon="el-icon-s-order"
                    circle class="get-edithistory button1"
                    @click="getEditHistory">
                    </el-button>
                </el-tooltip>

                <el-drawer
                title="编辑记录"
                :visible.sync="historyDrawer"
                direction="ltr"
                size=50%>
                    <div style="margin:20px">
                        排序：
                        <el-radio-group v-model="reverse">
                        <el-radio :label="true">倒序</el-radio>
                        <el-radio :label="false">正序</el-radio>
                        </el-radio-group>
                    </div>
                    <el-timeline style="margin-left:20px" :reverse="reverse">
                        <el-timeline-item
                        v-for="(activity, index) in activities"
                        placement="top"
                        :key="index"
                        :icon="activity.icon"
                        :type="activity.type"
                        :color="activity.color"
                        :size="activity.size?activity.size:'normal'"
                        :timestamp="activity.timestamp"
                        @click.native="handleSelectActivity(activity)"
                        >
                        <div :class="activity.recordId?'time-line':''">{{activity.content}}</div>
                        </el-timeline-item>
                    </el-timeline>
                </el-drawer>

                <el-tooltip class="item" effect="dark" content="新建分类" placement="left" :hide-after="1000">
                    <el-button
                    type="primary"
                    icon="el-icon-plus"
                    circle class="add-category button1"
                    @click="addCategory"
                    :disabled="!userRole">
                    </el-button>
                </el-tooltip>

                <el-dialog title="新建分类" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="分类名称">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="分类描述">
                    <el-input v-model="form.description" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitCategory">确 定</el-button>
                </div>
                </el-dialog>

                <el-divider direction="vertical"></el-divider>
                <el-tooltip class="item" effect="dark" content="重置" placement="top">
                <el-button type="primary" icon="el-icon-refresh" circle @click="refreshAll"></el-button>
                </el-tooltip>
                <el-divider direction="vertical"></el-divider>
                <el-button type="warning" @click="saveDraft">保存为草稿
                    <i class="el-icon-folder-opened el-icon--right"></i>
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button v-if="userRole" type="primary" @click="saveCommit">发布
                    <i class="el-icon-check el-icon--right"></i>
                </el-button>
                <el-button v-else type="primary" @click="saveCommit" :disabled="!haslogin">提交审核
                    <i class="el-icon-check el-icon--right"></i>
                </el-button>

                <el-tooltip class="item" effect="dark" content="我的草稿" placement="left" :hide-after="1000">
                <el-button
                type="warning"
                icon="el-icon-folder-opened"
                circle class="draft button1"
                @click="getDraft">
                </el-button>
                </el-tooltip>

                <el-drawer
                title="我的草稿"
                :visible.sync="drawer"
                direction="ltr"
                size=50%>
                <el-divider></el-divider>
                <ul class="infinite-list">
                    <li v-for="(item,index) in draftList" :key="item.id" class="list">
                        {{item.title}}/{{item.summary}}
                        <button class="btn btn-danger" @click="deleteDraft(item.id)">删除</button>
                        <button class="btn btn-edit" @click="loadDraft(index)">编辑</button>
                    </li>
                </ul>
                </el-drawer>
            </div>
            <div class="tcommonBox">
                <div id="main">
                    <mavon-editor
                    ref="md"
                    v-model="content"
                    @save="saveFile"
                    @imgAdd="handleImgAdd"
                    @imgDel="handleImgDel">
                        <template v-slot:left-toolbar-after>
                            <button
                            type="button"
                            title="导入md文件"
                            class="op-icon fa markdown-upload iconfont iconupload"
                            aria-hidden="true"
                            @click="uploadFile">
                            <i class="el-icon-upload" />
                            </button>
                        </template>
                    </mavon-editor>
                    <!-- 隐藏的input，用来选择文件 -->
                    <input ref="uploadInput" style="display: none" type="file" accept=".txt,.md" @change="uploadFileChange">
                </div>
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
import store from '../store'
import { postArticle,getDraft,getEditHistory,deleteDraft,getArticleEditRecord } from '../api/article'
import {uploadImage,deleteImage} from  '../api/resource.js'
import { MessageBox } from 'element-ui'
import router from '@/router'
import { getUserInfo } from '../api/user'
import { addCategory,getCategoryList } from '../api/category'

    export default {
        name: 'Write',
        data() { //选项 / 数据
            return {
                content:'',//Markdown文本内容
                title:'',//文章标题
                summary:'',//文章摘要
                status:'1',//是否发布
                isComment:'1',//是否允许评论
                id:'',//分类id
                thumbnail:'',//缩略图
                articleId: null,//文章id
                viewCount: null,//文章浏览量
                articleObj:{   //用于本地保存未提交的草稿
                    id:'',//文章id
                    userId:'',//用户id
                    content:'',//Markdown文本内容
                    title:'',//文章标题
                    summary:'',//文章摘要
                    status:'1',//是否发布
                    isComment:'1',//是否允许评论
                    categoryId:'',//分类id
                    thumbnail:'',//缩略图
                    viewCount: null,//文章浏览量
                },
                form:{//新建分类表单
                    name:'',
                    description:'',
                },
                drawer:false,//是否显示侧边抽屉
                historyDrawer:false,//是否显示编辑历史侧边抽屉
                dialogFormVisible:false,//是否新建分类表单
                draftList:[],//草稿列表
                activities:[],//编辑记录
                reverse:true,//时间线反转
                uploadURL:'',
                userInfo:{},//本地存储的用户信息
                userInfoObj:'',//用户的信息
                haslogin:false,//是否登录
                imgArray: {},//上传的图片链接
            }
        },
        computed: {
            classListObj() {  //分类列表
                return this.$store.state.classListObj;
            },
            userRole() {  //用户角色
                const role = this.userInfoObj.userRole;
                if(role === "1") {
                    return true;
                }else {
                    return false;
                }
            },
        },
        methods: { //事件处理器
            handleThumbnailSuccess(params) {   // 上传缩略图
              if(this.haslogin) {
                let formData = new FormData();
                formData.append('img', params.file);
                uploadImage(formData).then(res => {
                    this.thumbnail = res;
                    this.$message.success('上传成功！');
                })
              }else {
                this.loginMessage();
              }
            },
            async beforeThumbnailUpload(file) {    //判断缩略图大小
                const isJPG = file.type == 'image/png'||file.type=='image/jpg'||file.type=='image/jpeg';
                const isLt3M = file.size / 1024 / 1024  < 3;
                // console.log(file);
                if (!isJPG) {
                  this.$message.error('上传图片只能是 JPG/JPEG/PNG 格式!').then(() => {
                    return false;
                  });
                }
                if (!isLt3M) {
                  this.$message.error('上传图片大小不能超过 3MB!').then(() => {
                    return false;
                  });
                }
                return true;
            },
            handleImgAdd(pos, file) {    // 上传文章图片
                if(this.haslogin) {
                    let formdata = new FormData();
                    formdata.append('img', file);
                    uploadImage(formdata).then(res => {
                        this.$message.success('上传成功！');
                        setTimeout(() => {
                            let url = res;
                            // let name = file.name;
                            let content = this.content;
                            // 将返回的url替换到文本原位置![file.name](1) -> ![file.name](url)
                            // if (content.includes(name)) {    // 文件名含有“-”时“-”会被去除，会导致url替换不成功
                                let oStr = `(${pos})`;
                                let nStr = `(${url})`;
                                let index = content.indexOf(oStr);
                                let str = content.replace(oStr, '');
                                let insertStr = (soure, start, newStr) => {
                                    return soure.slice(0, start) + newStr + soure.slice(start);
                                }
                                console.log("preContent:", this.content)
                                this.content = insertStr(str, index, nStr);
                                console.log("nowContent:", this.content)
                                this.imgArray[pos] = url;
                            // }
                        }, 500);
                    })
                }else {
                    this.loginMessage();
                }
            },
            handleImgDel(pos) {    // 删除上传的文章图片
                console.log('pos',pos);
                console.log('url',`![${pos[1].name}](${this.imgArray[pos[0]]})`);
                this.content = this.content.replace(`![${pos[1].name}](${this.imgArray[pos[0]]})`, '');
                deleteImage({url:this.imgArray[pos[0]]}).then(res => {
                    this.imgArray[pos[0]] = undefined;
                })
            },
            saveFile(text) {    // 将文章保存到本地
                if(!this.title) {
                    this.$message.info('文章标题不能为空');
                    this.$refs.title.focus();
                    return;
                }
                if(!this.content) {
                    this.$message.info('文章内容不能为空');
                    return;
                }
                const eleLink = document.createElement('a');
                eleLink.download = this.title + '.md';
                eleLink.style.display = 'none';
                // 将内容转为 blob
                const blob = new Blob([text], {type: 'text/markdown;charset=utf-8'});
                eleLink.href = URL.createObjectURL(blob);
                document.body.appendChild(eleLink);
                eleLink.click();
                document.body.removeChild(eleLink);
            },
            handleSelectActivity(active) {     // 获取文章详情历史记录
                if(active.recordId) {
                    getArticleEditRecord({recordId:active.recordId}).then(res => {
                        this.reloadArticle(res);
                        this.historyDrawer = false;
                    })
                }
            },
            routeChange() {     //展示页面信息
                var that = this;
                if(localStorage.getItem('userInfo')){
                    that.haslogin = true;
                    that.userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    getUserInfo().then((response)=>{
                        that.userInfoObj = response;
                        that.userInfoObj.head_start = 0;
                    })
                }else{
                    that.haslogin = false;
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
            postArticle() { //文章提交
                const userInfo = localStorage.getItem('userInfo');
                if(!userInfo) {
                    this.loginMessage();
                    return;
                }
                if(!this.title) {
                    this.$message.info('文章标题不能为空');
                    this.$refs.title.focus();
                    return;
                }
                if(!this.content) {
                    this.$message.info('文章内容不能为空');
                    return;
                }
                if(!this.id) {
                    this.$message.info('请选择文章分类');
                    this.$refs.select.toggleMenu();
                    return;
                }
                const userId = JSON.parse(userInfo).id;
                postArticle(this.articleId,userId,this.title,this.content,this.summary,this.status,this.isComment,this.id,this.thumbnail,this.viewCount)
                        .then((response) => {
                            if(this.status===0){
                                this.$message({
                                    type:'success',
                                    message:'提交成功'
                                })
                            }else{
                                this.$message({
                                    type:'success',
                                    message:'保存成功'
                                })
                            }
                            this.refresh();     //重置文章数据
                            if(response && this.userRole) {
                                this.$store.commit('loadingIndex',true) //标记需要重新提交文章索引
                                router.push({   //跳转到文章页面
                                    path: '/DetailArticle?aid=' + response
                                });
                            }
                        })
            },
            saveDraft() {  //保存为草稿
                this.status = '1';
                this.postArticle();
            },
            saveCommit() {  //提交
                this.status = '0';
                this.postArticle();
            },
            reloadArticle(articleObj) {
                this.articleId = articleObj.id;
                this.title = articleObj.title;
                this.content = articleObj.content;
                this.summary = articleObj.summary;
                this.status = articleObj.status;
                this.isComment = articleObj.isComment;
                this.id = articleObj.categoryId;
                this.thumbnail = articleObj.thumbnail;
                this.viewCount = articleObj.viewCount;
            },
            getArticleObj() {   //获取未提交编辑
                const articleObj = JSON.parse(localStorage.getItem('articleObj'));
                this.reloadArticle(articleObj);
            },
            refreshAll() {  //重新编辑
                this.$confirm('确认重新编辑文章？确认后文章和配置将不能找回', '系统提示', {
                        confirmButtonText: '重置',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                            this.refresh();
                         })
            },
            refresh() {     //重置文章数据
                this.content = '';//Markdown文本内容
                this.title = '';//文章标题
                this.summary = '';//文章摘要
                this.status = '1';//是否发布
                this.isComment = '1';//是否允许评论
                this.classListObj = null;//分类
                this.id = '';//分类id
                this.thumbnail = '';//缩略图
                this.articleId = '';//文章id
                this.viewCount = null,//文章浏览量
                localStorage.removeItem('articleObj');
            },
            getDraft() { //获取草稿列表
                const id = this.userInfo.id;
                if(!id) {
                   this.loginMessage();
                }else {
                    getDraft().then((response) =>{
                        this.draftList = response;
                    })
                    this.drawer = true;
                }
            },
            loadDraft(index) { //加载草稿
                const articleObj = this.draftList[index];
                this.reloadArticle(articleObj);
                this.drawer = false;
            },
            addCategory() { //新建分类
                if(!this.userInfoObj) {
                    this.loginMessage();
                }else {
                    this.dialogFormVisible = true;
                }
            },
            submitCategory() {  //提交新建分类
                var that = this;
                const createBy = this.userInfo.id;
                const name = this.form.name;
                const description = this.form.description;
                addCategory(name,description,createBy).then((response) =>{
                    this.dialogFormVisible = false;
                    this.$message({
                        type:'success',
                        message:'新建成功'
                    })
                    getCategoryList().then((response)=>{
                        that.$store.commit('getCategoryList',response)
                    })
                })
            },
            getEditHistory() {  //获取编辑记录
                const id = this.userInfo.id;
                if(!id) {
                   this.loginMessage();
                }else {
                    getEditHistory().then((response) =>{
                        this.activities = response;
                    })
                    this.historyDrawer = true;
                }
            },
            deleteDraft(articleId) {    // 删除草稿
                this.$confirm('确定要删除草稿吗？', '系统提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteDraft(articleId).then((response) => {
                        if(this.articleId === articleId) {  //将当前编辑的草稿id重置
                            this.articleId = null;
                        }
                        getDraft().then((response) =>{   //重新获取草稿列表
                            this.draftList = response;
                        })
                        this.$message({
                            type:'success',
                            message:'删除成功'
                        })
                    })
                })
            },
            uploadFile() {
                // 通过ref找到隐藏的input标签，触发它的点击方法
                this.$refs.uploadInput.click()
            },
            uploadFileChange(e) {   //监听input获取文件的状态
                // 获取到input选取的文件
                const file = e.target.files[0];
                let type = file.name.split('.')[1];
                if(type !== 'md' && type !== 'txt') {   //验证文件类型
                    this.$message({
                        type: 'error',
                        message: '请选择 .md 或 .txt 类型文件！',
                        duration: 4000
                    })
                    return;
                }
                // 读取文件
                let that = this;
                let reader = new FileReader();
                reader.onload = function FileReaderCompleted() {
                    that.content = reader.result;
                    return;
                }
                reader.readAsText(file);
            },
        },
        components: { //定义组件
            'yp-nav':header,
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route':'routeChange',
            //侦听Markdown文本内容
            content(newValue){
                this.articleObj.content = newValue;
            },
            //侦听文章标题
            title(newValue){
                this.articleObj.title = newValue;
            },
            //侦听文章摘要
            summary(newValue){
                this.articleObj.summary = newValue;
            },
            //侦听是否发布
            status(newValue){
                this.articleObj.status = newValue;
            },
            //侦听是否允许评论
            isComment(newValue){
                this.articleObj.isComment = newValue;
            },
            //侦听分类id
            id(newValue){
                this.articleObj.categoryId = newValue;
            },
            //侦听缩略图
            thumbnail(newValue){
                this.articleObj.thumbnail = newValue;
            },
            //侦听文章id
            articleId(newValue){
                this.articleObj.id = newValue;
            },
            //侦听文章浏览量
            viewCount(newValue){
                this.articleObj.viewCount = newValue;
            }
         },
        created() { //生命周期函数
            this.routeChange();
            this.uploadURL = store.state.resourceURL+'upload'
        },
        mounted() { //生命周期函数
            // 加载编辑数据
            const articleObj = JSON.parse(localStorage.getItem('articleObj'))
            if (articleObj) {
                this.getArticleObj()
            }
        },
        beforeDestroy() {  //生命周期函数
            // 销毁前将保存编辑数据
            localStorage.setItem('articleObj',JSON.stringify(this.articleObj));
        }
    }
</script>

<style lang="less">
.time-line {
    color: #409eff;
}
.time-line:hover {
    cursor: pointer;
    text-decoration: underline;
    color: #409eff;
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
/* li{
    margin: 10px 10px 0 10px;

}
li:hover{
    cursor: pointer;
    padding: 10px 0 10px 0;
    background: rgb(243, 240, 240);
} */
.get-edithistory{
    position: fixed;
    bottom: 135px;
	right: 40px;
    box-shadow: #333;
    z-index:9999;
}
.add-category{
    position: fixed;
    bottom: 87px;
	right: 40px;
    box-shadow: #333;
    z-index:9999;
}
.draft{
    position: fixed;
    bottom: 40px;
	right: 40px;
    box-shadow: #333;
    z-index:9999;
}
.button1 {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
}
.button2:hover {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
}
.userInfoBox .avatarlist{
    position: relative;
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
.userInfoBox .fa-asterisk{
    color: #DF2050;
}
/* 引用样式 */
.blockquote {
    border-left:#eee solid 5px;
    padding-left:20px;
}
/* 列表样式 */
.ul li {
    line-height: 20px;
}

/* 代码样式 */
.code {
    color:#D34B62;
    background: #F6F6F6;
}

</style>
