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
  }
}

/** 状态定义 */
export const state = {
  loading: false,
  themeObj: 0,//主题
  keywords:'',//关键词
  classListObj:null,//分类数组
  errorImg: 'this.onerror=null;this.src="' + require('../../static/img/tou.jpg') + '"',
  baseURL:'http://127.0.0.1:10086/',
  SSOLogin:'http://127.0.0.1:8001/'
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
