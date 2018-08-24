<template>
	<div class="modal" v-show='showFlag' @click.stop>
		<div class="modal-dialog">
			<div class="title">
				{{title}}
			</div>
			<div class="operate">
				<button @click='cancel'>取消</button>
				<button @click='confirm'>{{btnText}}</button>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		props:['title','btnText'],
		data(){
			return{
				showFlag:false
			}
		},
		methods:{
			cancel(){
				this.showFlag=false
			},
			show(){
				this.showFlag=true
			},
			confirm(){
				this.$emit('commit')
				this.showFlag=false
			}
		}
	}
</script>
<style scoped lang='less'>
	.modal{
		position: fixed;
		top:0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 200;
		background: rgba(0,0,0,0.3);
		.modal-dialog{
			position: absolute;
			top:50%;
			left: 50%;
			transform: translate(-50%,-50%);
			width: 270px;
			font-size: 14px;
			color: #2e3030;
			background: #f2f3f4;
			border-radius:8px;
			.title{
				width: 100%;
				height: 50px;
				line-height: 50px;
				text-align: center;
			}
			.operate{
				height: 50px;
				background: #fff;
				display: flex;
				justify-content: space-between;
				border-radius:8px;
				button{
					flex:1;
					border: 0;
					outline: 0;
					color:#D44439;
					background: #f2f3f4;
					border-radius: 8px;
				}
			}
		}
	}
</style>