function request(url, options = {}) {
    let realUrl = `/api/common/get?url=${encodeURIComponent(url)}`
    return fetch(realUrl, options)
}