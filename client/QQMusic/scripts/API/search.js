// 依赖  API/consts.js, API/request.js
const Search = {
    singers: function (type = 'all_all', hot = 'all', pagenum = 1,pagesize = 100) {
        let url = `${URL_SEARCH_SINGER}&key=${type}_${hot}&pagenum=${pagenum}&pagesize=${pagesize}`
        return request(url)
    },
    albumInfo:function(albummid){
        let url = `${URL_ALBUM_INFO}&albummid=${albummid}`
        return request(url)
    }
}