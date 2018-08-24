<template>
	<scroll 
		:data='ret' 
		:pullUp='pullUp'
		:beforeScroll='beforeScroll'
		:probeType='3'
		ref='scroll'
		class='wrapper'
		@scrollToEnd='scrollToEnd'
		@beforeScroll='listScroll'
	>
		<div class="suggest">
			<div class="bestSuggest">
				<p class="title" v-show='matchSinger.id || matchSongSheet.id'>最佳匹配</p>
				<div 
					class="bestSuggestItem" 
					v-show='matchSinger.id' 
					@click='toSinger(matchSinger)'
				>
					<div class="left">
						<img v-lazy="matchSinger.avatar" width="50" height="50">
					</div>
					<div class="right">
						<p>歌手：{{matchSinger.name}}</p>
					</div>
				</div>
				<div 
					class="bestSuggestItem" 
					v-show='matchSongSheet.id'
					@click='toSheet(matchSongSheet)'		
				>
					<div class="left">
						<img v-lazy="matchSongSheet.picUrl" width="50" height="50">
					</div>
					<div class="right">
						<p class="songSheet">歌单：{{matchSongSheet.name}}</p>
					</div>
				</div>
			</div>
			<div class="suggestRet">
				<ul>
					<li 
						class="item" 
						v-for='(val,i) in ret' 
						:key='i'
						@click='selectItem(val,i)'
					>
						<p class="name">{{val.musicName}}</p>
						<p class="art">{{val.artists}}</p>
					</li>
				</ul>
			</div>		
		</div>
		<div 
			class="no-reslut" 
			v-show="noResult"
		>
			<noresult></noresult>
		</div>
		<router-view></router-view>	
	</scroll>
</template>
<script>
	import {normalize} from '../../common/js/util.js'
	import scroll from '../../base/scroll/scroll.vue'
	import {mapMutations} from 'vuex'
 	import {mapActions} from 'vuex'
 	import noresult from '../../base/noresult/noResult.vue'
 	import {playListMixin} from '../../common/js/mixin.js'

	export default {
		data(){
			return {
				ret:[],
				matchSinger:{},
				matchSongSheet:{},
				pullUp:true,
				offset:0,
				beforeScroll:true,
				timer:null,
				hasMore:true
			}
		},
		mixins:[playListMixin],
		props:['queryStr'],
		methods:{
			handlePlayList(playList){
				var bottom = playList.length > 0 ? '60px':''
				this.$refs.scroll.$el.style.bottom=bottom
				this.$refs.scroll.refresh()
			},
			scrollTo(x,y){
				this.$refs.scroll.scrollTo(x,y)
			},
			listScroll(){
				this.scrollToEnd()
			},
			selectItem(val,i){
				this.getImg(this.ret)
				this.selectPlay({
					list:this.ret,
					index:i
				})
			},
			querySinger(queryStr){
				this.$axios.get('/search?type=100&keywords='+this.queryStr).then((res)=>{
					if(res.data.code===200){
						if(!res.data.result.artists){
							this.matchSinger={}
							return 
						}
						var singer=res.data.result.artists[0]
						this.matchSinger={
							id:singer.id,
							name:singer.name,
							avatar:singer.img1v1Url 
						}
					}
				})
			},
			querySongSheet(queryStr){
				this.$axios.get('/search?type=1000&keywords='+this.queryStr).then((res)=>{
					if(res.data.code===200){
						if(!res.data.result.playlists){
							this.matchSongSheet={}
							return 
						}
						var sheet=res.data.result.playlists[0]
						this.matchSongSheet={
							id:sheet.id,
							name:sheet.name,
							picUrl:sheet.coverImgUrl 
						}
					}
				})
			},
			queryChange(queryStr){
				this.$axios.get(`/search?offset=${this.offset}&keywords=${this.queryStr}`).then((res)=>{
					if(res.data.code===200){
						if(!res.data.result.songs){
							this.hasMore=false
							return
						}
						var newRet=this.normalize(res.data.result.songs)
						this.ret.push.apply(this.ret,newRet)
					}
				})
			},
			getImg(ret){
				this.ret.forEach(item=>{
					this.$axios.get('/song/detail?ids='+item.id).then((res)=>{
						if(res.data.code===200){
							res.data.songs.forEach(song=>{
								item.img=song.al.picUrl
							})
						}
					})	
				})
			},
			normalize(list){
				if(!list){
					return 
				}
				var songs=[]
			  	list.forEach(item => {
				    var art = []
				    item.artists.forEach(item => {
				      art.push(item.name)
				    })
				    art = art.join('/')
				    songs.push({
				      id: item.id,
				      musicName: item.name,
				      artists:art,
				      duration:item.duration
				    })
				})
  				return songs
			},
			scrollToEnd(){
				if(!this.hasMore){
					return
				}
				this.offset+=30
				this.queryChange(this.queryStr)
			},
			toSinger(singer){
				this.$router.push({
					path:`/search/singer/${singer.id}`
				})
				this.setSinger(singer)
			},
			toSheet(sheet){
				this.$router.push({
					path:`/search/sheet/${sheet.id}`
				})
				this.setRecommendSheet(sheet)
			},
			...mapMutations({
				setSinger:"setSinger",
				setRecommendSheet:'setRecommendSheet'
			}),
			...mapActions([
				'selectPlay',
			])
		},
		computed:{
			noResult(){
				return !this.ret.length && !this.matchSinger.id && !this.matchSongSheet.id
			},
		},
		watch:{
			queryStr(newVal){
				if(this.timer){
					clearTimeout(this.timer)
				}
				this.timer=setTimeout(()=>{
					this.offset=0
					this.ret=[]
					this.hasMore=true
					this.queryChange(newVal),
					this.querySinger(newVal),
					this.querySongSheet(newVal)	
				},200)
			},
			'$route.path'(newVal){
				if(newVal.endsWith('search')){
					this.$refs.scroll.$el.style.zIndex=100
				}else{
					this.$refs.scroll.$el.style.zIndex=150
				}			
			}
		},
		components:{
			scroll,
			noresult
		}
	}
</script>
<style scoped lang='less'>
	.wrapper{
		position:fixed;
		top:40px;
		bottom:0;
		width: 100%;
		z-index:100;
		.no-reslut{
			position:fixed;
			top:50%;
			left:50%;
			transform:translate(-50%,-50%);
		}
		.suggest{
			position:absolute;
			padding: 10px 20px;
			background: #f2f3f4;
			.bestSuggest{
				.title{
					color: #D44439;
					margin-bottom: 10px;
				}
				.bestSuggestItem{
					display: flex;
					align-items: center;
					border-bottom: 1px solid #dedede;
					padding: 5px 0;
					font-size: 13px;
					.left{
						margin-right: 20px;
						img{
							vertical-align: bottom;
						}
					}
					.right{
						width: 100%;
						.songSheet{
							width: 95%;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
						}
					}
				}
			}
			.suggestRet{
				.item{
					width: 100%;
					height: 50px;
					padding: 3px 0;
					display: flex;
					flex-direction: column;
					justify-content: center;
					border-bottom: 1px solid #dedede;
					.name{
						width: 300px;
						font-size: 16px;
						color: #2e3030;
					    white-space: nowrap;
					    overflow: hidden;
					    text-overflow: ellipsis;
					}
					.art{
					    font-size: 12px;
					    color: #757575;
					    white-space: nowrap;
					    overflow: hidden;
					    text-overflow: ellipsis;
					}	
				}
			}
		}	
	}
	
</style>