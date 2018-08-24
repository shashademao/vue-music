<template>
  <div id="app">
  	<myheader></myheader>
  	<tabbar></tabbar>
  	<transition>
	  	<keep-alive>
	   		<router-view v-if='$route.meta.keepAlive'></router-view>
	   	</keep-alive>
  	</transition>

  	<transition>
  		<router-view v-if='!$route.meta.keepAlive'></router-view>
  	</transition>
  	<player></player>		
  </div>
</template>

<script>
import myheader from './components/myheader/myheader.vue'
import tabbar from './components/tabbar/tabbar.vue'
import player from './components/player/player.vue'

export default {
	components:{
		myheader,
		tabbar,
		player
	}

}
</script>

<style lang='less'>
	* { touch-action: none; }
	#app{
		padding-top:75px;
		overflow-x:hidden;
		background:#f2f3f4;
	}
	.v-enter,.v-leave-to{
		opacity: 0;
	}
	.v-enter-active,.v-leave-active{
		transition:all 0.5s linear;
	}
</style>
