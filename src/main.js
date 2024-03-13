// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import './assets/css/style.less'
import store from './store'
import MavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// highlight.js代码高亮插件
import Highlight from './utils/highlight';
import VueViewer, { directive as viewerDirective } from 'v-viewer';
import 'viewerjs/dist/viewer.css'; // 图片预览器的样式
// 分页组件
import Pagination from "./components/pagination.vue";

Vue.component('Pagination', Pagination)
Vue.use(Highlight);
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(MavonEditor);
Vue.use(VueViewer, {
            defaultOptions: {
                toolbar: {
                    zoomIn: 0,
                    zoomOut: 0,
                    oneToOne: 0,
                    reset: 0,
                    prev: {
                        show: 4,
                        size: 'large',
                    },
                    play: 0,
                    next: {
                        show: 4,
                        size: 'large',
                    },
                    rotateLeft: 0,
                    rotateRight: 0,
                    flipHorizontal: 0,
                    flipVertical: 0,
                },
                zoomRatio: 0.3 // 缩放比率 默认是0.1
            }
        }); // 图片预览器
// 用于图片预览的指令方式调用 在元素上加上会处理元素下所有的图片,为图片添加点击事件,点击即可预览
        Vue.directive('viewer', viewerDirective({
            debug: true
        }));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
