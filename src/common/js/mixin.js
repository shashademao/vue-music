import {shuffle} from '../js/util.js'
import {mapMutations,mapGetters} from 'vuex'
import {playMode} from '../js/config.js'

export const playListMixin={
	computed:{
		...mapGetters([
			'playList'
		])
	},
	mounted(){
		this.handlePlayList(this.playList)
	},
	activated(){
		this.handlePlayList(this.playList)
	},
	watch:{
		playList(newVal){
			this.handlePlayList(newVal)
		}
	},
	methods:{
		handlePlayList(){
			throw new Error('component must implement handlePlayList method')
		}
	}
}

export const playModeMixin={
	methods:{
		changeMode(){
			var mode=(this.mode+1)%3
			this.setPlayMode(mode)
			var list=null
			if(this.mode===playMode.random){
				list=shuffle(this.sequenceList)
			}else{
				list=this.sequenceList
			}
			this.resetCurentIndex(list)
			this.setPlayList(list)
		},
		resetCurentIndex(list){
			var index = list.findIndex((item)=>{
				return item.id===this.currentSong.id
			})
			this.setCurrentIndex(index)
		},
		...mapMutations({
			setCurrentIndex:'setCurrentIndex',
			setPlayList:'setPlayList',
			setPlayMode:'setPlayMode'
		})
	},
	computed:{
		iconMode(){
			if(this.mode===playMode.sequence){
				return 'iconfont icon-dianshunxu'
			}else if(this.mode===playMode.loop){
				return 'iconfont icon-xunhuan'
			}else{
				return 'iconfont icon-suiji'
			}
		},
		...mapGetters([
			'currentSong',
			'sequenceList'
		])
	}
}