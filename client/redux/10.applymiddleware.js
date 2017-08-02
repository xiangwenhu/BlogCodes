/* 简单示例 */

let { createStore, applyMiddleware } = self.Redux


let todoList = []

let todoReducer = function (state = todoList, action) {
    switch (action.type) {
        case 'add':
            return [...state, action.todo]
        case 'delete':
            return state.filter(todo => todo.id !== action.id)
        default:
            return state
    }
}

let logger = ({ dispatch, getState }) => next => action => {
    // 传递前, 执行的代码
    let result = next(action)
    // 传递完, 执行的代码
    return result
}

let logger1 = ({ dispatch, getState }) => next => action => {
    // 传递前, 执行的代码
    let result = next(action)
    // 传递完, 执行的代码
    return result
}

let store = createStore(todoReducer, applyMiddleware(logger, logger1)),
    subscribe1Fn = function () {
        console.log(store.getState())
    }




// 订阅
let sub = store.subscribe(subscribe1Fn)

store.dispatch({
    type: 'add',
    todo: {
        id: 1,
        content: '学习redux'
    }
})


// 取消订阅
sub()

console.log('取消订阅后：')
store.dispatch({
    type: 'increase'
})