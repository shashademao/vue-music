<template>
	<div class="header">
		<div class="title">
			<p>傻傻的猫播放器</p>
		</div>
		<router-link class="iconfont icon-sousuo" tag='i' to='/search'></router-link>
	</div>
</template>
<script>
	
</script>
<style scoped lang='less'>
	.header{
		position: fixed;
		top:0;
		width: 100%;
		height: 40px;
		background: #D44439;
		color: #fff;
		z-index:50;
		.icon-sousuo{
			position: absolute;
			height: 40px;
			width: 40px;
			top: 0;
			box-sizing: border-box;
			padding: 9px;
			font-size: 17px;
		}
		.icon-sousuo{
			right: 0;
		}
		.title{
			padding: 0 40px;
			text-align: center;
			line-height: 40px;
			font-size: 16px;
			font-weight: bold;
		}
		.icon-sousuo{
			right: 0;
		}
	}
</style>