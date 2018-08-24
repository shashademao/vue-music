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
			this.getSingerDetail()
		},
		data(){
			return {
				id:this.$route.params.id,
				songs:[]
			}
		},
		methods:{
			getSingerDetail(){
				if(!this.singer.id){
					this.$router.push({
						path:'/singer'
					})
					return
				}
				this.$axios.get('artists?id='+this.id).then(res=>{
					if(res.data.code===200){
						this.songs=normalize(res.data.hotSongs)
					}
				})
			}
		},
		computed:{
			title(){
				return this.singer.name
			},
			bgImage(){
				return this.singer.avatar
			},
			...mapGetters([
				'singer'
			])
		},
		components:{
			musicList,
		}
	}
</script>
<style scoped lang='less'>
	.v-enter,.v-leave-to{
		opacity: 0;
		transform: translateX(100%);
	}
	.v-enter-active,.v-leave-active{
		transition: all 0.5s linear;
	}
</style>