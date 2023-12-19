import Vue from 'vue'
import Vuex from 'vuex'
// import * as getters from './getters.js'

Vue.use(Vuex)

const actions = {
  getCategory(context,value){
    context.commit('getCategoryList',value)
  }
}

const mutations = {
  getCategoryList(state,response){
    state.classListObj = response
  },
  loadingIndex(state,response) {
    state.loadingIndex = response
  },
  changeIsMy(state,response) {
    state.isMy = response
  },
  changeCreateBy(state,response) {
    state.createBy = response
  },
  changeIsAdmin(state,response) {
    state.isAdmin = response
  }
}

/** 状态定义 */
export const state = {
  loading: false,
  themeObj: 0,//主题
  keywords:'',//关键词
  classListObj:null,//分类数组
  // searchKey: '',//搜索关键字
  loadingIndex: false,//编辑文章后是否重新提交文章索引
  errorImg: "https://aiguider.top/wp-content/uploads/b0bdcfd3-334c-3dd3-9e42-f239d1f9ba84-jpg.webp",
  isMy: false,
  createBy: null,
  isAdmin: false,//管理员
  baseURL:'http://127.0.0.1:10086/',
  resourceURL:'http://127.0.0.1:10086/resource/',
  SSOLogin:'http://127.0.0.1:10086/'

}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
