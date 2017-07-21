(function (win) {

    var dom = document,
        domEl = dom.documentElement
    domEl.requestFullscreen = domEl.requestFullscreen || domEl.mozRequestFullScreen || domEl.webkitRequestFullScreen || domEl.msRequestFullscreen
    dom.exitFullscreen = dom.exitFullscreen || dom.mozCancelFullScreen || dom.webkitCancelFullScreen || dom.msExitFullscreen

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
        screen: {
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
    }
}
)(window)