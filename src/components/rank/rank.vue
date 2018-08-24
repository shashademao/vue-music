<template>
	<scroll class="wrapper" ref='scroll' :data='rankData'>
		<div class="rank">
			<div 
				class="item" 
				v-for='(val,i) in rankData' 
				:key='i'
				@click='selectItem(val)'
			>
				<div class="left">
					<img v-lazy='val.img'>
				</div>
				<div class="right">
					<p v-for='(item,j) in val.topThree'>
						<span>{{j+1}}.</span><span>{{item.name}} - {{item.ar[0].name}}</span>
					</p>
				</div>
			</div>
		</div>
		<div class="loading" v-show='!rankData.length'>
			<loading></loading>
		</div>
		<router-view></router-view>		
	</scroll>
</template>
<script>
	const RANK_INDEX=[3,0,2,1,17,15]
	import {mapMutations} from 'vuex'
	import scroll from '../../base/scroll/scroll.vue'
	import {playListMixin} from '../../common/js/mixin.js'
	import loading from '../../base/loading/loading.vue'

	export default{
		mixins:[playListMixin],
		created(){
			this.getRankData()
		},
		data(){
			return{
				rankData:[],
			}
		},
		methods:{
			handlePlayList(playlist){
				var bottom = playlist.length > 0 ? '60px' : ''
				this.$refs.scroll.$el.style.bottom = bottom
				this.$refs.scroll.refresh()
			},
			selectItem(val){
				this.$router.push({
					path:`/rank/${val.id}`
				})
				this.setRankList(val)
			},
			getRankData(){
				for(let i=0;i<RANK_INDEX.length;i++){
					var index=RANK_INDEX[i]
					this.$axios.get('/top/list?idx='+index).then((res)=>{
						if(res.data.code===200){
							this.rankData.push({
								name:res.data.playlist.name,
								id:res.data.playlist.id,
								img:res.data.playlist.coverImgUrl,
								topThree:res.data.playlist.tracks.slice(0,3)
							})
						}
					})
				}
			},
			...mapMutations({
				setRankList:'setRankList'
			})
		},
		components:{
			scroll,
			loading
		}
	}
</script>
<style scoped lang='less'>
	.wrapper{
		position:fixed;
	    bottom: 0;
	    top:75px;
	    overflow:hidden;
	    width: 100%;
	    background: #f2f3f4;
	    z-index:100;
	    .loading{
	    }
		.rank{
			.item{
				display: flex;
				justify-content:space-between;
				padding: 5px 10px;
				border-bottom: 1px solid #dedede;
				.left{
					flex: 1;
					img{
						width: 100px;
						height: 100px;
						vertical-align: bottom;
					}
				}
				.right{
					flex: 2;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					p{
						width: 200px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						font-weight: 400;
						font-size: 13px;
					}
				}
			}
		}	
	}
	
</style>