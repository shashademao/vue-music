import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations.js'
import * as actions from './actions'
import state from './state.js'
import getters from './getters.js'

// 使 vuex 的state 状态改变能够在控制台输出
//import logger from 'vuex/dist/logger'

Vue.use(Vuex)

var store=new Vuex.Store({
	state,
	mutations,
	getters,
	//plugins:[logger()],
	actions,
})


export default store