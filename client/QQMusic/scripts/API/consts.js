const COMMON_PARAMS = 'g_tk=5381&loginUin=0&hostUin=0&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0'
const FCG_BIN = 'https://c.y.qq.com/v8/fcg-bin'
const FCGI_BIN = 'https://c.y.qq.com/soso/fcgi-bin'
const FCGI_BIN_SPCLOUD = 'https://c.y.qq.com/splcloud/fcgi-bin'
const FCG_BIN_QZONE = 'https://c.y.qq.com/qzone/fcg-bin'
const FCG_BIN_MUSIC_CALL = 'https://c.y.qq.com/musichall/fcgi-bin'
const FCG_BIN_MV = 'https://c.y.qq.com/mv/fcgi-bin'

//搜索歌手
const URL_SEARCH_SINGER = `${FCG_BIN}/v8.fcg?channel=singer&page=list&format=json&${COMMON_PARAMS}`
//相似歌手
const URL_SINGER_SIM = `${FCG_BIN}/fcg_v8_simsinger.fcg?utf8=1&format=jsonp&${COMMON_PARAMS}`
//歌手的歌曲
const URL_SINGER_SONGS = `${FCG_BIN}/fcg_v8_singer_track_cp.fcg?format=json&order=listen&songstatus=1&${COMMON_PARAMS}`
//歌手的专辑
const URL_SINGER_ALBUM = `${FCG_BIN}/fcg_v8_singer_album.fcg?format=json&order=time&${COMMON_PARAMS}`
//歌手描述
const URL_SINGER_DESC = `${FCGI_BIN_SPCLOUD}/fcg_get_singer_desc.fcg?utf8=1&outCharset=utf-8&format=xml`



//专辑的分类信息和默认首页
const URL_ALBUM_LIBRARY = `${FCG_BIN}/album_library?${COMMON_PARAMS}&format=json`
//专辑信息
const URL_ALBUM_INFO = `${FCG_BIN}/fcg_v8_album_info_cp.fcg?${COMMON_PARAMS}`


//热门搜索关键字
const URL_HOT_KEY = `${FCGI_BIN_SPCLOUD}/gethotkey.fcg?${COMMON_PARAMS}`
//搜索结果-单曲
const URL_SEARCH_CLIENT_SONG = `${FCGI_BIN}/client_search_cp?format=json&ct=24&qqmusic_ver=1298&new_json=1&t=0&aggr=1&cr=1&catZhida=1&lossless=0&flag_qc=0&${COMMON_PARAMS}`
//搜索结果-mv
const URL_SEARCH_CLIENT_MV = `${FCGI_BIN}/client_search_cp?ct=24&format=json&qqmusic_ver=1298&remoteplace=txt.yqq.mv&aggr=0&catZhida=1&lossless=0&sem=1&t=12&${COMMON_PARAMS}`
//搜素专辑
const URL_SEARCH_CLIENT_ALBUM = `${FCGI_BIN}/client_search_cp?ct=24&format=json&qqmusic_ver=1298&remoteplace=txt.yqq.album&aggr=0&catZhida=1&lossless=0&sem=10&t=8&${COMMON_PARAMS}`
//搜索后的智能搜索
const URL_SEARCH_SMARTBOX = `${FCGI_BIN_SPCLOUD}/smartbox_new.fcg?is_xml=0&format=json&${COMMON_PARAMS}`


//排行榜分类
const URL_TOPLIST_OPT = `${FCG_BIN}/fcg_v8_toplist_opt.fcg?page=index&format=html&tpl=macv4&v8debug=1`

const URL_TOPLIST_LIST = `${FCG_BIN}/fcg_v8_toplist_cp.fcg?tpl=3&page=detail&type=top&${COMMON_PARAMS}`

//节目的vkey
const URL_VKEY = `https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?cid=205361747&uin=0&guid=488797456&${COMMON_PARAMS}`


//歌单的分类
const URL_DISS_TAG_CONF = `${FCGI_BIN_SPCLOUD}/fcg_get_diss_tag_conf.fcg?format=json&${COMMON_PARAMS}`
//按照分类查询歌单
const URL_DISS_BYTAG = `${FCGI_BIN_SPCLOUD}/fcg_get_diss_by_tag.fcg?format=json&sin=0&ein=29&${COMMON_PARAMS}`
//获取某个歌单的内容
const URL_DISS_INFO = `${FCG_BIN_QZONE}/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&format=json&${COMMON_PARAMS}`
//相似歌单
const URL_DISS_SIMILAR = `${FCG_BIN_MUSIC_CALL}/fcg_similar_recomm.fcg?recomtype=2&format=json`



//MV查询 taglist=1 有标签
const URL_MV_BYTAG = `${FCG_BIN}/getmv_by_tag?utf8=1&otype=json&format=json&${COMMON_PARAMS}`
// MV信息
const URL_MV_INFO = `${FCG_BIN_MV}/fcg_getmvinfo.fcg?format=json&${COMMON_PARAMS}`
//相似MV
const URL_MV_SIMILAR = `${FCG_BIN_MV}/fcg_getmvlist.fcg?reqtype=1&cid=205360328&format=json&${COMMON_PARAMS}`

//首页推荐
const URL_RRCOM = `${FCG_BIN}/fcg_first_yqq.fcg?format=json&tpl=v12&page=other&${COMMON_PARAMS}`


//歌曲歌词
const URL_SONG_LYR = `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?${COMMON_PARAMS}&format=json`


const MusicJsonCallback = function (data) {
    return data
}



