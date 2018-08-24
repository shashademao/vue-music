import { playMode } from '../common/js/config.js'

const state = {
	singer:{},
	playing:false,
	fullScreen:false,
	playList:[],
	sequenceList:[],
	mode:playMode.sequence,
	currentIndex:-1,
	recommendSheet:{},
	rankList:{},
}

export default state