// 依赖  API/consts.js, API/request.js
const Search = {
    singers: function (type = 'all_all', hot = 'all', pagenum = 1, pagesize = 100) {
        let url = `${URL_SEARCH_SINGER}&key=${type}_${hot}&pagenum=${pagenum}&pagesize=${pagesize}`
        return request(url)
    },
    albumInfo: function (albummid) {
        let url = `${URL_ALBUM_INFO}&albummid=${albummid}`
        return request(url)
    },
    /**
     * @param {*w} 关键字
     * @param {*remoteplace}类型  txt.yqq.mv/txt.yqq.album/txt.yqq.center
     * @param {*p} 页码
     * @param {*n} 页大小
     * 返回结果：zhida.type 2：专辑 0：歌曲 1： 歌手
     */
    search(w, remoteplace = 'txt.yqq.center', p = 1, n = 30) {
        let url = `${URL_SEARCH_CLIENT}&remoteplace=${remoteplace}&w=${encodeURIComponent(w)}&p=${p}&n=${n}`
        return request(url)
    }

    
}