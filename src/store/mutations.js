const mutations = {
	setSinger(state, data) {
		state.singer = data // 外界传入数据到vuex
	},
	setPlayingState(state, flag) {
		state.playing = flag
	},
	setFullScreen(state, flag) {
		state.fullScreen = flag
	},
	setPlayList(state, list) {
		state.playList = list
	},
	setSequenceList(state, list) {
		state.sequenceList = list
	},
	setPlayMode(state, mode) {
		state.mode = mode
	},
	setCurrentIndex(state, index) {
		state.currentIndex = index
	},
	setRecommendSheet(state,item){
		state.recommendSheet=item
	},
	setRankList(state,item){
		state.rankList=item
	},
}

export default mutations