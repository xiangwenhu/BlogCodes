let { createStore, applyMiddleware } = self.Redux
let { default: promiseMiddleware, PENDING, FULFILLED, REJECTED } = self.ReduxPromiseMiddleware
let thunkMiddleware = ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
        return action(dispatch, getState)
    }
    return next(action)
}

const reducer = (state = {}, action) => {
    switch (action.type) {
        case `GET_POST_${PENDING}`:
            return {
                isPending: true
            }
        case `GET_POST_${FULFILLED}`:
            return {
                body: action.payload
            }
        case `GET_POST_${REJECTED}`:
            return {
                error: action.payload
            }
        default:
            return state
    }
}

const store = applyMiddleware(thunkMiddleware, promiseMiddleware())(createStore)(reducer)


const getPost = id => ({
    type: 'GET_POST',
    payload: new Promise((resolve, reject) => {
        setTimeout(() => reject({
            id,
            content: `test content : ${id}`
        }), 1000)
    })
})

const initialize = () => {
    const mount = document.querySelector('#mount')

    const button = document.querySelector('#load')
    button.addEventListener('click', () => {
        store.dispatch(getPost(1))
            .catch(action => {
                console.log(action)
            })
    })

    const render = (state = {}) => {
        if (state.isPending) {
            mount.innerHTML = 'Loading post...'
        } else if (state.error) {
            mount.innerHTML = '请求发生错误......'
        }
        else if (state.body) {
            mount.innerHTML = typeof state.body === 'string' ? state.body : JSON.stringify(state.body)
        }
    }

    render()
    store.subscribe(() => render(store.getState()))
}

initialize()