<template>
	<div class="loading-contianer">
		<div class="wrapper">
			<img src="./loading.gif" height="66" width="66">
			<p>加载中...</p>	
		</div>
		
	</div>
</template>
<script></script>
<style scoped lang='less'>
	.loading-contianer{
		text-align: center;
		background: #f2f3f4;
		.wrapper{
			position: absolute;
			top:50%;
			left: 50%;
			transform: translate(-50%,-50%);
			p{
				margin-top: 10px;
				font-weight: bold;
			}	
		}
		
	}
</style>