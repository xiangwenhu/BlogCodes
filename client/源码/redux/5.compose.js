function compose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg
    }

    if (funcs.length === 1) {
        return funcs[0]
    }
    return funcs.reduce(function (a, b) {
        return function (...args) {
            return a(b(...args))
        }
    })
}

var fn1 = val => 'fn1-' + val
var fn2 = val => 'fn2-' + val 
var fn3 = val => 'fn3-' + val 

compose(fn1,fn2,fn3)('测试')