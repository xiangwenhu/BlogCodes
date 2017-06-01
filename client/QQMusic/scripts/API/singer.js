// 依赖 API/request.js
const searchBaseUrl = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg?channel=singer&page=list&pagesize=100&pagenum=1&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0'
const simBaseUrl = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_simsinger.fcg?utf8=1&start=0&num=5&g_tk=5381&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0'
const Singer = {
    search: function (type = 'all_all', hot = 'all') {
        let url = `${searchBaseUrl}&key=${type}_${hot}`
        return request(url)
    },
    simsinger: function (singermid) {
        let url = `${simBaseUrl}&singer_mid=${singermid}`
        return request(url)
    }
}
