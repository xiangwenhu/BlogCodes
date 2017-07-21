let _contents = ['home', 'works', 'technology', 'tools', 'contact'].map(v => ({
    el: $.query('.' + v),
    in: false,
    selector: v
})), scrollDown = true

let el_menus = $.queryAll('.right nav a'),
    el_nav = $.query('.right nav'),
    el_fullScreen = $.query('.header .fullScreen')


if (document.addEventListener) {
    document.addEventListener('DOMMouseScroll', mouseScroll, false);
}
window.onmousewheel = document.onmousewheel = mouseScroll

window.onscroll = function () {
    //第一次进入的动画
    tabAnimate()
    //滚动时切换菜单
    changeTab()
}

el_nav.addEventListener('click', function (ev) {
    var el = ev.target, index = el.getAttribute('data-index')
    if (index) {
        var acEl = document.querySelector('.right nav a.active')
        if (acEl) {
            acEl.classList.remove('active')
        }
        _contents[~~index].el.scrollIntoView()
        _contents[~~index].el.classList.add('active')
    }
})

el_fullScreen.addEventListener('click', function () {
    if (!$.screen.isFullScreen) {
        $.screen.fullScreen()
        this.innerText = '退出全屏'
    } else {
        this.innerText = '全屏'
        $.screen.exitFullscreen()
    }
})

// 首次进入的童话效果
var tabAnimate = function () {
    //如果全部动画过，不需要进行动画
    if (!_contents.find(m => !m.in)) {
        return
    }
    // 检查动画
    _contents.forEach(m => {
        if (!m.in && m.el.getBoundingClientRect().top <= document.body.clientHeight) {
            m.el.classList.add(m.selector + '-animate')
            m.in = true
            console.log(' i am in' + m.el.classList.toString(), m.el.getBoundingClientRect().top, document.body.clientHeight)
        }
    })
}

// 滚动的时候切换Tab
var changeTab = function () {
    // 往下滚动，检查最后一个匹配的
    if (scrollDown) {
        _contents.forEach((m, index) => {
            if (m.el.getBoundingClientRect().top <= document.body.clientHeight) {
                var acEl = document.querySelector('.right nav a.active')
                if (acEl) {
                    acEl.classList.remove('active')
                }
                el_menus[index].classList.add('active')
            }
        })
        if (!document.querySelector('.right nav a.active')) {
            el_menus[0].classList.add('active')
        }

    } else {
        // 往上滚动，反过来检查
        var scrollTop = $.scrollTop
        for (var i = _contents.length - 1; i >= 0; i--) {
            var m = _contents[i]
            if (m.el.getBoundingClientRect().bottom > scrollTop) {
                var acEl = document.querySelector('.right nav a.active')
                if (acEl) {
                    acEl.classList.remove('active')
                }
                el_menus[i].classList.add('active')
            }
        }
        if (!document.querySelector('.right nav a.active')) {
            el_menus[0].classList.add('active')
        }
    }
}

function mouseScroll(e) {
    if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件      
        scrollDown = e.wheelDelta < 0
    } else if (e.detail) {  //Firefox滑轮事件  
        scrollDown = e.detail > 0
    }
}