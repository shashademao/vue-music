import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
 	routes:[
 		{path:'/',redirect:'/recommend'},
 		{
 			path:'/recommend',
 			component:()=>import('../components/recommend/recommend.vue'),
 			meta:{
 				keepAlive:true
 			},
 			children:[
 				{path:':id',component:()=>import('../components/recommend-list/recommendList.vue')}
 			],
 		},
 		{
 			path:'/singer',
 			component:()=>import('../components/singer/singer.vue'),
 			children:[
 				{path:':id',component:()=>import('../components/singer-detail/singer-detail.vue')}
 			]
 		},
 		{
 			path:'/rank',
 			component:()=>import('../components/rank/rank.vue'),
 			children:[
 				{path:':id',component:()=>import('../components/rankList/rankList.vue')}
 			]
 		},
 		{
 			path:'/search',
 			component:()=>import('../components/search/search.vue'),
 			children:[
 				{path:'singer/:id',component:()=>import('../components/singer-detail/singer-detail.vue')},
 				{path:'sheet/:id',component:()=>import('../components/recommend-list/recommendList.vue')}
 			]
 		}
 	],
})
