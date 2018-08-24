<template>
	<div class="playlist" v-show='showFlag' @click='hide'>
		<div class="container" @click.stop>
			<div class="header">
				<div class="left" @click='changeMode'>
					<i :class='iconMode'></i>
					<span>{{modeText}}({{sequenceList.length}})</span>
				</div>
				<div class="right" @click='remove'>
					<i class="iconfont icon-lajitong"></i>
				</div>
			</div>
			<scroll 
				class="list" 
				:data='playList'
				ref='scroll'
			>
				<div>
					<div 
						class="item" 
						v-for='(val,i) in sequenceList' 
						:key='i'
						@click='selectItem(val,i)'
						ref='listItem'
					>
						<p class="left">
							<i 
								:class="['iconfont',getCurrentSongIcon(val)]"
							></i>
							<span>{{val.musicName}}</span>
						</p>
						<p class="right" @click.stop='deleteOne(val)'>
							<i class="iconfont icon-close"></i>	
						</p>
					</div>	
				</div>
			</scroll>
			<div class="bottom" @click='hide'>
				<div class="close">关闭</div>
			</div>
		</div>
		<confirm 
			ref='confirm' 
			title='是否清空播放列表'
			btnText='清空'
			@commit='removeAll'
		></confirm>
	</div>
</template>
<script>
	import {mapGetters,mapMutations,mapActions} from 'vuex'
 	import scroll from '../../base/scroll/scroll.vue'
 	import {playMode} from '../../common/js/config.js'
 	import confirm from '../../base/confirm/confirm.vue'
 	import {playModeMixin} from '../../common/js/mixin.js'

	export default{
		mixins:[playModeMixin],
		data(){
			return {
				showFlag:false
			}
		},
		methods:{
			remove(){
				this.$refs.confirm.show()
			},
			removeAll(){
				this.removeAll()
				this.hide()
			},
			deleteOne(val){
				this.deleteSong(val)
				if(!this.playList.length){
					this.hide()
				}
			},
			show(){
				this.showFlag=true
				setTimeout(()=>{
					this.$refs.scroll.refresh()
					this.scrollToCurrentSong(this.currentSong)
				},20)
			},
			hide(){
				this.showFlag=false
			},
			getCurrentSongIcon(val){
				if(val.id===this.currentSong.id){
					return 'icon-MUSIC'
				}
				return ''
			},
			selectItem(val,index){
				if(this.mode===playMode.random){
					index=this.playList.findIndex(item=>{
						return item===val
					})
				}
				this.setCurrentIndex(index)
				this.setPlayingState(true)
			},
			scrollToCurrentSong(val){
				if(!val.id){
					return
				}
				var index=this.sequenceList.findIndex(item=>{
					return val.id===item.id
				})
				setTimeout(()=>{
					this.$refs.scroll.scrollToElement(this.$refs.listItem[index],300)
				},20)
				
			},
			...mapMutations({
				setCurrentIndex:'setCurrentIndex',
				setPlayingState:'setPlayingState',
				setPlayMode:'setPlayMode',
				setPlayList:'setPlayList'
			}),
			...mapActions([
				'deleteSong',
				'removeAll'
			])
		},
		computed:{
			modeText(){
				if(this.mode===playMode.sequence){
					return '顺序播放'
				}else if(this.mode===playMode.loop){
					return '单曲循环'
				}else{
					return '随机播放'
				}
			},
			...mapGetters([
				'playList',
				'sequenceList',
				'currentSong',
				'mode'
			])
		},
		watch:{
			currentSong(newVal,oldVal){
				if(!newVal.id){
					return 
				}
				if(newVal){
					this.scrollToCurrentSong(newVal)
				}
			}
		},
		components:{
			scroll,
			confirm
		}
	}
</script>
<style scoped lang='less'>
	.playlist{
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background: rgba(0,0,0,0.3);
		z-index: 200;
		.container{
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			border-top-right-radius: 8px;
			border-top-left-radius: 8px;
			background: #f2f3f4;
			font-size: 14px;
			.header{
				padding: 15px 20px 5px;
				line-height: 21px;
				display: flex;
				justify-content: space-between;
				i{
					margin-right: 5px;
					vertical-align: middle;
				}
			}
			.list{
				max-height: 300px;
				overflow: hidden;
				padding: 0 20px;
				.item{
					padding: 10px 0;
					display: flex;
					justify-content:space-between;
					border-bottom:1px solid #dedede;
					&:last-child{
						border:0;
					}
					.left{
						width: 80%;
					    text-overflow: ellipsis;
					    overflow: hidden;
					    white-space: nowrap;
					    .icon-MUSIC{
					    	color:#D44439;
					    }
					}
					.right{
						i{
							padding:5px;
						}
					}
				}
			}
			.bottom{
				width: 100%;
				height: 50px;
				text-align: center;
				line-height: 50px;
			}
		}
	}
</style>