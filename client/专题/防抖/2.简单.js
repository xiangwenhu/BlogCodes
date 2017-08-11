var container = document.querySelector('.container')

var count = 0
container.addEventListener('mousemove', debounce(getUserAction, 500, true))

function getUserAction(ev) {
    console.log(ev)
    console.log(this)

    count++
    container.innerText = count
}

function debounce(fn, wait, immediate) {
    var ticket, result
    var debounced = function () {
        var context = this,
            args = arguments

        if (ticket) clearTimeout(ticket)
        if (immediate) {

            var callNow = !ticket
            ticket = setTimeout(function () {
                ticket = null
            }, wait)

            if (callNow) result = fn.apply(context, args)

        } else {
            ticket = setTimeout(function () {
                fn.apply(context, args)
            }, wait)
        }

        return result
    }

    debounced.cancel = function () {
        clearTimeout(ticket)
        ticket = null
    }

    return debounced
}