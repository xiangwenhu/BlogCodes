// thunk 中间件
let thunk = function ({ dispatch, getState }) {
    return function (next) {
        return function (action) {
            if (typeof action === 'function') {
                return action(dispatch, getState)
            }
            console.log('thunk next 之前的state',getState())
            let result =  next(action)
            console.log('thunk next 之后的state',getState())
            return result
        }
    }
}
// logger中间件
let logger = function ({ dispatch, getState }) {
    return function (next) {
        return function (action) {
            console.log('logger next 之前state', getState())
            let result = next(action)
            console.log('logger next 之后state', getState())
            return result
        }
    }
}

middleware(middlewareAPI)之后 

thunk = function (next) {
    return function (action) {
        if (typeof action === 'function') {
            return action(dispatch, getState)
        }
        console.log('thunk next 之前的state',getState())
        let result =  next(action)
        console.log('thunk next 之后的state',getState())
        return result
    }
}

logger = function (next) {
    return function (action) {
        console.log('logger next 之前state', getState())
        let result = next(action)
        console.log('logger next 之后state', getState())
        return result
    }
}


compose(...chain)  也就是  funcs.reduce((a, b) => (...args) => a(b(...args))), 此时 funcs = [thunk, logger]


compose(...chain) == (...args) => a(b(...args))  == 
function (...args) {
    return thunk(logger(...args)) //logger(...args) 即为 thunk = function(next) {.....}的next参数
}
== 
// logger(...args) 是作为thunk的next参数，那么就等同于
function (...args){
     return function (action) {
        if (typeof action === 'function') {
            return action(dispatch, getState)
        }
        console.log('thunk next 之前的state',getState())
        let result =  next(action) ==  logger(...args)(action)
        console.log('thunk next 之后的state',getState())
        return result       
    }
}

== 
//logger(...args)会把参数全部扩展，而logger本身只需要一个next参数 ， 所以args[0] 是作为 logger的next参数
function (...args){
     return function (action) {
        if (typeof action === 'function') {
            return action(dispatch, getState)
        }
        console.log('thunk next 之前的state',getState())
        let result =  
            next(action) = 
            logger(...args)(action) = 
            function (action) {
                console.log('logger next 之前state', getState())
                let result = next(action) == args[0](action)
                console.log('logger next 之后state', getState())
                return result
            }
        console.log('thunk next 之后的state',getState())
        return result        
         
     }
}

compose(...chain) = function (...args){
     return function (action) {
        if (typeof action === 'function') {
            return action(dispatch, getState)
        }
        console.log('thunk next 之前的state',getState())
        let result =  function (action) {
                console.log('logger next 之前state', getState())
                let result = next(action) == args[0](action)
                console.log('logger next 之后state', getState())
                return result
            }
        console.log('thunk next 之后的state',getState())
        return result      
         
     }
}

// 这个时候 ...args[0] = store.dispatch
compose(...chain)(store.dispatch) = function (action) {
    if (typeof action === 'function') {
        return action(dispatch, getState)
    }
    console.log('thunk next 之前的state',getState())
    let result =  function (action) {
            console.log('logger next 之前state', getState())
            let result = next(action) = args[0](action) = store.dispatch(action)
            console.log('logger next 之后state', getState())
            return result
        }
    console.log('thunk next 之后的state',getState())
    return result  
}

而这个最后的函数覆盖原来的 store.dispatch, 最原始的store.dispatch已经被存起来了，
也就是外面调用的store.dispatch是被加工过的，而内部调用的还是那个真实的

再看看 最后这个函数的, 假如store.dispatch(action) （此时action为一个对象）
会输出 
thunk next 之前的state
logger next 之前state
logger next 之后state
thunk next 之后的state

这就验证了，添加中间件后的执行顺讯。
thunk ->  logger -> 内部真实的disptach ->logger -> thunk


