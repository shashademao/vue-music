<template>
	<div class="recommend">
		<scroll 
			class="wrapper" 
			ref='scroll'
			:data='slidersData'
		>
			<div>
				<sliders :slidersData='slidersData'></sliders>
				<h2 class="title">推荐歌单</h2>
				<div class="recommendList">
					<div 
						class="item" 
						v-for='(val,i) in recommendSheet' 
						:key='i' 
						@click='selectItem(val)'
					>
						<img v-lazy='val.picUrl'>
						<span class="iconfont icon-headset"><b>{{val.playCount | toFix }}万</b></span>
						<p>{{val.name}}</p>
					</div>
				</div>			
			</div>
		</scroll>
		<loading v-if='!recommendSheet.length'></loading>
		<router-view></router-view>
	</div>
</template>
<script>
	import sliders from '../../base/sliders/sliders.vue'
	import loading from '../../base/loading/loading.vue'
	import scroll from '../../base/scroll/scroll.vue'
	import {playListMixin} from '../../common/js/mixin.js'
	import {mapMutations} from 'vuex'

	export default{
		mixins:[playListMixin],
		created(){
			this.getSheetAndSliders()
		},
		methods:{
			handlePlayList(playList){
				var bottom=playList.length>0? '60px':''
				this.$refs.scroll.$el.style.bottom=bottom
				this.$refs.scroll.refresh()
			},
			selectItem(item){
				this.$router.push({
					path:`/recommend/${item.id}`
				})
				this.setRecommendSheet(item)
			},
			getRecommendSheet(){
				return this.$axios.get('/personalized')
			},
			getSlidersData(){
		        return this.$axios.get('/banner')
	        },
		    getSheetAndSliders(){
		    	this.$axios.all([this.getRecommendSheet(),this.getSlidersData()])
		    				.then(this.$axios.spread((acct,perms)=>{
		    					if(perms.data.code===200){
		    						this.slidersData=perms.data.banners
		    					}
		    					if(acct.data.code===200){
		    						this.recommendSheet=acct.data.result
		    					}
		    	}))
		    },
		    ...mapMutations({
		    	setRecommendSheet:'setRecommendSheet'
		    })
		},
		data(){
			return{
				recommendSheet:[],
				slidersData:[],
				scroll:null
			}
		},
		components:{
			sliders,
			loading,
			scroll
		},
		filters:{
			toFix(msg){
				return (msg/10000).toFixed(1)
			}
		}
	}
</script>
<style scoped lang='less'>
	* { touch-action: none; } 
	.recommend{
		height: 100%;
		.wrapper{
		    position: fixed;
		    top: 88px;
		    bottom: 0;
		    width: 100%;
		}
		.title{
			margin-top:5px;
			padding-left:7px;
			position:relative;
			&::before{
				content:'';
				display:block;
				width: 2px;
				height: 16px;
				background:#D44439;
				position:absolute;
				top:1px;
				left:0;
			}
		}
		.recommendList{
			display:flex;
			padding:7px;
			justify-content:space-between;
			flex-wrap:wrap;
			.item{
				width: 32%;
				margin-bottom:13px;
				position:relative;
				.icon-headset{
					position:absolute;
					top:3px;
					right:3px;
					font-size:10px;
					color:#fff;
				}
				img{
					width: 100%;
					vertical-align:bottom;
				}
				p{
					font-size:13px;
				}
				span{
					b{
						padding-left:2px;
						font-weight:normal;
					}
				}
			}
		}	
	}
	
	
</style>
