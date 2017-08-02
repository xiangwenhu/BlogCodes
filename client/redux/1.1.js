/* 简单示例 */
let { createStore } = self.Redux

//默认state
let todoList = []
// reducer
let todoReducer = function (state, action) {
    switch (action.type) {
        case 'add':
            return [...state, action.todo]
        case 'delete':
            return state.filter(todo => todo.id !== action.id)
        default:
            return state
    }
}

//创建store
let store = createStore(todoReducer,todoList)

//订阅
function subscribe1Fn() {
    console.log(store.getState())
}
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
    type: 'add',
    todo: {
        id: 3,
        content: '打游戏'
    }
})