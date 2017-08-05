// thunk 中间件
let thunk = ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
        return action(dispatch, getState)
    }
    return next(action)
}
// logger中间件
let logger = ({ dispatch, getState }) => next => action => {
    console.log('next:之前state', getState())
    let result = next(action)
    console.log('next:之前state', getState())
    return result
}

let { createStore, applyMiddleware } = self.Redux
let todoList = [] // 默认值
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
let addAsync = content => (dispatch) => {
    setTimeout(function () {
        dispatch({
            type: 'add',
            todo: {
                id: new Date().getTime(),
                content
            }
        })
    }, 1000)
}

let store = createStore(todoReducer, applyMiddleware(logger)),
    subscribe1Fn = function () {
        console.log(store.getState())
    }

// 订阅
let sub = store.subscribe(subscribe1Fn)

store.dispatch(addAsync('异步添加的todo哦'))
store.dispatch({
    type: 'add',
    todo: {
        id: 1,
        content: '学习redux'
    }
})