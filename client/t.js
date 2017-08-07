// thunk 中间件
let thunk = function ({ dispatch, getState }) {
    return function (next) {
        return function (action) {
            if (typeof action === 'function') {
                return action(dispatch, getState)
            }
            return next(action)
        }
    }
}
// logger中间件
let logger = function ({ dispatch, getState }) {
    return function (next) {
        return function (action) {
            console.log('next:之前state', getState())
            let result = next(action)
            console.log('next:之前state', getState())
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
        return next(action)
    }
}

logger = function (next) {
    return function (action) {
        console.log('next:之前state', getState())
        let result = next(action)
        console.log('next:之前state', getState())
        return result
    }
}


compose(...chain)  也就是  funcs.reduce((a, b) => (...args) => a(b(...args))), 此时 funcs = [thunk, logger]

var result = function (...args) {
    thunk(logger(...args))
}
这里要理解rest参数和扩展运算符
这对情侣的作用就是原来有多少个参数传入，我到执行的时候又分解成原来的参数
第一个...args是把传入存入名为args的数组里面，
第二个...args是把数组又逆向还原为 a,b,c的形式

logger本身只需要一个参数next，看外围的调用  compose(...chain)(store.dispatch)，logger最里面的next就等于store.dispatch 


l = logger(...args)  ==   function (action) {
                    console.log('next:之前state', getState())
                    let result = next(action)
                    console.log('next:之前state', getState())
                    return result
                    }


thunk(logger(...args)) == thunk(l) ==  function (action) {
                                        if (typeof action === 'function') {
                                            return action(dispatch, getState)
                                        }
                                        return function (action) {
                                            console.log('next:之前state', getState())
                                            let result = next(action) // 调用的第一个参数
                                            console.log('next:之前state', getState())
                                            return result
                                        }
                                      }


 compose(...chain)(store.dispatch)

 
thunk(logger(...args)) == thunk(l) ==  function (action) {
                                        if (typeof action === 'function') {
                                            return action(dispatch, getState)
                                        }
                                        return function (action) {
                                            console.log('next:之前state', getState())
                                            let result = store.dispatch(action) 
                                            console.log('next:之前state', getState())
                                            return result
                                        }
                                      }

当然因为闭包的原因， getState, dispatch 都是可以直接调用的