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
}

