const COMMON_PARAMS = '&g_tk=5381&loginUin=0&hostUin=0&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0'
const FCG_BIN = 'https://c.y.qq.com/v8/fcg-bin'

//搜索歌手
const URL_SEARCH_SINGER = `${FCG_BIN}/v8.fcg?channel=singer&page=list&format=json${COMMON_PARAMS}`
//相似歌手
const URL_SINGER_SIM = `${FCG_BIN}/fcg_v8_simsinger.fcg?utf8=1&format=jsonp${COMMON_PARAMS}`
//歌手的歌曲
const URL_SINGER_SONGS = `${FCG_BIN}/fcg_v8_singer_track_cp.fcg?format=json&order=listen&songstatus=1${COMMON_PARAMS}`
//歌手的专辑
const URL_SINGER_ALBUM = `${FCG_BIN}/fcg_v8_singer_album.fcg?format=json&order=time${COMMON_PARAMS}`
//专辑信息
const URL_ALBUM_INFO = `${FCG_BIN}/fcg_v8_album_info_cp.fcg?${COMMON_PARAMS}`
//热门搜索关键字
const HOT_KEY = `${FCG_BIN}/gethotkey.fcg?${COMMON_PARAMS}`


