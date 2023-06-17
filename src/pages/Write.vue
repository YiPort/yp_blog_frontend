<!-- 写博客 -->
<template>
  <div>
    <wbc-nav></wbc-nav>
    <div class="container">
      <div class="tcommonBox">
        <el-divider>文章标题/摘要</el-divider>
        <el-input
          type="text"
          placeholder="文章标题"
          v-model="title"
          maxlength="10"
          prefix-icon="el-icon-edit"
          show-word-limit>
        </el-input>
        <el-input
          type="text"
          placeholder="文章摘要"
          v-model="summary"
          maxlength="30"
          prefix-icon="el-icon-notebook-2"
          show-word-limit>
        </el-input>
        <el-divider>文章配置</el-divider>
        <el-input
          type="text"
          placeholder="缩略图"
          v-model="thumbnail"
          prefix-icon="el-icon-picture">
          <template slot="prepend">https://</template>
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

        <el-tooltip class="item" effect="dark" content="查看编辑记录" placement="left" hide-after=1000>
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
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp">
              {{activity.content}}
            </el-timeline-item>
          </el-timeline>
        </el-drawer>

        <el-tooltip class="item" effect="dark" content="新建分类" placement="left" hide-after=1000>
          <el-button
            type="primary"
            icon="el-icon-plus"
            circle class="add-category button1"
            @click="addCategory"
            :disabled="userRole">
          </el-button>
        </el-tooltip>

        <el-dialog title="新建分类" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="分类名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="分类描述" :label-width="formLabelWidth">
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
        <el-button type="primary" @click="saveDraft">保存为草稿
          <i class="el-icon-folder-opened el-icon--right"></i>
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="primary" @click="saveCommit" :disabled="userRole">发布
          <i class="el-icon-check el-icon--right"></i>
        </el-button>

        <el-tooltip class="item" effect="dark" content="我的草稿" placement="left" hide-after=1000>
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
          <ul class="infinite-list" style="overflow:auto">
            <li v-for="(item,index) in draftList" :key="index" class="list">
              {{item.title}}/{{item.summary}}
              <button class="btn btn-danger" @click="deleteDraft(item.id)">删除</button>
              <button class="btn btn-edit" @click="loadDraft(index)">编辑</button>
            </li>
          </ul>
        </el-drawer>
      </div>
      <div class="tcommonBox">
        <div id="main">
          <mavon-editor v-model="content"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import header from '../components/header.vue'
import store from '../store'
import { postArticle,getDraft,getEditHistory } from '../api/article'
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
      isComment:'0',//是否允许评论
      id:'',//分类id
      thumbnail:'',//缩略图
      articleObj:{
        userId:'',
        content:'',
        title:'',
        summary:'',
        status:'1',
        isComment:false,
        categoryId:'',
        thumbnail:'',
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
      reverse:true,
      uploadURL:'',
      userInfo:{},//本地存储的用户信息
      userInfoObj:'',//用户的信息
      haslogin:false,//是否登录
    }
  },
  computed: {
    classListObj() {  //分类列表
      return this.$store.state.classListObj;
    },
    userRole() {  //用户角色
      const role = this.userInfoObj.userRole;
      console.log(role)
      if(role === "1") {
        return false;
      }else {
        return true;
      }
    },
  },
  methods: { //事件处理器
    routeChange() {//展示页面信息
      var that = this;
      if(localStorage.getItem('userInfo')){
        that.haslogin = true;
        that.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        that.userId = that.userInfo.id;
        getUserInfo(that.userId).then((response)=>{
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
      if(!this.id) {
        this.$message({
          type:'info',
          message:'请选择文章分类'
        })
        this.$refs.select.toggleMenu();
        return
      }
      const userInfo = localStorage.getItem('userInfo');
      if(!userInfo) {
        this.loginMessage();
      }
      const userId = JSON.parse(userInfo).id;
      postArticle(userId,this.title,this.content,this.summary,this.status,this.isComment,this.id,this.thumbnail)
        .then((response) => {
          this.$message({
            type:'success',
            message:'保存成功'
          })
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
      this.title = articleObj.title;
      this.content = articleObj.content;
      this.summary = articleObj.summary;
      this.status = articleObj.status;
      this.isComment = articleObj.isComment;
      this.id = articleObj.categoryId;
      this.thumbnail = articleObj.thumbnail;
    },
    getArticleObj() {   //获取未提交编辑
      const articleObj = JSON.parse(localStorage.getItem('articleObj'));
      this.reloadArticle(articleObj);
    },
    refreshAll() {  //重新编辑
      MessageBox.confirm('确认重新编辑文章，确认后文章和配置将不能找回', '系统提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.content = '';//Markdown文本内容
        this.title = '';//文章标题
        this.summary = '';//文章摘要
        this.status = '1';//是否发布
        this.isComment = '0';//是否允许评论
        this.classListObj = null;//分类
        this.id = '';//分类id
        this.thumbnail = '';//缩略图
        localStorage.removeItem('articleObj');
      })
    },
    getDraft() { //获取草稿列表
      const id = this.userInfo.id;
      if(!id) {
        this.loginMessage();
      }else {
        getDraft(id).then((response) =>{
          this.draftList = response;
        })
        this.drawer = true;
      }
    },
    loadDraft(index) { //加载草稿
      const articleObj = this.draftList[index];
      this.reloadArticle(articleObj);
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
        getEditHistory(id).then((response) =>{
          console.log(response)
          this.activities = response;
        })
        this.historyDrawer = true;
      }
    },
  },
  components: { //定义组件
    'wbc-nav':header,
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
  },
  created() { //生命周期函数
    this.routeChange();
    this.uploadURL = store.state.baseURL+'upload'
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

<style>
.el-drawer {
  overflow: scroll
}
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
