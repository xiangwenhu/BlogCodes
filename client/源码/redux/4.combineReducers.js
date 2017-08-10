
let { createStore, bindActionCreators, combineReducers } = self.Redux

//默认值
let todoList = [{ 'id': 999 }], couter = 1
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
},
    couterReducer = function (state = couter, action) {
        switch (action.type) {
            case 'add':
                return ++state
            case 'decrease':
                return --state
            default:
                return state
        }
    }


// 合并recuder
var reducer = combineReducers({ todoReducer, couterReducer })
//创建store
let store = createStore(reducer,{
    todoReducer: todoList,
    couterReducer: couter
})

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
console.log('todo add')
boundActions.add({
    id: 12,
    content: '睡觉觉'
})

let boundAdd = bindActionCreators(actionCreaters.add, store.dispatch)
console.log('todo add')
boundAdd({
    id: 13,
    content: '陪媳妇'
})


let counterActionCreater = {
    add: function () {
        return {
            type: 'add'
        }
    },
    decrease: function () {
        return {
            type: 'decrease'
        }
    }
}

let boundCouterActions = bindActionCreators(counterActionCreater, store.dispatch)

console.log('counter add:')
boundCouterActions.add()
console.log('counter decrease:')
boundCouterActions.decrease()