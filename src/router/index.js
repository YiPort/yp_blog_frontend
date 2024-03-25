import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
	scrollBehavior(to, from, savePosition) { // 在点击浏览器的“前进/后退”，或者切换导航的时候触发。
		if (savePosition) {
			return savePosition;
		} else {
            var top;
            if (window.innerWidth >= 700) {
                 top = 676
            } else {
                 top = 267
            }
			return {
				x: 0,
				y: top
			}
		}
	},
	routes: [{
			path: '/',
			component: resolve => require(['../pages/Home.vue'], resolve),
			meta: {
				auth: true
			},
			name: 'Home'
		}, //首页
		{
			path: '/Home',
			component: resolve => require(['../pages/Home.vue'], resolve),
			meta: {
				auth: true
			},
			name: 'Home'
		}, //首页
		{
			path: '/Share',
			component: resolve => require(['../pages/Share.vue'], resolve),
			meta: {
				auth: true
			},
			name: 'Share'
		}, //分类
    {
			path: '/Search',
			component: resolve => require(['../pages/Search.vue'], resolve),
			meta: {
				auth: true
			},
			name: 'Search'
		}, //搜索
		{
			path: '/DetailArticle',
			component: resolve => require(['../pages/DetailArticle.vue'], resolve),
			meta: {
				auth: true
			},
			name: 'DetailArticle'
		}, //分享详情
		// {
		// 	path: '/Reward',
		// 	component: resolve => require(['../pages/Reward.vue'], resolve),
		// 	meta: {
		// 		auth: true
		// 	},
		// 	name: 'Reward'
		// }, //赞赏
		{
			path: '/FriendsLink',
			component: resolve => require(['../pages/FriendsLink.vue'], resolve),
			meta: {
				auth: true
			},
			name: 'FriendsLink'
		}, //友链
		{
			path: '/Login',
			component: resolve => require(['../pages/Login.vue'], resolve),
			meta: {
				auth: false
			},
			name: 'Login'
		}, //注册登录
		{
			path: '/UserInfo',
			component: resolve => require(['../pages/UserInfo.vue'], resolve),
			meta: {
				auth: true
			},
			name: 'UserInfo'
		}, //用户个人中心
    {
      path: '/Write',
      component: resolve => require(['../pages/Write.vue'], resolve),
      meta: {
        auth: true
      },
      name: 'Write'
    }, //写博客文章
    {
      path: '/Help',
      component: resolve => require(['../pages/Help.vue'], resolve),
      meta: {
        auth: true
      },
      name: 'Help'
    }, //帮助中心
    {
      path: '/System/User',
      component: resolve => require(['../pages/system/User.vue'], resolve),
      meta: {
        auth: true
      },
      name: 'User'
    }, //用户管理
    {
      path: '/System/Article',
      component: resolve => require(['../pages/system/Article.vue'], resolve),
      meta: {
        auth: true
      },
      name: 'Article'
    }, //文章管理
    {
      path: '/System/Ip',
      component: resolve => require(['../pages/system/IpCount.vue'], resolve),
      meta: {
        auth: true
      },
      name: 'Ip'
    }, //访问统计
    {
      path: '/System/Comment',
      component: resolve => require(['../pages/system/Comment.vue'], resolve),
      meta: {
        auth: true
      },
      name: 'Comment'
    }, //评论管理
    {
      path: '/System/LoginInfo',
      component: resolve => require(['../pages/system/LoginInfo.vue'], resolve),
      meta: {
        auth: true
      },
      name: 'Comment'
    }, //用户访问信息管理
    {
      path: '/System/Cache',
      component: resolve => require(['../pages/system/Cache.vue'], resolve),
      meta: {
        auth: true
      },
      name: 'Cache'
    }, //缓存监控
    {
      path: '/404',
      component: resolve => require(['../pages/NotFound.vue'], resolve),
      meta: {
        auth: true
      },
      name: 'NotFound'
    }, //404
    // 所有未定义路由，全部重定向到404页
    {
      path: '*',
      redirect: '/404'
    }

	]
})
