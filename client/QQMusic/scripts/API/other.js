// 依赖  API/consts.js, API/request.js
const Other = {
    //热搜关键字
    hotkey: function () {
        let url = `${URL_HOT_KEY}`
        return request(url)
    },
    /**
     * 排行分类
     */
    topList() {
        let url = URL_TOPLIST_OPT

        return request(url).then(res => {
            return res.text()
        }).then(content => {
            function jsonCallback(data) {
                return JSON.stringify(data)
            }
            return eval(content)
        })
    },
    /**
     * 排行榜详细数据
     * @param {*} topid id 
     * @param {*} song_begin 开始 
     * @param {*} song_num 结束
     */
    topListList(topid = 4, song_begin = 0, song_num = 30) {
        let today = new Date(), yes = new Date(today.getTime() - 1000 * 60 * 60 * 24),
            date = yes.getFullYear() + '-' + ((yes.getMonth() + 1) + '').padStart(2, '0') + '-' + (yes.getDate() + '').padStart(2, '0'),
            url = `${URL_TOPLIST_LIST}&topid=${topid}&date=${date}&song_begin=${song_begin}&song_num=${song_num}`
        return request(url)
    },

    /**
     * 歌曲的vkey
     * @param {*} songmid 歌曲id
     */
    vkey(songmid) {
        let url = `${URL_VKEY}&songmid=${songmid}&filename=C400${songmid}.m4a`
        return request(url)
    },
    /**
     * 歌单的分类
     */
    dissTagConf() {
        return request(URL_DISS_TAG_CONF)
    },

    /**
     * 按照分类查询歌单
     * @param {*} categoryId  
     * @param {*} sortId  排序 5 推荐 / 2 最新
     * 返回结果 dissid 为歌单编号
     */
    dissByTag(categoryId = 10000000, sortId = 5) {
        let url = `${URL_DISS_BYTAG}&categoryId=${categoryId}&sortId=${sortId}&rnd=${Math.random().toFixed(16)}`
        return request(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                headers: {
                    referer: 'https://y.qq.com/portal/playlist.html',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        })
    },
    /**
     * 按照id获取歌单信息
     * @param {*} disstid 歌单id
     */
    dissInfo(disstid){
        let url = `${URL_DISS_INFO}&disstid=${disstid}`
        return request(url)
    },

    /**
     * 相似歌单
     * @param {*} dissid 歌单id
     * @param {*} maxnum 最大返回条数
     */
    dissSimilar(dissid,maxnum=6){
        let url = `${URL_DISS_SIMILAR}&dissid=${dissid}&maxnum=${maxnum}&_=${new Date().getTime()}`
        return request(url)
    },

    //首页推荐
    RecomList(){       
        let url = `${URL_RRCOM}&rnd=${(Math.random()*Math.pow(10,16)).toFixed(0)}`  
        return request(URL_RRCOM)
    }


}