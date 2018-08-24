import {playMode} from '../common/js/config.js'
import {shuffle} from '../common/js/util.js'

function findIndex(arr,song){
	return arr.findIndex(item=>{
		return item.id===song.id
	})
}

export const selectPlay=function({commit,state},{list,index}){
	commit('setSequenceList',list)
	if(state.mode===playMode.random){
		var randomList=shuffle(list)
		commit('setPlayList',randomList)
		index=findIndex(randomList,list[index])
	}else{
		commit('setPlayList',list)
	}
	commit('setCurrentIndex',index)
	commit('setFullScreen',true)
	commit('setPlayingState',true)
}

export const sequencePlay =function({commit},{list}){
	commit('setPlayMode',playMode.sequence)
	commit('setSequenceList',list)
	commit('setPlayList',list)
	commit('setCurrentIndex',0)
	commit('setFullScreen',true)
	commit('setPlayingState',true)
}

export const deleteSong =function ({commit,state},song){
	var playList =state.playList.slice()
	var sequenceList =state.sequenceList.slice()
	var currentIndex=state.currentIndex

	var pIndex=findIndex(playList,song)
	playList.splice(pIndex,1)
	var sIndex=findIndex(sequenceList,song)
	sequenceList.splice(sIndex,1)

	if(currentIndex>pIndex || currentIndex===pIndex.length){
		currentIndex--
	}

	commit('setPlayList',playList)
	commit('setSequenceList',sequenceList)
	commit('setCurrentIndex',currentIndex)

	var playState =playList.length>0
	commit('setPlayingState',playState)
	
}

export const removeAll =function ({commit,state}){
	commit('setPlayList',[])
	commit('setSequenceList',[])
	commit('setCurrentIndex',-1)
	commit('setPlayingState',false)
}