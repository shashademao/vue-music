<template>
	<div class="nav">
		<router-link to='/recommend' class='item'>
			<span>推荐</span>
		</router-link>
		<router-link to='/rank' class='item'>
			<span>排行</span>
		</router-link>
		<router-link to='/singer' class='item'> 
			<span>歌手</span>
		</router-link>
	</div>
</template>
<script>
	
</script>
<style scoped lang='less'>
	.nav{
		position: fixed;
		top:40px;
		width: 100%;
		height: 35px;
		background: #D44439;
		font-weight: bold;
		font-size: 14px;
		display: flex;
		z-index: 50;
		.item{
			margin-top: 5px;
			flex: 1;
			text-align: center;
			color: #dedede;
			span{
				padding-bottom: 5px;
			}
			&.router-link-active{
				span{
					color: #fff;
					border-bottom: 2px solid #fff;
				}
			}
		}
	}
</style>