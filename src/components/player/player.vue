<template>
	 <div class="player" v-show='playList.length'>
	 	<transition name='normal'>
	 		<div class="normal-player" v-show='fullScreen' @touchstart.once="firstPlay">
				<div class="top">
					<i class="iconfont icon-xiangxia" @click='back'></i>
					<p class="title">{{currentSong.musicName}}</p>
					<p class="subtitle">{{currentSong.artists}}</p>
				</div>
				<div class="background" :style='bgUrl'>
				</div>
				<div class="middle">
					<transition name='middle'>
						<div class="wrapper" v-show='showFlag' @click='changeShowFlag'>
							<div :class="['cd',cdCls]">
								<img v-lazy='currentSong.img' class="image">
							</div>
						</div>	
					</transition>
					
					<transition name='middle'>
						<scroll 
							class="lyric lyricWrapper" 
							v-show='!showFlag' 
							:data='playList'
							ref='scroll'
						> 
							<div @click='changeShowFlag' v-show='lrc'>
								<div v-if='currentLyric'>
									<p 
										ref='lyricLine'
										class='text'
										v-for='(line,i) in currentLyric.lines'
										:class="{'active':currentLineNumber===i}"  
									>
										{{line.txt}}
									</p>
								</div>	
							</div>
							<div class="noLyric" v-show='!lrc' @click='changeShowFlag'>
								<p>抱歉,没有相关的歌词</p>
							</div>
						</scroll>	
					</transition>
				</div>
				<div class="bottom">
					<div class="progress-bar">
						<span class="start-time">
							{{timeFormate(currentTime)}}
						</span>
						<div class="bar" @click='progressBarClick'>
							<div 
								class="ball" 
								ref='ball' 
								@touchstart.prevent='ballTouchStart'
								@touchmove.prevent='ballTouchMove'
								@touchend='ballTouchEnd'
							>
								<div class="inner-ball"></div>
							</div>
							<div class="bar-inner" ref='bar'></div>
							<div class="comsume" ref='comsume'></div>
						</div>
						<span class="end-time">
							{{timeFormate(currentSong.duration/1000)}}
						</span>
					</div>
					<div class="operate">
						<div class="box box-mode" @click='changeMode'>
								<i :class="iconMode"></i>
						</div>
						<div class="box box-prev" @click='prev'>
								<i class="iconfont icon-shangyishoushangyige"></i>
						</div>
						<div class="box box-play" @click='togglePlay'>
								<i :class="playCls"></i>
						</div>
						<div class="box box-next" @click='next'>
								<i class="iconfont icon-xiayigexiayishou"></i>
						</div>
						<div class="box box-like">
								<i class="iconfont icon-xihuan"></i>
						</div>	
					</div>
				</div>
			</div>
	 	</transition>
		<transition name='mini'>
			<div 
				class="mini-player" 
				v-show='!fullScreen' 
				@click='open'
			>
				<div class="box">
					<div class="leftPart">
						<div class="smImgBox">
							<img v-lazy='currentSong.img' :class="['smImg',cdCls]">
						</div>
						<div class="content">
							<p class="songName">{{currentSong.musicName}}</p>
							<p>{{currentSong.artists}}</p>	
						</div>
					</div>
					<div class="rightPart">
						<i 
							:class="playCls" 
							@click.stop='togglePlay'
						>
						</i>
						<i 
							class="iconfont icon-dianshunxu"
							@click.stop='togglePlaylist'
						>
						</i>	
					</div> 
				</div>
			</div>
		</transition>
		<confirm
			ref='dialog'
			title='抱歉,当前歌曲无法播放,请切换至下一首'
			btnText='切换到下一首'
			@commit='toNext'
		>
		</confirm>
		<playlist ref='playlist'></playlist>
		<audio 
			:src='url' 
			ref='audio' 
			@canplay='ready'
			@error='error'
			@timeupdate='upDateTime'
			@ended='ended'
		></audio>	
	 </div>
</template>
<script>
	import {mapGetters} from 'vuex'
	import {mapMutations} from 'vuex'
	import { playMode } from '../../common/js/config.js'
	import Lyric from 'lyric-parser'
	import scroll from '../../base/scroll/scroll.vue'
	import playlist from '../playlist/playlist.vue'
	import confirm from '../../base/confirm/confirm.vue'
	import {playModeMixin} from '../../common/js/mixin.js'

	const BALL_WIDTH=20

	export default {
		mixins:[playModeMixin],
		created(){
			this.touch={}
		},
		data() {
			return {
				timer: null,
				songReady: false,
				currentTime: 0,
				lrc:'',
				currentLyric:null,
				currentLineNumber:0,
				showFlag:true
			}
		},
		components:{
			playlist,
			confirm,
			scroll
		},
		computed: {
			cdCls() {
				return this.playing ? 'play' : 'play pause'
			},
			playCls() {
				return this.playing ? 'iconfont icon-iconset0483' : 'iconfont icon-iconset0481'
			},
			url() {
				var id = this.currentSong.id
				return `http://music.163.com/song/media/outer/url?id=${id}.mp3`
			},
			index() {
				return this.currentIndex
			},
			percent(){
				return this.currentTime/(this.currentSong.duration/1000)
			},
			bgUrl(){
				return `background:url('${this.currentSong.img}') center;`
			},
			...mapGetters([
				'fullScreen',
				'playList',
				'playing',
				'currentIndex',
				'currentSong',
				'mode',
			]),
		},
		methods: {
			firstPlay(){
				this.$refs.audio.play()
			},
			togglePlaylist(){
				this.$refs.playlist.show()
			},
			changeShowFlag(){
				this.showFlag=!this.showFlag
			},
			getLrc(id){
				this.$axios.get('/lyric?id='+id).then((res)=>{
					if(res.data.code===200){
						this.lrc=res.data.lrc?res.data.lrc.lyric:""
					}
					this.currentLyric=new Lyric(this.lrc,this.handleLyric)
					if(this.playing){
						this.currentLyric.play()
						this.currentLineNum = 0
         				this.$refs.scroll.scrollTo(0, 0, 1000)
					}
				})
			},
			handleLyric({lineNum,txt}){
				if(!this.$refs.scroll){
					return
				}
				this.currentLineNumber = lineNum
				if (this.currentLineNumber > 5) {
					var lineEl = this.$refs.lyricLine[lineNum - 5]	
					this.$refs.scroll.scrollToElement(lineEl,1000)
				} else {
					this.$refs.scroll.scrollTo(0,0,1000)
				}
			},
			ballTouchStart(e){
				this.touch.init=true
				this.touch.startX=e.targetTouches[0].clientX
				this.touch.left=this.$refs.comsume.offsetWidth
			},
			ballTouchMove(e){
				if(!this.touch.init && !this.songReady){
					return 
				}
				var dis=e.targetTouches[0].clientX-this.touch.startX
				var offsetWidth=Math.min(this.$refs.bar.offsetWidth-BALL_WIDTH,Math.max(0,this.touch.left+dis))
				this._offset(offsetWidth)
				this.lyricFollow()
			},
			lyricFollow(){
				this.currentTime=this.getComsume()*(this.currentSong.duration/1000)
				if (this.currentLyric) {
       				 this.currentLyric.seek(this.currentTime * 1000)
      			}
			},
			ballTouchEnd(){
				this.touch.init=false
				this.onBarChange(this.getComsume())
			},
			_offset(offsetWidth){
				this.$refs.comsume.style.width=offsetWidth+"px"
				this.$refs.ball.style.transform=`translateX(${offsetWidth}px)`
			},
			onBarChange(p){
				var currentTime=(this.currentSong.duration/1000) * p 
				this.$refs.audio.currentTime = currentTime
				if(!this.playing){
					this.togglePlay()
					this.setPlayingState(true)
				}
				if(this.currentLyric){
					this.currentLyric.seek(currentTime*1000)
				}
			},
			progressBarClick(e){
				var offsetX=e.clientX-this.$refs.bar.getBoundingClientRect().left
				this._offset(offsetX)
				this.onBarChange(this.getComsume())
			},
			getComsume(){
				var barWidth=this.$refs.bar.offsetWidth-BALL_WIDTH
				var percent=this.$refs.comsume.offsetWidth / barWidth
				return percent
			},
			timeFormate(msg){
				var seconds = Math.floor(msg % 60)
								  .toString()
								  .padStart(2, '0')
				var minutes = Math.floor(msg / 60 % 60)
								  .toString()
								  .padStart(2, '0')

				return `${minutes}:${seconds}`
			},
			back() {
				this.setFullScreen(false)
			},
			open() {
				this.setFullScreen(true)
			},
			togglePlay() {
				if (!this.songReady) {
					return
				}
				this.setPlayingState(!this.playing)
				if(this.currentLyric){
					this.currentLyric.togglePlay()
				}
			},
			ended(){
				if(this.mode===playMode.loop){
					this.loop()
				}else{
					this.next()
				}
			},
			loop(){
				this.$refs.audio.currentTime=0
				this.$refs.audio.play()
				if(this.currentLyric){
					this.currentLyric.seek(0)
				}
			},
			next() {
				if (!this.songReady) {
					return
				}
				var index = this.currentIndex
				index++
				if (index === this.playList.length) {
					index = 0
				}
				this.setCurrentIndex(index)
				if (!this.playing) {
					this.togglePlay()
				}
				this.songReady = false
			},
			prev() {
				if (!this.songReady) {
					return
				}
				var index = this.currentIndex
				index--
				if (index === -1) {
					index = this.playList.length - 1
				}
				this.setCurrentIndex(index)
				if (!this.playing) {
					this.togglePlay()
				}
				this.songReady = false
			},
			ready() {
				this.songReady = true
			},
			error() {
				if(!this.currentSong.id){
					return
				}
				this.currentLyric.stop()
				this.$refs.dialog.show()
				this.songReady = true
			},
			toNext(){
				this.next()
			},
			upDateTime(e) {
				this.currentTime = e.target.currentTime
			},
			...mapMutations({
				setFullScreen: 'setFullScreen',
				setPlayingState: 'setPlayingState',
				setCurrentIndex: 'setCurrentIndex',
				setPlayMode:'setPlayMode',
				setPlayList:'setPlayList'
			}),
		},
		watch: {
			currentSong(newVal,oldVal) {
				if(newVal.id===oldVal.id){
					return 
				}
				this.currentTime=0
				this.getLrc(this.currentSong.id)
				this.$nextTick(() => {
					this.$refs.audio.play()
				})
				if(this.currentLyric){
					this.currentLyric.stop()
				}
			},
			playing(newVal) {
				var audio = this.$refs.audio
				if(!audio){
					return
				}
				if(newVal){
					audio.play()
				}else{
					audio.pause()
				}
			},
			percent(newVal){
				if (newVal >= 0 && !this.touch.init) {
					var progressWidth = this.$refs.bar.offsetWidth - BALL_WIDTH
					var offsetWidth = newVal * progressWidth
					this._offset(offsetWidth)
				}
			},
		}
	}
</script>
<style scoped lang='less'>
	* { touch-action: none; } 
    .player{
    	.normal-player{
    		position: fixed;
	    	top:0;
	    	left: 0;
	    	right: 0;
	    	bottom: 0;
	    	z-index: 100;
    		background: #6D6D6E;
    		.top{
    				position: relative;
    				text-align: center;
					margin-top:20px;    				
						.icon-xiangxia{
							display: inline-block;
							padding: 10px;
							color: #fff;
							font-size: 26px;
							position: absolute;
							top: -10px;
							left: 5px;
						}
						.title{
							font-size: 16px;
							color: #fff;
							font-weight: bold;
							width: 70%;
							margin:0 auto;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
						}
						.subtitle{
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								font-size: 14px;
								color: #fff;
								width: 80%;
								margin:0 auto;
						}
    		}
			.background{
				position:fixed;
				top:0;
				left:0;
				right:0;
				bottom:0;
				background-size:cover;
				z-index:-1;
				filter:blur(20px);
				opacity:0.6;
			}
    		.middle{
					position: fixed;
					top:80px;
					bottom: 170px;
					white-space: nowrap;
					width: 100%;
					.lyric{
						position:absolute;
						width: 100%;
						height: 100%;
						text-align:center;
						overflow:hidden;
						.text{
							text-align:center;
							width: 80%;
							margin:0 auto;
						    line-height: 40px;
						    white-space: nowrap;
						    text-overflow:ellipsis;
						    overflow:hidden;
						    color: #c7c7c7;
						    font-size: 15px;
						    &.active{
						    	color:#fff;
						    }
						}
					}
					.noLyric{
						position:absolute;
						top:0;
						left:0;
						right:0;
						bottom:0;
						p{
							position:relative;
							top:50%;
							left:50%;
							transform:translate(-50%,-50%);
							font-size:16px;
						}
					}
					.wrapper{
						position: absolute;
						top:50%;
						left: 0;
						width: 100%;
						padding-top: 70%;
						transform:translateY(-50%);
						.cd{
							position: absolute;
							top:0;
							left: 12%;
							width: 70%;
							height: 100%;
							border: 15px solid rgba(127,127,127,0.6);
							border-radius: 50%;
							.image{
								width: 100%;
								height: 100%;
								border-radius: 50%;
							}
							&.play{
								animation: rotate 20s linear infinite;
							}
							&.pause{
								animation-play-state: paused;
							}
						}
					}
    		}
    		.bottom{
					position: fixed;
					bottom: 35px;
					width: 100%;
					display: flex;
					flex-direction: column;
					.progress-bar{
						width: 100%;
						height: 50px;
						display:flex;
						text-align:center;
						align-items:center;
						.start-time{
							flex:1;
						}
						.bar{
							flex:4;
							height: 30px;
							display:flex;
							align-items:center;
							position:relative;
							.ball{
								width: 20px;
								height: 20px;
								background:#f1f1f1;
								border-radius:50%;
								position:absolute;
								top:50%;
								left:0;
								margin-top:-10px;
								z-index:100;
								.inner-ball{
									width: 8px;
									height: 8px;
									border-radius:50%;
									background:#D44439;
									position:absolute;
									top:50%;
									left:50%;
									transform:translate(-50%,-50%);
								}
							}
							.bar-inner{
								position:relative;
								width: 100%;
								height: 4px;
								background:rgba(0,0,0,0.6);
							}
							.comsume{
								position:absolute;
								width: 0px;
								height: 4px;
								background:#D44439;
							}
						}
						.end-time{
							flex:1;
						}
					}
					.operate{
						display: flex;
						justify-content: space-around;
						align-items: center;
						.box{
							i{
								color:#fff;
								font-size: 30px;
								&.icon-iconset0481{
									font-size: 40px;
								}
								&.icon-iconset0483{
									font-size: 40px;
								}
							}

						}
					}
    		}
    	}
    	.mini-player{
    		position:fixed;
    		left:0;
    		bottom:0;
    		width: 100%;
    		height: 60px;
    		background:#fff;
    		padding:0 20px;
    		box-sizing:border-box;
    		z-index:100;
    		.box{
    			width: 100%;
    			height: 100%;
    			display:flex;
    			justify-content:space-between;
    			align-items:center;
    			.leftPart{
    				flex:2;
    				display:flex;
    				align-items:center;
    				.content{
    					width: 200px;
    					margin-left:10px;
						overflow:hidden;
						white-space:nowrap;
						text-overflow:ellipsis;
    					.songName{
    						font-size:13px;
    					}
    				}
	    			.smImg{
	    				width: 50px;
	    				height: 50px;
	    				vertical-align:bottom;
	    				border-radius:50%;
	    				&.play{
							animation: rotate 20s linear infinite;
						}
						&.pause{
							animation-play-state: paused;
						}
	    			}	
    			}
    			.rightPart{
    				flex:1;
    				display:flex;
    				justify-content:flex-end;
    				.iconfont{
    					font-size:30px;
    					&:first-child{
    						margin-right:5px;
    					}
    				}
    			}
    			
    		}
    	}
    }
	
	@keyframes rotate{
		0%{
			transform: rotate(0);
		}
		100%{
			transform: rotate(360deg);
		}
	}
	.middle-enter,.middle-leave-to{
    	opacity:0;
    }
    .middle-enter-active,.normal-leave-active{
    	transition:all 0.5s linear;	
    }
    .normal-enter{
    	opacity:0;
    	transfrom:translateY(100%)
    }
    .normal-leave-to{
		opacity:0;
		transfrom:translateY(-100%)
    }
    .normal-enter-active,.normal-leave-active{
    	transition:all 0.5s linear;	
    }
    .mini-enter,.mini-leave-to{
    	opacity:0;
    	transfrom:translateY(100%)
    }
    .mini-enter-active,.mini-leave-active{
    	transition:all 0.5s linear;	
    }
</style>