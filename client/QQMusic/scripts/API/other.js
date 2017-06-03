// 依赖  API/consts.js, API/request.js
const Other = {
    //热搜关键字
    hotkey: function () {
        let url = `${URL_HOT_KEY}`
        return request(url)
    }
}