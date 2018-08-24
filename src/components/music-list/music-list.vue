<template>
	<div class="music-list">
		<div class="absHeader"  v-show='showFlag'>
			<i class="iconfont icon-fanhui" @click='back'></i>
		</div>
		<div 
			class="fixedHeader" 
			v-show='!showFlag'	
			:style='opacity'
		>
			<i class="iconfont icon-fanhui" @click='back'></i>
			<span>返回</span>
		</div>
		<div class="bg" :style='bgUrl' ref='bgImg'>
			<div class="filter"></div>
			<div class="text">{{title}}</div>
		</div>
		<scroll 
			class="scroll" 
			ref='scroll' 
			:data='songs'
			:listenScroll='listenScroll'
			@scroll='headAnimation'
			:probeType='3'
			>
			<div 
				class="list" 
				ref='list' 
			>
				<div class="playAll" @click='playAll'>
					<i class="iconfont icon-iconset0481"></i>
					<span>播放全部<span class="sub">(共{{songs.length}}首)</span></span>
				</div>
				<ul>
					<li class="item" 
						v-for='(val,i) in songs' 
						:key='i'
						@click='selectItem(val,i)'
					>
						<div class="left">{{i+1}}</div>
						<div class="right">
							<h3>{{val.musicName}}</h3>
							<p class="singer">{{val.artists}}</p>
						</div>
					</li>
				</ul>
			</div>	
		</scroll>
		<div class="loading" v-if='!songs.length'>
			<loading></loading>
		</div>
	</div>	
</template>
<script>
	import scroll from '../../base/scroll/scroll.vue'
	import {mapActions} from 'vuex'
	import loading from '../../base/loading/loading.vue'
	import {playListMixin} from '../../common/js/mixin.js'

	const TITLE_HEIGHT = 45

	export default {
		mixins:[playListMixin],
		mounted() {
			this.$refs.scroll.$el.style.top = this.$refs.bgImg.offsetHeight + 'px'	
			this.onresize()
		},
		data() {
			return {
				listenScroll:true,
				showFlag:true,
				opacity:{opacity:0}
			}
		},
		methods: {
			headAnimation(pos){
				if(pos.y<-50){
					var opacity = Math.abs(pos.y/150)
					opacity=opacity>1?1:opacity
					this.opacity={opacity}
					this.showFlag=false
				}else{
					this.showFlag=true
				}
			},
			handlePlayList(playList){
				var bottom=playList.length > 0? '60px':''
				this.$refs.scroll.$el.style.bottom=bottom
				this.$refs.scroll.refresh()
			},
			onresize(){
				window.addEventListener('resize',()=>{
					this.$refs.scroll.$el.style.top = this.$refs.bgImg.offsetHeight + 'px'	
				})
			},
			playAll(){
				this.sequencePlay({
					list:this.songs
				})
			},
			selectItem(vai,i){
				this.selectPlay({
					list:this.songs,
					index:i
				})
			},
			back() {
				this.$router.go(-1)
			},
			...mapActions([
				'selectPlay',
				'sequencePlay'
			])
		},
		props: ['songs', 'title', 'bgImage'],
		computed: {
			bgUrl() {
				return `background-image:url(${this.bgImage})`
			}
		},
		components:{
			loading,
			scroll
		}
	}
</script>
<style scoped lang='less'>
	.music-list{
		position: fixed;
		top:0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
		background:#dedede;
		.loading{
			position:absolute;
			top:55%;
			left:50%;
			transfrom:translateX(-50%);
		}
		.absHeader{
			position: absolute;
			top: 0;
			left: 0;
			height: 45px;
			width: 100%;
			line-height: 45px;
			z-index: 200;
			.iconfont{
				color:#fff;
				font-size: 20px;
				padding:0 10px;
			}
		}
		.fixedHeader{
			position: fixed;
			top: 0;
			left: 0;
			z-index: 200;
			height: 45px;
			width: 100%;
			line-height: 45px;
			font-size: 16px;
			font-weight: bold;
			background:#D44439;
			color:#fff;
			.iconfont{
				font-size: 20px;
				padding:0 10px;
			}
		}
		.back{
			position: fixed;
			top: 0;
			left: 0;
			z-index: 100;
			height: 45px;
			width: 100%;
			line-height: 45px;
			font-size: 16px;
			font-weight: bold;
			color:#fff;
			.iconfont{
				font-size: 20px;
				padding:0 10px;
			}
		}
		.bg{
		    position: relative;
		    width: 100%;
		    height: 0;
		    padding-top: 75%;
		   	background-size: cover;
		   	.filter{
		   		position: absolute;
		   		top:0;
		   		left: 0;
		   		width: 100%;
			    height: 0;
			    padding-top: 75%;
			    background: rgba(0,0,0,0.2);
		   	}
		   	.text{
		   		position: absolute;
		   		top:80%;
		   		left: 7%;
		   		width: 80%;
		   		height: 30px;
		   		line-height: 30px;
		   		font-size: 18px;
		   		font-weight: bold;
		   		color: #fff;
		   		letter-spacing: 1px;
		   		white-space:nowrap;
		   		overflow:hidden;
		   		text-overflow:ellipsis;	
		   	}
		}
		.scroll{
		    position: fixed;
		    top: 0;
		    bottom: 0;
		    width: 100%;
		    background: #F2F3F4;
			.list{
				.playAll{
					position: absolute;
					top:-20px;
					left: 0;
					width: 100%;
					padding-left: 10px;
					height: 40px;
					display: flex;
					align-items: center;
					border: 1px solid #ccc;
					background: #dedede;
					border-top-left-radius: 12px;
					border-top-right-radius: 12px;
					box-sizing: border-box;
					i{
						padding: 0 10px;
						font-size: 25px;
					}
					span{
						font-size: 16px;
					}
					.sub{
						font-size: 14px;
						color: #757575;
					}
				}
				ul{
					padding-top: 20px;
					width: 100%;
					li:last-child{
						border-bottom: 0;
					}
					.item{
						height: 55px;
						width: 100%;
						display: flex;
						align-items: center;
						font-size: 16px;
						box-sizing: border-box;
						border-top: 1px solid #dedede;
						border-bottom: 1px solid #dedede;
						background: #F2F3F4;
						.left{
							text-align:center;
							width: 55px;
						}
						.right{
							h3{
								width:280px;
								font-weight: normal;
								overflow:hidden;
								white-space:nowrap;
								text-overflow:ellipsis;
							}					
							.singer{
								width:180px;
								color: #757575;
								overflow:hidden;
								white-space:nowrap;
								text-overflow:ellipsis;
							}
						}
					}
				}
			}	
		}
		
	}
</style>