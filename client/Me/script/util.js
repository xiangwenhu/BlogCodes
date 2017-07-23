(function (win) {

    var dom = document,
        domEl = dom.documentElement
    domEl.requestFullscreen = domEl.requestFullscreen || domEl.mozRequestFullScreen || domEl.webkitRequestFullScreen || domEl.msRequestFullscreen
    dom.exitFullscreen = dom.exitFullscreen || dom.mozCancelFullScreen || dom.webkitCancelFullScreen || dom.msExitFullscreen

    var screen = {
        fullScreen() {
            return domEl.requestFullscreen && domEl.requestFullscreen()
        },
        exitFullscreen() {
            return dom.exitFullscreen && dom.exitFullscreen()
        },
        get enabled() {
            return dom.fullscreenEnabled || dom.mozFullScreenEnabled || dom.webkitFullscreenEnabled
        },
        get isFullScreen() {
            return dom.fullscreen || dom.mozFullScreen || dom.webkitIsFullScreen || dom.msFullscreenElement
        },
        get elment() {
            return dom.fullscreenElement || dom.mozFullScreenElement || dom.webkitFullscreenElement
        }
    }

    var file = {
        read(blob, method) {
            return new Promise((resolve, reject) => {
                var reader = new FileReader()
                var ps = [].slice.call(arguments, 2)
                ps.unshift(blob)
                reader[method].apply(reader, ps)
                reader.onload = function () {
                    return resolve(reader.result)
                }
                reader.onerror = function (err) {
                    return reject(err)
                }
                reader.onabort = function () {
                    return reject(new Error('读取被中断'))
                }
            })
        },
        readAsArrayBuffer(blob) {
            return this.read(blob, 'readAsArrayBuffer')
        },
        readAsBinaryString(blob) {
            return this.read(blob, 'readAsBinaryString')
        },
        readAsDataURL(blob) {
            return this.read(blob, 'readAsDataURL')
        },
        readAsText(blob, encoding) {
            return this.read(blob, 'readAsText', encoding || 'gb2312')
        }
    }


    win.$ = {
        get scrollTop() {
            return window.pageYOffset || dom.documentElement.scrollTop || dom.body.scrollTop
        },
        query(seletor, context) {
            return (context || dom).querySelector(seletor)
        },
        queryAll(seletor, context) {
            return (context || dom).querySelectorAll(seletor)
        },
        toBase64(str) {
            return win.btoa ? win.btoa(unescape(encodeURIComponent(str))) : str
        },
        toUtf8(str) {
            return win.atob ? decodeURIComponent(escape(win.atob(str))) : str
        },
        screen,
        f: file
    }
}
)(window)