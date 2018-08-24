<template>
	<div class="listView-container" ref='listview'>
		<div class="listView-item" v-for='(val,i) in singerList' :key='i' ref='listGroup'>
			<div class="title">{{val.title}}</div>
			<ul class="singers">
				<li v-for='(data,j) in val.items' @click='selectItem(data)'>
					<img v-lazy='data.avatar'>
					<span>{{data.name}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	export default{
		methods:{
			selectItem(data){
				this.$emit('select',data)
			},
			_getListGroup(){
				this.$emit('getListGroup',this.$refs.listGroup)
			}
		},
		props:['singerList'],
		watch:{
			singerList(){
				setTimeout(()=>{
					this._getListGroup()
				},20)	
			}
		}
	}
</script>
<style scoped lang='less'>
	.listView-container{
		.listView-item{
			.title{
				background: #dedede;
				color: #fff;
				font-size: 13px;
				padding: 3px 10px;
			}
			.singers{
				li{
					background:#F2F3F4;
					display: flex;
					align-items: center;
					padding: 5px;
					border-bottom: 1px solid #ccc;
					img{
						width: 50px;
						height: 50px;
						vertical-align: bottom;
						border-radius: 6px;
					}
					span{
						font-size: 15px;
						padding-left: 20px;
						color: #2e3030;
					}
					&:last-child{
						border-bottom: none;
					}
					&:first-child{
						padding-top:10px;
					}	
				}
				
			}
		}
	}
</style>