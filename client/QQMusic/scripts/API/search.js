// 依赖  API/consts.js, API/request.js
const Search = {
    //歌手搜索
    singers: function (type = 'all_all', hot = 'all', pagenum = 1, pagesize = 100) {
        let url = `${URL_SEARCH_SINGER}&key=${type}_${hot}&pagenum=${pagenum}&pagesize=${pagesize}`
        return request(url)
    },
    //专辑信息  
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
    searchSongs(w, p = 1, n = 30) {
        let url = `${URL_SEARCH_CLIENT_SONG}&remoteplace=txt.yqq.center&w=${encodeURIComponent(w)}&p=${p}&n=${n}`
        return request(url)
    },
    /**
     * 执行搜索后搜索mv
     * @param {*} w 关键字
     * @param {*} p 页面
     * @param {*} n 特大小
     */
    searchMVs(w, p = 1, n = 30) {
        let url = `${URL_SEARCH_CLIENT_MV}&w=${encodeURIComponent(w)}&p=${p}&n=${n}`
        return request(url)
    },
    //执行搜索后搜索专辑
    searchAlbums(w, p = 1, n = 30) {
        let url = `${URL_SEARCH_CLIENT_ALBUM}&w=${encodeURIComponent(w)}&p=${p}&n=${n}`
        return request(url)
    },

    /**
     * 执行搜索后的智能搜索
     * @param {*} key 关键字
     */
    smartBox(key) {
        let url = `${URL_SEARCH_SMARTBOX}&key=${encodeURIComponent(key)}`
        return request(url)
    },

    /**
     * 
     * @param {*} cmd firstpage 返回分类信息 /get_album_info 不返回分类信息
     * @param {*} page 页码
     * @param {*} pagesize 页大小 
     * @param {*} sort   1 最新 / 2 最热
     * @param {*} language  语种
     * @param {*} genre  流派
     * @param {*} year 年代
     * @param {*} pay  价格  1 免费 / 2 免费
     * @param {*} type  类别  专辑/演唱会等
     * @param {*} company  唱片公司 华纳唱片/环球唱片等
     */
    albumLib(cmd = 'firstpage', page = 0, pagesize = 20, sort = 1, language = -1, genre = 0, year = 1, pay = 0, type = -1, company = -1) {
        let url = `${URL_ALBUM_LIBRARY}&cmd=${cmd}&page=${page}&pagesize=${pagesize}&sort=${sort}&language=${language}&genre=${genre}&year=${year}&pay=${pay}&type=${type}&company=${company}`
        return request(url)
    },

    /**
     * 通过标签搜索MV
     * @param {*} area  区域
     * @param {*} tag   类型 官方版/舞蹈等
     * @param {*} year  年份
     * @param {*} taglist  是否带标签， 1带/0不带
     * @param {*} pageno  页码
     * @param {*} pagecount  也大小
     */
    mvByTag(area = 0, tag = 0, year = 0, type = 2,taglist = 1, pageno = 0, pagecount = 20) {
        let url = `${URL_MV_BYTAG}&area=${area}&tag=${tag}&year=${year}&type=${type}&taglist=${taglist}&pageno=${pageno}&pagecount=${pagecount}&_=${Math.random().toFixed(16)}`
        return request(url)
    }


}