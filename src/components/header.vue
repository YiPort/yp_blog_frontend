<!-- 头部公用 -->
<template>
	<div class="">
		<div class="headBack">
			<el-row class="container">
				<el-col :span="24">
					<!-- pc端导航 -->
					<div class="headBox">
						<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" :router="true">
							<el-menu-item index="/Home"><i class="fa fa-wa fa-home"></i> 首页</el-menu-item>
							<el-submenu index="/Share">
								<template slot="title"><i class="fa fa-wa fa-archive"></i> 分类</template>
								<el-menu-item v-for="(item,index) in classListObj" :key="'class1'+index" :index="'/Share?classId='+item.id">{{item.name}}</el-menu-item>
							</el-submenu>
							<!-- <el-menu-item index="/Reward"><i class="fa fa-wa fa-cny"></i> 赞赏</el-menu-item> -->
							<el-menu-item index="/Friendslink"><i class="fa fa-wa fa-users"></i>友链</el-menu-item>
							<el-menu-item style="margin-right: 15px" index="/Write"><i class="fa fa-wa fa-users"></i>写博客</el-menu-item>
							<el-autocomplete
							v-model="inputState"
							:fetch-suggestions="querySearchAsync"
							placeholder="搜索标题|侧边按钮搜索内容"
							@focus="getArticleIndex"
							@select="handleSelectTitle">
								<i slot="prefix" class="el-input__icon el-icon-search"></i>
							</el-autocomplete>
								<div class="userInfo">
								<div v-show="!haslogin" class="nologin">
									<a href="javascript:void(0);" @click="logoinFun(1)">登录&nbsp;</a><!--|<a href="javascript:void(0);" @click="logoinFun(0)">&nbsp;注册</a>-->
								</div>
								<div v-show="haslogin" class="haslogin avatarClass">
									<el-dropdown @command="commandHandle">
									<div>
										<el-avatar size="small" :src="getAvatar"></el-avatar>
									</div>
									<el-dropdown-menu slot="dropdown">
										<a href="#/UserInfo">
											<el-dropdown-item icon="el-icon-user">个人中心</el-dropdown-item>
										</a>
										<el-dropdown-item divided icon="el-icon-switch-button" command="userlogout">退出登录</el-dropdown-item>
									</el-dropdown-menu>
									</el-dropdown>
									<!-- <a href="#/UserInfo">个人中心</a> -->
									<!-- <el-divider direction="vertical"></el-divider>
									<a href="javascript:void(0);" @click="userlogout">退出登录</a> -->
									<!--<i class="fa fa-fw fa-user-circle userImg"></i>
									<ul class="haslogin-info">
										<li>
											<a href="#/UserInfo">个人中心</a>
										</li>
										<li>
											<a href="javascript:void(0);" @click="userlogout">退出登录</a>
										</li>
									</ul>-->
								</div>
							</div>

              <div  class="searchArticle" >
                <el-button v-model="searchKey" type="info" icon="el-icon-search"  size="mini" circle @click="searchArticle"></el-button>
              </div>

						</el-menu>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="headImgBox" :style="{backgroundImage:this.$store.state.themeObj.top_image?'url('+this.$store.state.themeObj.top_image+')':'url(static/img/dongtu01.gif)'}">
			<div class="scene">
				<div><span id="luke"></span></div>
			</div>
			<div class="h-information">

						<img :src="this.$store.state.themeObj.head_portrait?this.$store.state.themeObj.head_portrait:'static/img/tou.png'" alt="">

				<h2 class="h-description">

							{{this.$store.state.themeObj.autograph?this.$store.state.themeObj.autograph:"三更灯火五更鸡，正是男儿读书时"}}

					</h2>
			</div>
		</div>
	</div>
	</template>
	<script>
	import {logout} from '../api/user'
	import {removeToken} from '../utils/auth'
	import {getCategoryList} from '../api/category'
	import { Typeit } from '../utils/plug.js'
	import router from '@/router'
  import {getArticleIndex,searchArticle} from '../api/search'

	export default {
		data() { //选项 / 数据
			return {
				userInfo: '', //用户信息
				haslogin: false, //是否已登录
        searchKey: '',//文章搜索关键字
				activeIndex: '/', //当前选择的路由模块
				// state: '', //icon点击状态
				pMenu: true, //手机端菜单打开
				// path:'',//当前打开页面的路径
				input: '', //input输入内容
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          searchKey: ''
        },
				headBg: 'url(static/img/dongtu01.gif)', //头部背景图
				headTou: '', //头像
				projectList: '', //项目列表
				allTitle: [],
				timeout:  null,
				inputState: '',
				inputStateOld: ''
			}
		},

		computed: {
			classListObj() { //分类
				return this.$store.state.classListObj;
			},
			getAvatar() {
				if(!this.userInfo.avatar) {
					return 'static/img/tou.jpg';
				}else {
					return this.userInfo.avatar;
				}
			}
		},
		methods: { //事件处理器
			handleOpen(key, keyPath) { //分组菜单打开
				// console.log(key, keyPath);
			},
			handleClose(key, keyPath) { //分组菜单关闭
				// console.log(key, keyPath);
			},
			searchChangeFun(e) { //input change 事件
				// console.log(e)
				if (this.input == '') {
					this.$store.state.keywords = '';
					this.$router.push({path:'/'});
				}
			},
			getCategoryList(){
				getCategoryList().then((response)=>{
					this.$store.commit('getCategoryList',response)
				})
			},
			handleSelect(key, keyPath) { //pc菜单选择
				//    console.log(key, keyPath);
			},
			logoinFun: function(msg) { //用户登录和注册跳转
				// console.log(msg);
				localStorage.setItem('logUrl', this.$route.fullPath);
				// console.log(666,this.$router.currentRoute.fullPath);
				if (msg == 1) {
					this.$router.push({
						path: '/Login?login=1'
					});
				} /* else {
					this.$router.push({
						path: '/Login?login=0'
					});
				} */
			},
			// 用户退出登录
			userlogout: function() {
				var that = this;
				this.$confirm('是否确认退出?', '退出提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// console.log(that.$route.path);

					logout().then((response)=>{
						// 清除 Token
						removeToken()
						// 清除 userInfo
						localStorage.removeItem('userInfo');
						that.haslogin = false;
						that.$message({
							type: 'success',
							message: '退出成功!'
						});
						if (that.$route.path === '/UserInfo') {
							console.log(that.$route.path)
							that.$router.push({
								path: '/Home'
							});
						}
					})
				})
			},
      searchArticle() {
        this.$prompt('请输入搜索的关键字', '搜索文章', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S+/,
          inputErrorMessage: '关键字不能为空'
        }).then(({ value }) => {
          // this.$message({
          //   type: 'success',
          //   message: '内容是: ' + value
          // });
          this.queryParams.searchKey= value===undefined?'':value
          searchArticle(this.queryParams).then((response)=>{
            this.$store.commit('searchArticle',response)
          })
          this.$router.push({ path:'Search',query:{ searchKey: this.queryParams.searchKey}})
        })
        //   .catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '取消搜索文章内容'
        //   });
        // })
        ;
      },
			routeChange: function() {
				var that = this;
				that.pMenu = true
				this.activeIndex = this.$route.path == '/' ? '/Home' : this.$route.path;
				if (localStorage.getItem('userInfo')) { //存储用户信息
					that.haslogin = true;
					that.userInfo = JSON.parse(localStorage.getItem('userInfo'));
					// console.log(that.userInfo);
				} else {
					that.haslogin = false;
				}
				//获取分类
				// this.getCategoryList()

				if (( this.$route.name == "Share" || this.$route.name == "Home") && this.$store.state.keywords) {
					this.input = this.$store.state.keywords;
				} else {
					this.input = '';
					this.$store.state.keywords = '';
				}
			},
			commandHandle(command) {	//退出登录
				if(command === 'userlogout') {
					this.userlogout();
				}
			},
			getArticleIndex() {	//获取文章索引数据
				getArticleIndex().then(response => {
					//为这个数组中每一个对象加一个value字段, autocomplete只识别value字段并在下拉列中显示
					/* for(let i of response){
						i.value = i.title;  //将想要展示的数据作为value
					} */
					this.allTitle = response;
				})
			},
			querySearchAsync(queryString, cb) {	//输入数据queryString,返回建议数据通过cb返回数据
				var allTitle = this.allTitle;
				var results = queryString ? allTitle.filter(this.createStateFilter(queryString)) : allTitle;
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					cb(results);
				}, 500);
			},
			createStateFilter(queryString) {	//过滤
				return (state) => {
					return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
				};
			},
			handleSelectTitle(item) {	//处理选中菜单
				this.inputState = this.inputStateOld;	//保持搜索框不变
				const articleId = item.articleId;
				router.push({
					path: '/DetailArticle?aid=' + articleId
				});
				if(item.indexPosition) {		//如果是二级标题则定位到标题位置
					let position = item.indexPosition;
					$("html,body").animate({ scrollTop: position - 35 }, 500);
				}
			},
		},
		components: { //定义组件

		},
		watch: {
			// 如果路由有变化，会再次执行该方法
			'$route': 'routeChange',
			inputState(newValue) {	//保持搜索框不变
				this.inputStateOld = newValue;
			}
		},
		created() { //生命周期函数
			//判断当前页面是否被隐藏
			var that = this;
			var hiddenProperty = 'hidden' in document ? 'hidden' :
				'webkitHidden' in document ? 'webkitHidden' :
				'mozHidden' in document ? 'mozHidden' :
				null;
			var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
			var onVisibilityChange = function() {
				if (!document[hiddenProperty]) { //被隐藏
					if (that.$route.path != '/DetailShare') {
						if (localStorage.getItem('userInfo')) {
							that.haslogin = true;
						} else {
							that.haslogin = false;
						}
					}
				}
			}
			document.addEventListener(visibilityChangeEvent, onVisibilityChange);
			// console.log();
			this.routeChange();


		},
		mounted() { //页面元素加载完成
			var that = this;
			this.getCategoryList()
			var timer = setTimeout(function() {
				Typeit(that.$store.state.themeObj.user_start, "#luke"); //打字机效果
				clearTimeout(timer);
			}, 500);
		}
	}
	</script>

	<style>
	/* 搜索框列表样式 */
	.el-autocomplete-suggestion li {
		letter-spacing: 0.5px;
		color: black;
	}
	/* 头像 */
	.avatarClass{
		margin-top: 5px;
		margin-right: -60px;
	}
	/*********头部导航栏********/

	/*头部导航栏盒子*/

	.headBack {
		width: 100%;
		/* background: rgba(40, 42, 44, 0.6); */
		background: rgb(93 93 93 / 44%);
		backdrop-filter: saturate(50%) blur(8px);
		/*margin-bottom:30px;*/
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		z-index: 100;
	}

	.headBox li.is-active {
		/*background: #48456C;*/
		background: rgba(73, 69, 107, 0.7);
	}
	.headBox li:hover {
		/*background: #48456C;*/
		background: rgba(73, 69, 107, 0.7);
	}

	.el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
		border-bottom: none!important;
	}

	.headBox .el-menu {
		background: transparent;
		border-bottom: none!important;
	}

	.headBox .el-menu-demo li.el-menu-item,
	.headBox .el-menu--horizontal .el-submenu .el-submenu__title {
		height: 38px;
		line-height: 38px;
		border-bottom: none!important;

	}

	.headBox .el-submenu li.el-menu-item {
		height: 38px;
		line-height: 38px;
	}

	.headBox li .fa-wa {
		vertical-align: baseline;
	}

	.headBox ul li.el-menu-item,
	.headBox ul li.el-menu-item.is-active,
	.headBox ul li.el-menu-item:hover,
	.headBox .el-submenu div.el-submenu__title,
	.headBox .el-submenu__title i.el-submenu__icon-arrow {
		color: #fff;
	}

	.headBox .el-menu--horizontal .el-submenu>.el-menu {
		top: 38px;
		border: none;
		padding: 0;
	}

	.headBox>ul li.el-menu-item:hover,
	.headBox>ul li.el-submenu:hover .el-submenu__title {
		background: #48456C;
		border-bottom: none;
	}

	.headBox>ul .el-submenu .el-menu,
	.headBox>ul .el-submenu .el-menu .el-menu-item {
		background: #48456C;
	}

	.headBox>ul .el-submenu .el-menu .el-menu-item {
		min-width: 0;
	}

	.headBox>ul .el-submenu .el-menu .el-menu-item:hover {
		background: #64609E;
	}

	/*pc搜索框*/

	.headBox .pcsearchbox {
		padding: 0;
		max-width: 170px;
		/*min-width: 30px;*/
		height: 100%;
		line-height: 38px;
		position: absolute;
		top: 0;
		right: 0;
		cursor: pointer;
	}

	.headBox .pcsearchbox:hover .pcsearchinput {
		opacity: 1;
		/*transform: scaleX(1);*/
		visibility: visible;
	}

	.headBox .pcsearchbox i.pcsearchicon {
		color: #fff;
		padding-left: 10px;
	}

	.headBox .pcsearchbox .pcsearchinput {
		width: 180px;
		padding: 10px 20px 10px 20px;
		background: rgba(40, 42, 44, 0.6);
		border-radius: 0 0 2px 2px;
		position: absolute;
		right: 0;
		top: 38px;
		opacity: 0;
		visibility: hidden;
		/*transform: scaleX(0);*/
		transform-origin: right;
		transition: all 0.3s ease-out;
	}

	.headBox .pcsearchbox .hasSearched {
		opacity: 1;
		/*transform: scaleX(1);*/
		visibility: visible;
	}

	.headBox .pcsearchbox .el-input {
		width: 100%;
	}
	/* 搜索框 */
	.headBox .el-input__inner {
		height: 30px;
		border: none;
		background: rgba(40, 42, 44, 0.178);
		border: 2px solid #ffffff;
		border-radius: 15px;
		padding-right: 10px;
		margin-top: 4px;
		color: white;
	}

	.headBox .el-input__inner:focus {
		height: 30px;
		width: 270%;
		border: none;
		background: rgba(40, 42, 44, 0.178);
		border: 2px solid #409eff;
		border-radius: 15px;
		padding-right: 10px;
		margin: 4px;
	}

	.headBox .el-input__inner:hover {
		height: 30px;
		width: 270%;
		border: none;
		background: rgba(40, 42, 44, 0.178);
		border: 2px solid #409eff;
		border-radius: 15px;
		padding-right: 10px;
		margin: 4px;
	}

	.headBox .userInfo {
		height: 100%;
		line-height: 38px;
		position: absolute;
		right: 30px;
		top: 0;
		color: #fff;
	}


  .headBox .searchArticle {
    height: 100%;
    line-height: 38px;
    position: absolute;
    right: 1px;
    top: 0;
    color: #fff;
  }


  .headBox .searchArticle {
    height: 100%;
    line-height: 38px;
    position: absolute;
    right: 1px;
    top: 0;
    color: #fff;
  }

	.headBox .userInfo a {
		color: #fff;
		font-size: 13px;
		transition: all 0.2s ease-out;
	}

	.headBox .userInfo a:hover {
		color: #48456C;
	}

	.headBox .nologin {
		text-align: right;
	}

	.headBox .haslogin {
		text-align: right;
		position: relative;
		min-width: 80px;
		cursor: pointer;
	}

	.headBox .haslogin:hover ul {
		visibility: visible;
		opacity: 1;
	}

	.headBox .haslogin ul {
		background: rgba(40, 42, 44, 0.6);
		padding: 5px 10px;
		position: absolute;
		right: 0;
		visibility: hidden;
		opacity: 0;
		transition: all 0.3s ease-out;
	}

	.headBox .haslogin ul li {
		border-bottom: 1px solid #48456C;
	}

	.headBox .haslogin ul li:last-child {
		border-bottom: 1px solid transparent;
	}

	/*******移动端*******/

	.mobileBox {
		position: relative;
		height: 38px;
		line-height: 38px;
		color: #fff;
	}

	.hideMenu {
		position: relative;
		width: 100%;
		height: 100%;
		line-height: 38px;
	}

	.hideMenu ul.mlistmenu {
		width: 100%;
		position: absolute;
		left: 0;
		top: 100%;
		box-sizing: border-box;
		z-index: 999;
		box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .12), 0 0 8px 0 rgba(0, 0, 0, .04);
		background: #48456C;
		color: #fff;
		border-right: none;
	}

	.hideMenu .el-submenu .el-menu {
		background: #64609E;
	}

	.hideMenu .el-menu-item,
	.hideMenu .el-submenu__title {
		color: #fff;
	}

	.hideMenu>i {
		position: absolute;
		left: 10px;
		top: 12px;
		width: 30px;
		height: 30px;
		font-size: 16px;
		color: #fff;
		cursor: pointer;
	}

	.hideMenu .el-menu-item,
	.el-submenu__title {
		height: 40px;
		line-height: 40px;
	}

	.mobileBox .searchBox {
		padding-left: 40px;
		width: 100%;
		box-sizing: border-box;
	}

	.mobileBox .searchBox .el-input__inner {
		display: block;
		border-radius: 2px;
		border: none;
		height: 25px;
	}

	.hideMenu ul.mlistmenu.pshow {
		display: block;
	}

	.hideMenu ul.mlistmenu .el-submenu__icon-arrow,
	.mobileBox li.el-menu-item a {
		color: #fff;
	}

	.hideMenu>ul li.el-menu-item:hover,
	.hideMenu>ul li.el-menu-item.is-active {
		background: #48576a;
	}



	/*头部背景图*/

	.headImgBox {
		height: 650px;
		position: relative;
		width: 100%;
		background-size: cover;
		background-position: center 50%;
		background-repeat: no-repeat;
		margin-bottom: 90px;
	}

	.h-information {
		text-align: center;
		width: 70%;
		margin: auto;
		position: relative;
		top: 480px;
		padding: 40px 0;
		font-size: 16px;
		opacity: 0.98;
		background: rgba(230, 244, 249, 0.8);
		border-radius: 5px;
		z-index: 1;
		animation: b 1s ease-out;
		-webkit-animation: b 1s ease-out;
	}

	@-webkit-keyframes b {
		0% {
			-webkit-transform: translateY(90px);
			transform: translateY(90px);
		}
		80% {
			-webkit-transform: translateY(5px);
			transform: translateY(5px)
		}
		90% {
			-webkit-transform: translateY(-5px);
			transform: translateY(-5px)
		}
		to {
			-webkit-transform: translateY(0);
			transform: translateY(0)
		}
	}

	@keyframes b {
		0% {
			-webkit-transform: translateY(90px);
			transform: translateY(90px);
		}
		80% {
			-webkit-transform: translateY(5px);
			transform: translateY(5px)
		}
		90% {
			-webkit-transform: translateY(-5px);
			transform: translateY(-5px)
		}
		to {
			-webkit-transform: translateY(0);
			transform: translateY(0)
		}
	}

	.h-information img {
		width: 100px;
		height: 100px;
		border-radius: 100%;
		transition: all .4s ease-in-out;
		-webkit-transition: all .4s ease-in-out;
		object-fit: cover;
	}

	.h-information img:hover {
		transform: rotate(360deg);
		-webkit-transform: rotate(360deg);
	}

	.h-information h2 {
		margin-top: 20px;
		font-size: 18px;
		font-weight: 700;
		/*font-family: 'Sigmar One';*/
	}
	.h-information h2  a{
		background: linear-gradient(to right, #DF2050, #48456D);
		-webkit-background-clip: text;
		color: transparent;
	}
	.headImgBox .scene {
		width: 100%;
		/*height:300px;*/
		text-align: center;
		font-size: 100px;
		font-weight: 200;
		color: #fff;
		position: absolute;
		left: 0;
		top: 160px;
		font-family: 'Sigmar One', Arial;
		text-shadow: 0 2px 2px #47456d;
	}

	.headImgBox .scene span {
		transform: matrix(1, 0, 0, 1, 0, 0);
		-webkit-transform: matrix(1, 0, 0, 1, 0, 0);
		text-shadow: 1px 1px 0 #ff3f1a, -1px -1px 0 #00a7e0;
	}

	.saying:after {
		content: "|";
		font-family: Arial, sans-serif;
		font-size: 1em;
		/*line-height: 0;*/
		display: inline-block;
		vertical-align: baseline;
		opacity: 1;
		text-shadow: 1px 1px 0 #ff3f1a, -1px -1px 0 #00a7e0;
		animation: caret 500ms infinite;
	}

	@keyframes caret {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}
	</style>
