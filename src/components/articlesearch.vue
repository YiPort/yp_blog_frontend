<!-- 文章列表 -->
<template>
  <el-row class="sharelistBox">
    <el-col :span="24" class="s-item tcommonBox" v-for="(item,index) in articleList" :key="'article'+index">
      <el-skeleton animated :loading="loading">
        <template slot="template">
          <div style="padding: 14px;">
            <el-skeleton-item variant="h1" style="width: 30%;margin: 0 33% 10px" />
            <el-skeleton-item variant="text" style="width: 45%;margin: 0 25% 50px" />
            <el-skeleton-item variant="h2" style="width: 30%;" />
            <el-skeleton-item variant="image" style="width: 100%; height: 240px;" />
          </div>
        </template>
        <template>
                <span class="s-round-date">
                    <span class="month" v-html="showInitDate(item.createTime,'month')+'月'"></span>
                    <span class="day" v-html="showInitDate(item.createTime,'date')"></span>
                </span>
          <header>
            <h1>
              <a :href="'#/DetailArticle?aid='+item.id"  target="_blank" v-html="item.title"></a>

            </h1>
            <h2>
              <i class="fa fa-fw fa-user"></i>发表于
              <i class="fa fa-fw fa-clock-o"></i><span v-html="showInitDate(item.createTime,'all')">{{showInitDate(item.createTime,'all')}}</span> •
              <i class="fa fa-fw fa-eye"></i>{{item.viewCount}} 次浏览 •

            </h2>
            <div class="ui label">
              <a :href="'#/Search?='+item.searchKey">{{item.categoryName}}</a>
            </div>
          </header>
          <div class="article-content">
            <p v-html="item.summary" style="text-indent:2em;">
<!--              {{item.summary}}-->
            </p>
            <p  style="max-height:300px;overflow:hidden;text-align:center;">
              <img :src="item.thumbnail" alt="" class="maxW">
            </p>
          </div>
          <div class="viewdetail">
            <a class="tcolors-bg" :href="'#/DetailArticle?aid='+item.id" target="_blank">
              阅读全文>>
            </a>
          </div>
        </template>
      </el-skeleton>

    </el-col>
    <el-col class="viewmore">
      <a v-show="hasMore" class="tcolors-bg" href="javascript:void(0);" @click="addMoreFun">点击加载更多</a>
      <a v-show="!hasMore" class="tcolors-bg" href="javascript:void(0);">暂无更多数据</a>
    </el-col>
  </el-row>
</template>

<script>
import {initDate} from '../utils/server.js'
import {searchArticle} from "../api/search";
export default {
  name:'Share',
  data() { //选项 / 数据
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        searchKey: ''
      },
      articleList:[],
      hasMore:true,
      loading: true,  //是否显示骨架屏
      timeout: null,
    }
  },

  methods: { //事件处理器
    showInitDate: function(oldDate,full){
      return initDate(oldDate,full)
    },
    getList(){
      searchArticle(this.queryParams).then((response)=>{
        if(parseInt(response.total) === 0) {
          this.$message({
            type:'info',
            message:'该关键字暂时没有搜索到文章'
          })
        }
        if(this.queryParams.searchKey !== '') {
          window.localStorage.setItem('articleTotal', parseInt(response.total));
        }
        this.articleList = this.articleList.concat(response.rows)
        if(parseInt(response.total)<=this.articleList.length){
          this.hasMore=false
        }else{
          this.hasMore=true
          this.queryParams.pageNum++
        }
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.loading = false;
        }, 700);
      })
    },
    showSearchShowList:function(initData){//展示数据
      if(initData){
        this.articleList = []

      }
      this.getList()
    },
    addMoreFun:function(){//查看更多
      this.showSearchShowList(false);
    },
    routeChange:function(){
      var that = this;
      this.queryParams.searchKey = (that.$route.query.searchKey === undefined ? '' : that.$route.query.searchKey);//获取传参的searchKey
      this.showSearchShowList(true);
    }
  },
  components: { //定义组件

  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route':'routeChange',
    '$store.state.keywords':'routeChange'
  },
  created() { //生命周期函数
    // console.log(this.$route);
    var that = this;
    that.routeChange();
  }
}
</script>

<style>
/*分享标题*/
.shareTitle{
  margin-bottom: 40px;
  position: relative;
  border-radius: 5px;
  background: #fff;
  padding:15px;
}
.shareclassTwo{
  width:100%;
}
.shareclassTwo li{
  display: inline-block;
}
.shareclassTwo li a{
  display: inline-block;
  padding:3px 7px;
  margin:5px 10px;
  color:#fff;
  border-radius: 4px;
  background: #64609E;
  border: 1px solid #64609E;
  transition: transform 0.2s linear;
  -webkit-transition: transform 0.2s linear;
}
.shareclassTwo li a:hover{
  transform: translate(0,-3px);
  -webkit-transform: translate(0,-3px);
}
.shareclassTwo li a.active{
  background: #fff;
  color:#64609E;

}
/*文章列表*/
.sharelistBox{
  transition: all 0.5s ease-out;
  font-size: 15px;
}


/*.sharelistBox .viewmore a:hover,.s-item .viewdetail a:hover{
    background: #48456C;
}*/
</style>
