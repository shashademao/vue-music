<template>
	<div class="singer">
		<scroll 
			class="wrapper" 
			ref='listview' 
			:data='singerList'
			:listenScroll='listenScroll'
			:probeType='3'
			@scroll='scroll'
		>
			<listView 
				:singerList='singerList' 
				@getListGroup='getListGroup'
				@select='selectSinger'
			>
			</listView>
			<div 
				class="list-shortcut" 
				@touchstart='onShortcutTouchStart' 
				@touchmove.stop.prevent='onShortcutTouchMove'
			>
				<ul>
					<li v-for='(val,i) in titleList' 
						:key='i' 
						:data-index='i'
						:class="{active:currentIndex==i}" 
					>{{val}}</li>
				</ul>
			</div>
		</scroll>
		<router-view></router-view>
	</div>
</template>
<script>
	import listView from '../../base/listView/listView.vue'
	import BScroll from 'better-scroll'
	import { mapMutations } from 'vuex'
	import {playListMixin} from '../../common/js/mixin.js'
	import scroll from '../../base/scroll/scroll.vue'

	var pinyin = require("pinyin");

	const HOT_NAME = '热门歌手'
	const HOT_SINGER_LEN = 10
	const ANCHOR_HEIGHT = 20

	export default {
		mixins:[playListMixin],
		created() {
			this.getSingerList()
		},
		data() {
			return {
				singerList: [],
				titleList: [],
				listGroup: [],
				touch: {},
				currentIndex: 0,
				listHeight: [],
				listenScroll:true
			}
		},
		methods: {
			handlePlayList(playList){
				var bottom=playList.length>0? '60px':''
				this.$refs.listview.$el.style.bottom=bottom
				this.$refs.listview.refresh()
			},
			selectSinger(singer){
				this.$router.push({
					path:`/singer/${singer.id}`
				})
				this.setSinger(singer)
			},
			getSingerList() {
				this.$axios.get('/top/artists?limit=100').then((res) => {
					if (res.data.code === 200) {
						this.singerList = res.data.artists
					}
					this.singerList = this.normalizeSinger(this.singerList)

					this.getTitleList()
				})
			},
			normalizeSinger(list) {
				var map = {
					hot: {
						title: HOT_NAME,
						items: []
					}
				}
				list.forEach(item => {
					var firstIndex = pinyin(item.name[0], {
						style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
					})
					item.fI = firstIndex[0][0].toUpperCase()
				})
				list.forEach((item, i) => {
					if (i < HOT_SINGER_LEN) {
						map.hot.items.push({
							id: item.id,
							name: item.name,
							avatar: item.img1v1Url
						})
					}
					const key = item.fI
					if (!map[key]) {
						map[key] = {
							title: key,
							items: []
						}
					}
					map[key].items.push({
						id: item.id,
						name: item.name,
						avatar: item.img1v1Url
					})
				})
				var hot = []
				var ret = []
				for (var key in map) {
					var item = map[key]
					var reg = /[a-zA-z]/
					if (reg.test(item.title)) {
						ret.push(item);
					} else {
						hot.push(item)
					}
				}
				ret.sort((a, b) => {
					return a.title.charCodeAt(0) - b.title.charCodeAt(0)
				});

				hot = hot.filter(item => item.title === HOT_NAME)
				return hot.concat(ret)
			},
			getTitleList() {
				this.singerList.forEach(item => {
					this.titleList.push(item.title.substr(0, 1))
				})
			},
			getListGroup(data) {
				this.listGroup = data
			},
			onShortcutTouchStart(e) {
				this.touch.startY = e.targetTouches[0].clientY
				var anchorIndex = e.target.dataset['index']
				this.currentIndex = parseInt(anchorIndex)
				this.touch.anchorIndex = anchorIndex
				this.$refs.listview.scrollToElement(this.listGroup[anchorIndex], 0)
			},
			onShortcutTouchMove(e) {
				this.touch.moveY = e.targetTouches[0].clientY
				var distance = Math.floor((this.touch.moveY - this.touch.startY) / ANCHOR_HEIGHT)
				distance = parseInt(this.touch.anchorIndex) + distance
				this.currentIndex = distance

				//修复滑动边界
				if(this.currentIndex<0){
					this.currentIndex=0
				}else if(this.currentIndex>this.listHeight.length-2){
					this.currentIndex=this.listHeight.length-2
				}

				this.$refs.listview.scrollToElement(this.listGroup[distance], 0)
			},
			caculateHeight() {
				this.listHeight = []
				var list = this.listGroup
				var height = 0
				this.listHeight.push(height)
				list.forEach(item => {
					height += item.offsetHeight
					this.listHeight.push(height)
				})
			},
			scroll(pos){
				var listHeight = this.listHeight

				if (pos.y > 0) {
					this.currentIndex = 0;
					return
				}
				for (var i = 0; i < listHeight.length - 2; i++) {
					var height1 = listHeight[i]
					var height2 = listHeight[i + 1]
					if (-pos.y >= height1 && -pos.y < height2) {
						this.currentIndex = i
						return
					}
				}
				this.currentIndex = listHeight.length - 2
			},
			...mapMutations({
     			setSinger:"setSinger",
   			})
		},
		watch: {
			listGroup(){
				this.caculateHeight()
			},
		},
		components: {
			listView,
			scroll
		}
	}
</script>
<style scoped lang='less'>
	* {
		touch-action: none;
	}
	.wrapper{
	    position: fixed;
	    top: 75px;
	    bottom: 0;
	    width: 100%;
	    background:#f2f3f4;
	    .list-shortcut{
	    	position:fixed;
	    	top:110px;
	    	right:0;
	    	ul{
	    		text-align:center;
	    		li{
    			    padding: 4px;
				    line-height: 1;
				    color: #757575;
				    font-size: 11px;
				    font-weight: 700;
	    		}
	    		.active{
	    			color:#D44439;
	    		}
	    	}
	    }
	}
</style>