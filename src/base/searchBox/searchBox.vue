<template>
	<div class="searchBox">
		<div class="inputBox">
			<i class="iconfont icon-fanhui" @click='back'></i>
			<input 
				type="text" 
				placeholder="搜索歌曲、歌手"
				v-model='query'
				maxlength="50"
				v-focus 
				ref='input'
			>
			<i 
				class="iconfont icon-close" 
				v-show='query'
				@click='clear'
			></i>
		</div>
		<div class="hotkeysBox" v-show='!query'>
			<h3 class="title">热门搜索</h3>
			<div class="hotkey">
				<p 
					class="item" 
					v-for='(val,i) in hotkey' 
					:key='i'
					@click='addQuery(val)'
				>{{val}}</p>
			</div>
		</div>
		<transition mode='out-in'>
			<div class="suggest" v-show='query' >
				<suggest 
					:queryStr='query'
					 @listScroll='blurInput'
					 ref='suggest'
				></suggest>
			</div>	
		</transition>	
		
	</div>
</template>
<script>
	import suggest from '../../components/suggest/suggest.vue'
	export default{
		created(){
			this.getHotkey()
		},
		data(){
			return{
				query:'',
				hotkey:[]
			}
		},
		directives:{
			focus(el){
				el.focus()
			}	
		},
		methods:{
			blurInput(){
				this.$refs.input.blur()
			},
			back(){
				this.$router.go(-1)
			},
			clear(){
				this.query=''
				this.$refs.suggest.scrollTo(0,0)
			},
			addQuery(val){
				this.query=val
			},
			getHotkey(){
				this.$axios.get('/search/hot').then((res)=>{
					if(res.data.code===200){
						this.normalize(res.data.result.hots);
					}
				})
			},
			normalize(list){
				list.forEach(item=>{
					this.hotkey.push(item.first)
				})
			}
		},
		components:{
			suggest
		}
	}
</script>
<style scoped lang='less'>
	.v-enter{
		opacity:0;
	}
	.v-leave-to{
		opacity:0;
		position:absolute;
	}
	.v-enter-active,.v-leave-active{
		transition:all 0.5s linear;
	}
	.searchBox{
		.inputBox{
			position:fixed;
			top:0;
			left:0;
			z-index:150;
			height: 40px;
			width: 100%;
			background: #D44439;
			position: relative;
			display: flex;
			.iconfont{
				position: absolute;
			    height: 40px;
			    width: 40px;
			    top: 0;
			    box-sizing: border-box;
			    padding: 9px;
			    color: #fff;
			    font-size: 17px;
			}
			.icon-fanhui{
				left: 0;
			}
			.icon-close{
				right: 0;
			}
			input{
				font-size: 14px;
				line-height: 22px;	
				margin:0px 40px;
				width: 100%;
				height: 30px;
				border: 0;
				outline: 0;
				margin-top: 3px;
				background: #D44439;
				border-bottom:1px solid  #f2f3f4;
				color: #fff;
				&::-webkit-input-placeholder{
            		color:#dedede;
       			 }
			}
		}
		.hotkeysBox{
			width: 80%;
			margin:20px auto 0;
			.title{
				color: #757575;
				margin-bottom: 10px;
				font-size:13px;
			}
			.hotkey{
				display: flex;
				flex-wrap: wrap;
				.item{
					font-size: 14px;
					padding:3px 5px; 
					border-radius: 8px;
					border:1px solid #dedede;
					margin-right: 5px;
					margin-top: 10px;
					color: #2e3030;
				}
			}
		}
	}
</style>