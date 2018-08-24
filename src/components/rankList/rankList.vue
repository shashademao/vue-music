<template>
	<keep-alive>	
		<transition>
			<musicList :songs='songs' :title='title' :bgImage='bgImage'></musicList>
		</transition>
	</keep-alive>	
</template>
<script>
	import musicList from '../music-list/music-list.vue'
	import {mapGetters} from 'vuex'
	import {normalize} from '../../common/js/util.js'

	export default{
		data(){
			return {
				songs:[]
			}
		},
		created(){
			this.getSongs()
		},
		methods:{
			getSongs(){
				if(!this.rankList.id){
					this.$router.push('/rank')
					return
				}
				this.$axios.get('/playlist/detail?id='+this.rankList.id).then((res)=>{
					if(res.data.code===200){
						this.songs=normalize(res.data.playlist.tracks)
					}
				})				
			},
		},
		computed:{
			title(){
				return this.rankList.name
			},
			bgImage(){
				return this.rankList.img
			},
			...mapGetters([
				'rankList'
			])
		},
		components:{
			musicList,
		}
	}
</script>
<style>
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