import compose from './compose'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)
    let dispatch = store.dispatch  // 存旧的dispatch
    let chain = []

      /*
      中间件标准格式
      let logger1 = ({ dispatch, getState }) => next => action => {
        ...     
        let result = next(action)
        ...
        return result
      }
      */

     /*
      构建参数 ({dispatch, getState})
     */
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }

    /*
      middleware(middlewareAPI)之后是这样的格式 
      let m =  next => action => {
        ...     
        let result = next(action)
        ...
        return result
      }
    */
    chain = middlewares.map(middleware => middleware(middlewareAPI))

    //改写store.dispacth
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
