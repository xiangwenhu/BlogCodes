
let { createStore, bindActionCreators } = self.Redux

//默认state
let todoList = []
// reducer
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

//创建store
let store = createStore(todoReducer)

//订阅
function subscribe1Fn() {
    // 输出state
    console.log(store.getState())
}
store.subscribe(subscribe1Fn)

// action creater
let actionCreaters = {
    add: function (todo) { //添加
        return {
            type: 'add',
            todo
        }
    }, delete: function (id) {
        return {
            type: 'delete',
            id
        }
    }
}

let boundActions = bindActionCreators(actionCreaters, store.dispatch)
boundActions.add({
    id: 12,
    content: '睡觉觉'
})

let boundAdd = bindActionCreators(actionCreaters.add, store.dispatch)
boundAdd({
    id: 13,
    content: '陪媳妇'
})