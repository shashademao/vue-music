function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  var _arr = arr.slice()
  for (var i = 0; i < _arr.length; i++) {
    var j = getRandom(0, i)
    var t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function normalize(list) {
  var songs=[]
  list.forEach(item => {
    var artists = []
    item.ar.forEach(item => {
      artists.push(item.name)
    })
    artists = artists.join('/')
    songs.push({
      id: item.id,
      musicName: item.name,
      artists,
      img: item.al.picUrl,
      duration: item.dt,
    })
  })
  return songs
}
