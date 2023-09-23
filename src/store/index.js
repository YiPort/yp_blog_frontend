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
  errorImg: 'this.onerror=null;this.src="' + require('../../static/img/tou.jpg') + '"',
  baseURL:'http://127.0.0.1:10086/',
  resourceURL:'http://127.0.0.1:10086/resource/',
  SSOLogin:'http://127.0.0.1:10086/'

}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
