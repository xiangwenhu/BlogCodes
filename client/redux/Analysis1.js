/* 简单示例 */

let { createStore } = self.Redux


let todoList = []

let couterReducer = function (state = todoList, action) {
    switch (action.type) {
        case 'add':
            return [...state, action.todo]
        case 'delete':
            return state.filter(todo => todo.id !== action.id)
        default:
            return state
    }
}

let store = createStore(couterReducer),
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

store.dispatch({
    type: 'add',
    todo: {
        id: 2,
        content: '吃饭睡觉'
    }
})

store.dispatch({
    type: 'delete',
    id: 2
})

// 取消订阅
sub()

console.log('取消订阅后：')
store.dispatch({
    type: 'increase'
})