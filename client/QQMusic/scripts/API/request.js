// 依赖  API/consts.js, API/request.js
function request(url, options = {}) {
    let realUrl = `/api/common/get?url=${encodeURIComponent(url)}`
    return fetch(realUrl, options)
}
