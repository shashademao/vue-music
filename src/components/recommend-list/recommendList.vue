<template>
	<transition>
		<musicList :songs='songs' :title='title' :bgImage='bgImage'></musicList>
	</transition>
</template>
<script>
	import { mapGetters } from 'vuex'
	import musicList from '../music-list/music-list.vue'
	import {normalize} from '../../common/js/util.js'

	export default{
		created(){
			this.$nextTick(()=>{
				this.getSongs()
			})
		},
		data(){
			return {
				id:this.$route.params.id,
				songs:[]
			}
		},
		methods:{
			getSongs(){
				if(!this.recommendSheet.id){
					this.$router.push('/recommend')
					return
				}
				this.$axios.get('/playlist/detail?id='+this.id).then((res)=>{
					if(res.data.code===200){
						this.songs=normalize(res.data.playlist.tracks)
					}
				})
			},
		},
		computed:{
			title(){
				return this.recommendSheet.name
			},
			bgImage(){
				return this.recommendSheet.picUrl
			},
			...mapGetters([
				'recommendSheet'
			])
		},
		components:{
			musicList
		}
	}
</script>
<style scoped lang='less'>
	.v-enter{
		opacity: 0;
		transform: translateX(100%);
	}
	.v-leave-to{
		opacity:0;
		transform:translateX(-100%);
	}
	.v-enter-active,.v-leave-active{
		transition: all 0.5s linear;
	}
</style>