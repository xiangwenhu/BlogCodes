(function (win, undefined) {

    function RouterManager(list, index) {
        if (!(this instanceof RouterManager)) {
            return new RouterManager(arguments)
        }
        this.list = {} || list
        this.index = index

        win.addEventListener('hashchange', function (ev) {
            var pre = ev.oldURL.split('#')[1],
                cur = ev.newURL.split('#')[1],
                preR = this.getByUrlOrName(pre),
                curR = this.getByUrlOrName(cur)
            if (curR) {
                this.loadWithRouter(curR, preR)
            }
        }.bind(this))
    }
    
    RouterManager.prototype = {
        add: function (router, callback) {
            if (typeof router === 'string') {
                router = {
                    path: router,
                    name: router,
                    callback: callback
                }
            }
            this.list[router.name || router.path] = router
        },
        remove: function (name) {
            delete this.list[name]
        },
        get: function (name) {
            return this.getByUrlOrName(name)
        },
        load: function (name) {
            if (!name) {
                name = location.hash.slice(1)
            }
            var r = this.getByUrlOrName(name)
            this.loadWithRouter(r, null)
        },
        loadWithRouter(cur, pre) {
            cur && cur.callback && cur.callback(cur, pre)
        },
        getByUrlOrName: function (nameOrUrl) {
            var r = this.list[nameOrUrl]
            if (!r) {
                r = Object.values(this.list).find(rt => rt.name === nameOrUrl || rt.path === nameOrUrl)
            }
            return r
        }
    }
    RouterManager.prototype.use = RouterManager.prototype.add

    win.Router = RouterManager

})(window, undefined)


var router = new Router()
router.use('/m1', function (r) {
    ajax(r.path.slice(1), function (res) {
        content.innerHTML = res
    })
})
router.use('/m11', function (r) {
    ajax(r.path.slice(1), function (res) {
        content.innerHTML = res
    })
})
router.use('/m12', function (r) {
    ajax(r.path.slice(1), function (res) {
        content.innerHTML = res
    })
})
router.use('/m2', function (r) {
    ajax(r.path.slice(1), function (res) {
        content.innerHTML = res
    })
})
router.use('/m3', function (r) {
    ajax(r.path.slice(1), function (res) {
        content.innerHTML = res
    })
})

















function ajax(id, callback) {
    callback(
        {
            'm1': '菜单一的主区域内容',
            'm11': '菜单一一的主区域内容',
            'm12': '菜单一二的主区域内容',
            'm2': '菜单二的主区域内容',
            'm3': '菜单三的主区域内容'
        }[id] || '404 Not Found!')
}