import 'babel-polyfill' 
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import store from './store/index.js'

import './common/css/demo.css'
import './common/css/iconfont.css'

fastclick.attach(document.body);

import axios from 'axios'
Vue.prototype.$axios=axios
axios.defaults.baseURL='http://localhost:3000'	

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./common/image/err.jpg'),
  loading: require('./common/image/loading.jpg'),
  attempt: 1
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})
