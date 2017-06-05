// 依赖 API/request.js

class Singer {

    constructor(singermid) {
        this.singermid = singermid //歌手id
    }

    //相似歌手
    simsinger(start = 0, num = 5) {
        let url = `${URL_SINGER_SIM}&singer_mid=${this.singermid}&start=${start}&num=${num}`
        return request(url)
    }

    //歌曲
    songs(begin = 0, num = 30) {
        let url = `${URL_SINGER_SONGS}&singermid=${this.singermid}&begin=${begin}&num=${num}`
        return request(url)
    }

    //专辑
    albums(begin = 0, num = 30) {
        let url = `${URL_SINGER_ALBUM}&singermid=${this.singermid}&begin=${begin}&num=${num}`
        return request(url)
    }

    //歌手描述
    desc() {
        let r = new Date().getTime(),
            url = `${URL_SINGER_DESC}&singermid=${this.singermid}&r=${r}`
        return request(url, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                headers: {  
                    referer: 'https://c.y.qq.com/xhr_proxy_utf8.html',
                    'Host': 'y.qq.com',
                    'Origin': 'https://y.qq.com'
                }               
            })
        })
    }
}

