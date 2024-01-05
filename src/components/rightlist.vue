<!-- 右侧固定导航栏 -->
<template>
  <div class="rightlistBox">
    <section>
      <div class="r1-head">
        <img
          :src="
            this.$store.state.themeObj.center_smailimg
              ? this.$store.state.themeObj.center_smailimg
              : 'static/img/img01.jpg'
          "
          alt=""
        />
        <h1 v-if="this.$store.state.themeObj.user_start != 0">
          <p>{{username}}</p>
          <span>{{introduction}}</span>
        </h1>
      </div>
      <div class="r1-body">
        <el-row :gutter="12">
          <el-col :span="8">
            <el-card style="border: 0;" shadow="hover">
              <h1 class="count-title">总文章</h1>
              <countTo class="count-num" :startVal="0" :endVal="Number(articleTotal)" :duration="5000" />
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card style="border: 0;" shadow="hover">
              <h1 class="count-title">我发布</h1>
              <countTo class="count-num" v-show="isLogin" :startVal="0" :endVal="Number(myArticleTotal)" :duration="5000" />
              <span class="count-num" v-show="!isLogin" >- -</span>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card style="border: 0;" shadow="hover">
              <h1 class="count-title">总浏览</h1>
              <countTo class="count-num" v-show="isLogin" :startVal="0" :endVal="Number(totalView)" :duration="5000" />
              <span class="count-num" v-show="!isLogin" >- -</span>
            </el-card>
          </el-col>
        </el-row>
        <br>
        <br>
        <div class="catch-me">
          <div class="">
            <el-tooltip class="item" content="Github" placement="top">
              <a :href="catchMeObj.github" target="_blank"
                ><i class="fa fa-fw fa-github"></i
              ></a>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="QQ" placement="top">
              <a :href="catchMeObj.qq" target="_blank"
                ><i class="fa fa-fw fa-qq"></i
              ></a>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="gitee"
              placement="top"
            >
              <a :href="catchMeObj.gitee" target="_blank"
                ><i class="fa fa-fw fa-git"></i
              ></a>
            </el-tooltip>
          </div>
          <div class="">
            <el-tooltip
              class="item"
              effect="dark"
              content="微信"
              placement="top"
            >
              <a :href="catchMeObj.wechat" target="_blank"
                ><i class="fa fa-fw fa-wechat"></i
              ></a>
            </el-tooltip>
          </div>
        </div>
      </div>
    </section>
    <section class="rs4">
      <el-skeleton :rows="10" animated :loading="loading">
        <h2 class="ui label">最新发布</h2>
        <ul>
          <li v-for="(item, index) in latestArticle" :key="'latestArticle' + index">
            <a :href="'#/DetailArticle?aid=' + item.id" target="_blank">{{
                item.title
              }}</a>
            —— {{ item.createTime }}
          </li>
        </ul>
      </el-skeleton>
    </section>
    <section class="rs4">
      <el-skeleton :rows="10" animated :loading="loading">

      <h2 class="ui label">热门文章</h2>
        <ul>
          <li v-for="(item, index) in browseList" :key="'browseList' + index">
            <a :href="'#/DetailArticle?aid=' + item.id" target="_blank">{{
                item.title
              }}</a>
            —— {{ item.viewCount }} 次围观
          </li>
        </ul>
      </el-skeleton>
    </section>
    <!-- 右侧上滑小图片 -->
    <div
      v-if="this.$store.state.themeObj.user_start != 0"
      :class="gotoTop ? 'toTop hidden' : 'toTop goTop hidden'"
      @click="toTopfun"
    >
      <img
        :src="
          this.$store.state.themeObj.right_img
            ? this.$store.state.themeObj.right_img
            : 'static/img/scroll.png'
        "
        alt=""
      />
    </div>
    <div
      v-else
      :class="gotoTop ? 'toTophui hidden' : 'toTophui goTophui hidden'"
      @click="toTopfun"
    >
      <img
        :src="
          this.$store.state.themeObj.right_img
            ? this.$store.state.themeObj.right_img
            : 'static/img/scroll.png'
        "
        alt=""
      />
    </div>
  </div>
</template>


<script>
import { hotArticleList,latestArticleList,getMyArticleTotal,getTotalView } from "../api/article";
import { getToken } from '../utils/auth'
import countTo from 'vue-count-to';
import moment from 'moment';
export default {
  data() {
    //选项 / 数据
    return {
      fixDo: false,
      loveme: false,
      gotoTop: false, //返回顶部
      going: false, //是否正在执行上滑动作
      browseList: "", //热门文章 浏览量最多
      latestArticle: null, //最新文章列表
      artCommentList: "", //最新评论
      catchMeObj: {
        //个人信息
        github: "https://github.com/YiPort",
        gitee: "https://gitee.com/yiport",
        qq: "/static/img/qq.png",
        wechat: "/static/img/qq.jpg",
      },
      loading: true, //是否显示骨架屏
      isLogin: false,
      username: '游客',
      introduction: '穷则变，变则通，通则久',
      articleTotal: 0,       //总文章
      myArticleTotal: 0,     //我发布的
      totalView: 0,     //总浏览
    };
  },
  computed: {
  },
  watch: {
    browseList() {
      this.loading = false;
    }
  },
  methods: {
    //事件处理器
    toTopfun: function (e) {
      var that = this;
      this.gotoTop = false;
      this.going = true;
      var timer = setInterval(function () {
        //获取滚动条距离顶部高度
        var osTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        //返回顶部滚动速度
        var ispeed = Math.floor(-osTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop =
          osTop + ispeed;
        //到达顶部，清除定时器
        if (osTop < 850) {
          that.going = false;
          clearInterval(timer);
          timer = null;
        }
      }, 30);
    },
    async latestArticleList() {
      await latestArticleList().then((response) => {
        // console.log(this.latestArticleList)
        this.latestArticle = response;
      });
    },
    async getHotArticleList() {
      await hotArticleList().then((response) => {
        this.browseList = response;
      });
    },
  },
  components: {
    countTo
  },
  async created() {
    //生命周期函数
    let hour = Number(moment().format('HH'));
    // console.log(hour);
    if(hour < 12 && hour > 5) {
      this.introduction = '上午好';
    }else if (hour > 11 && hour < 19) {
      this.introduction = '下午好';
    }else {
      this.introduction = '晚上好';
    }
    //查询浏览量最多的10篇文章数据
    this.latestArticleList();
    this.getHotArticleList();
    this.articleTotal = Number(window.localStorage.getItem('articleTotal'));
    const userInfo = window.localStorage.getItem('userInfo');
    // console.log(userInfo)
    if(getToken()) {
      this.username = JSON.parse(userInfo).username;
      await getMyArticleTotal().then(response => {     //获取我发布的文章总数
        // console.log(response);
        this.isLogin = true;
        this.myArticleTotal = response.myArticleTotal;
      })
      await getTotalView().then(response => {       // 获取我发布的文章总浏览量
        // console.log(response);
        this.totalView = response.totalView;
      })
    }
    var that = this;
    window.onscroll = function () {
      var t = document.documentElement.scrollTop || document.body.scrollTop;
      if (!that.going) {
        //距离顶部超过1600px显示返回顶部图片
        if (t > 1600) {
          that.gotoTop = true;
        } else {
          that.gotoTop = false;
        }
      }
      if (t > 1200) {
        that.fixDo = true;
      } else {
        that.fixDo = false;
      }
    };
  },
};
</script>

<style lang="less">
.is-selected {
  color: #1989FA;
}
.count-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #42bcef;
  margin-bottom: 10px
}
.count-num {
  font-size: 1.3em;
  font-weight: bold;
}
.el-card__body {
  cursor: pointer;
  text-align: center;
}
.rightlistBox {
  position: relative;
}
.rightlistBox section {
  transition: all 0.2s linear;
  position: relative;
  background: #fff;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}
.rightlistBox section:hover {
  transform: translate(0, -2px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}
.rightlistBox .r1-head {
  text-align: center;
  border-radius: 4px 4px 0 0;
  text-align: center;
  position: relative;
  /*box-shadow: inset 0 -70px 100px -50px rgba(0,0,0,.5);*/
}
.rightlistBox .r1-head img {
  width: 100%;
  min-height: 100px;
}
.rightlistBox .r1-head h1 {
  position: absolute;
  bottom: 5px;
  margin: 0 0 0 -65px;
  font-size: 20px;
  letter-spacing: 0.5px;
  color: #fff;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.7);
  font-weight: 700;
  width: 130px;
  left: 50%;
}
.rightlistBox .r1-head h1 span{
  opacity: 0.9;
  text-shadow: 6px 3px 10px #c0ab95;
}
.rightlistBox .r1-head h1 p{
  opacity: 0.9;
  text-shadow: 6px 3px 10px #c0ab95;
}
.rightlistBox .r1-body p {
  font-size: 19px;
  margin: 5px 0 8px 0;
  font-weight: 700;
  text-align: center;
}
.rightlistBox .r1-body .catch-me {
  text-align: center;
}
.rightlistBox .r1-body .catch-me a {
  display: inline-block;
  margin-bottom: 7px;
  position: relative;
  text-decoration: none;
}
.rightlistBox .r1-body .catch-me a:hover i {
  color: #fff;
  background: #f4692c;
}
.rightlistBox .r1-body .catch-me a i {
  display: inline-block;
  font-size: 18px;
  width: 42px;
  height: 42px;
  line-height: 42px;
  border-radius: 42px;
  color: rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  font-style: normal;
  margin: 0 3.2px;
}

/*************do you like me*******************/
.rightlistBox .rs2 {
  /*padding:10px 0 4px 0;*/
  min-height: 100px;
}
.rightlistBox .rs2.fixed {
  position: fixed;
  top: 40px;
  width: 22%;
}
.rightlistBox .rs2 p {
  color: #df2050;
  cursor: pointer;
  font-size: 20px;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  margin-top: 10px;
  font-weight: 500;
}
.rightlistBox .rs2 div {
  color: #df2050;
  cursor: pointer;
  text-align: center;
  font-size: 40px;
  position: absolute;
  width: 100%;
  height: 100px;
  line-height: 100px;
  left: 0;
  top: 30px;
}
.rightlistBox .rs2 div i.heart {
  display: inline-block;
  text-align: center;
  width: 100px;
  height: 100px;
  margin-left: -20px;
  margin-top: -5px;
  background: url(../../static/img/heart.png) no-repeat;
  background-position: 0 0;
  cursor: pointer;
  -webkit-transition: background-position 1s steps(28);
  transition: background-position 1s steps(28);
  -webkit-transition-duration: 0s;
  transition-duration: 0s;
  vertical-align: middle;
}
.rightlistBox .rs2 div i.heart:hover {
  transform: scale(1.15);
  -webkit-transform: scale(1.15);
}
.rightlistBox .rs2 div i.heart.active {
  -webkit-transition-duration: 1s;
  transition-duration: 1s;
  background-position: -2800px 0;
}
.rightlistBox .rs2 div span {
  margin-left: -30px;
}
/**********排队来说*************/
.rightlistBox .rs3 .rs3-item {
  font-size: 13px;
  line-height: 20px;
}
.rightlistBox .rs3 .rs3-item a {
  display: block;
  padding: 5px;
  transition: all 0.3s ease-out;
  border-bottom: 1px solid #ddd;
  margin: 5px 0;
}
.rightlistBox .rs3 .rs3-item a:hover {
  background: rgba(230, 244, 250, 0.5);
  border-radius: 5px;
}
.rightlistBox .rs3 .rs3-photo {
  float: left;
}
.rightlistBox .rs3 .rs3-photo img {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  object-fit: cover;
}
.rightlistBox .rs3 .rs3-inner {
  margin-left: 40px;
}
.rightlistBox .rs3 .rs3-inner .rs3-author {
  font-weight: 700;
}
.rightlistBox .rs3 .rs3-inner .rs3-text {
  font-size: 12px;
  text-align: justify;
}
.rightlistBox .rs3 .rs3-item:last-child a {
  border-bottom: none;
}
/************排队看这些***************/
.rightlistBox .rs4 li {
  padding: 8px 0;
  text-align: justify;
}
.rightlistBox .rs4 li a {
  font-weight: 600;
}
.rightlistBox .rs4 li a:hover {
  color: #64609e;
}

/*回到顶部*/
/*返回到顶部*/
.toTop {
  position: fixed;
  right: 40px;
  top: -150px;
  z-index: 99;
  width: 70px;
  height: 900px;
  transition: all 0.5s 0.3s ease-in-out;
  cursor: pointer;
}
.goTop {
  top: -950px;
}
.toTop img,
.toTophui img {
  width: 100%;
  height: auto;
}
.toTophui {
  position: fixed;
  right: 10px;
  bottom: 80px;
  z-index: 99;
  width: 120px;
  height: 120px;
  transition: all 0.5s 0.3s ease-in-out;
  cursor: pointer;
  animation: toflow 2s ease-in-out infinite;
}
@keyframes toflow {
  0% {
    /*top:400px;*/
    transform: scale(0.95) translate(0, 10px);
  }
  50% {
    /*top:410px;*/
    transform: scale(1) translate(0, 0px);
  }
  100% {
    /*top:400px;*/
    transform: scale(0.95) translate(0, 10px);
  }
}
.goTophui {
  bottom: 120vh;
}
</style>
