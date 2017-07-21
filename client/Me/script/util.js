(
    function (win) {
        win.$ = {
            get scrollTop() {
                return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            },           
            query(seletor, context) {
                return (context || document).querySelector(seletor)
            },
            queryAll(seletor, context) {
                return (context || document).querySelectorAll(seletor)
            }
        }
    }
)(window)