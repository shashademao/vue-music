<template>
	<div class="search">
		<searchBox></searchBox>
	</div>	
</template>
<script>
	import searchBox from '../../base/searchBox/searchBox.vue'

	export default{
		components:{
			searchBox
		}
	}
</script>
<style>
	.search{
		position: fixed;
		top:0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #f2f3f4;
		z-index: 100;
	}
</style>