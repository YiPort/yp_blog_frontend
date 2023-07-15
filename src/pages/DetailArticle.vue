<!-- 文章详情 -->
<template>
  <div>
      <sg-nav></sg-nav>
      <el-button class="directoryClass" type="primary" :icon="icon" @click="getDirectory"></el-button>
      <el-tree
          :data="toc"
          :props="defaultProps"
          highlight-current
          :indent="20"
          @node-click="scrollToPosition"
          ref="menuTree"
          class="tree"
          v-show="showDirectory">
      </el-tree>
      <div  class="container" id="detail">
          <el-tooltip class="item" effect="dark" content="收藏" placement="left" hide-after=1000>
              <el-button
              type="primary" 
              icon="el-icon-star-off"
              circle class="collect button1"
              @click="addCollect()">
              </el-button>
          </el-tooltip>
          <el-dialog title="提交错误" :visible.sync="dialogFormVisible">
          <el-form :model="form">
              <el-form-item label="错误描述" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="form.description"></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="postQuestion">确 定</el-button>
          </div>
          </el-dialog>
          <el-row  :gutter="30">
              <el-col :sm="24" :md="16" style="transition:all .5s ease-out;margin-bottom:30px;">
                  <sg-articleDetail></sg-articleDetail>
                  <sg-message></sg-message>
              </el-col>
              <el-col :sm="24"  :md="8" >
                  <sg-rightlist></sg-rightlist>
              </el-col>
          </el-row>
          <el-tooltip class="item" effect="dark" content="有错误？" placement="left" hide-after=1000>
              <el-button
              type="danger" 
              icon="el-icon-question" 
              circle class="question button1"
              @click="submitQuestion">
              </el-button>
          </el-tooltip>
      </div>
  </div>
</template>

<script>
import header from '../components/header.vue'
import rightlist from '../components/rightlist.vue'
import articleDetail from '../components/articleDetail.vue'
import message from '../components/message.vue'
import { MessageBox } from 'element-ui'
import { addCollection,postQuestion } from '../api/article'
import router from '../router/index'
import { getUserInfo } from '../api/user'
import $ from 'jquery'
  export default {
      name:'DetailShare',
      data() { //选项 / 数据
          return {
              userInfo: {}, //用户信息
              articleId: '',
              userInfoObj: '',
              uploadURL: '',
              dialogFormVisible: false,   //是否显示提交弹窗
              form: {
                  description: '' //错误描述
              },
              toc: [],
              defaultProps: {
                children: 'children',
                label: 'name'
              },
              catalogue: [],
              showDirectory: false,
              icon: 'el-icon-d-arrow-left',
          }
      },
      watch: {
          // 如果路由有变化，会再次执行该方法
          '$route':'routeChange',
      },
      methods: { //事件处理器
          routeChange() {//展示页面信息
              var that = this;
              that.articleId = that.$route.query.aid==undefined?1:parseInt(that.$route.query.aid);//获取传参的aid
              if(localStorage.getItem('userInfo')){
                  that.userInfo = JSON.parse(localStorage.getItem('userInfo'));
                  that.userId = that.userInfo.id;
                  getUserInfo(that.userId).then((response)=>{
                      that.userInfoObj = response;
                      that.userInfoObj.head_start = 0;
                  })
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
          addCollect() {  //收藏
              const id = this.userInfo.id;
              if(!id) {
                  this.loginMessage();
              }else {
                  addCollection(id, this.articleId).then(response => {
                      this.$message({
                          type:'success',
                          message:'收藏成功'
                      })
                  })
              }
          },
          submitQuestion() {  //打开问题提交弹窗
              const id = this.userInfo.id;
              if(!id) {
                  this.loginMessage();
              }else {
                  this.dialogFormVisible = true
              }
          },
          postQuestion() {    //提交文章问题
              if(this.form.description.length > 150) {
                  this.$message({
                      type:'error',
                      message:'问题描述不得超过150字'
                  })
              }else{
                  postQuestion(this.articleId,this.userInfo.id,this.form.description).then(response => {
                  this.$message({
                      type:'success',
                      message:'反馈成功'
                  })
              })
              }
          },
          tocAndCli() {
            this.$nextTick(() => {
              const aArr1 = $(
                  "#article1 a"
              ).toArray();
              let aArr = []

              aArr1.forEach(item => {
                if (item.id) {
                  aArr.push(item)
                }
              })
              //给数据赋值，保存元素的id和其距顶部的距离
              this.tocAndDist(aArr)
              console.log("aArr",aArr)

              let toc = [];
              aArr.forEach((item, index) => {
                let href = $(item).attr("id");
                let name = $(item).parent().text();
                let prop = $(item).parent().prop('nodeName');
                let children = this.getChildren(aArr, item, index)
                if (href && (prop === 'H2' || prop === 'H3')) { // 这里判断是因为我们只需要有id的内容，没有id的则过滤掉。
                  toc.push({
                    id: href.substring(href.lastIndexOf("_") + 1),
                    href: "#" + href,
                    name,
                    prop,
                    children
                  });
                  // this.catalog = true
                  console.log("toc",toc)
                }
              });
              this.toc = toc
            });
          },
          tocAndDist(arr) {
            arr.forEach(item => {
              if ($(item).attr("id")) {
                let id = item.id.substring(item.id.lastIndexOf("_") + 1)
                let dist = $('#' + item.id).offset().top;

                this.catalogue.push({id, dist})
              }

            })
          },
          getChildren(aArr, item, index) {
            let out = []
            if (index === aArr.length - 1) {
              return []
            }
            let nodeName = $(aArr[index]).parent().prop('nodeName')
            let level = parseInt(nodeName.substring(1, 2).charAt(0))

            if ($(aArr[index + 1]).parent().prop('nodeName') === nodeName) {
              return []
            }
            for (let i = index + 1; i < aArr.length; i++) {
              let name = $(aArr[i]).parent().prop('nodeName')
              if (level + 1 === parseInt(name.substring(1, 2))) {
                //构建孩子
                let href = $(aArr[i]).attr("id");
                let name = $(aArr[i]).parent().text();
                let children = this.getChildren(aArr, aArr[i], i)
                out.push({
                  //lastIndexOf是因为有些标签有多个_，取最后为id
                  id: href.substring(href.lastIndexOf("_") + 1),
                  href: "#" + href,
                  name,
                  children
                })
              } else if (level < parseInt(name.substring(1, 2)) - 1) {
                continue
              } else {
                break
              }
            }
            return out
          },
          scrollToPosition(data) {
              let id = data.href
              console.log("id",id)
              const position = $(id).offset();
              position.top = position.top - 35
              $("html,body").animate({ scrollTop: position.top }, 500);
          },
          getDirectory() {
              if(this.showDirectory) {
                  this.showDirectory = false;
                  this.icon = 'el-icon-d-arrow-left';
              }else {
                  this.showDirectory = true;
                  this.icon = 'el-icon-d-arrow-right';
                  this.tocAndCli();
              }
          }
      },
      components: { //定义组件
          'sg-nav':header,
          'sg-articleDetail':articleDetail,
          'sg-message':message,
          'sg-rightlist':rightlist,
      },
      created() { //生命周期函数
          this.routeChange();
          this.uploadURL = this.$store.state.baseURL+'upload'
      },
      mounted(){
          /* var anchor = document.querySelector("#detail");
          // console.log(anchor,anchor.offsetTop);
          var top = anchor.offsetTop-60;
          document.body.scrollTop = top;
          // Firefox
          document.documentElement.scrollTop = top;
          // Safari
          window.pageYOffset = top; */
      }
  }
</script>

<style>
.directoryClass{
  position: fixed;
  bottom: 107px;
right: 100px;
  box-shadow: #333;
  z-index:9999;
}
.tree{
  position: fixed;
  top: 100px;
right: 10%;
  box-shadow: #333;
  width: 385px;
  z-index:9999;
  -webkit-border-radius: 7px;
  -moz-border-radius: 7px;
  border-radius: 7px;
}
.collect{
  position: fixed;
  bottom: 107px;
left: 80px;
  box-shadow: #333;
  z-index:9999;
}
.question{
  position: fixed;
  bottom: 60px;
left: 80px;
  box-shadow: #333;
  z-index:9999;
}
.button1 {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
}
</style>
