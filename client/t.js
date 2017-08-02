export const ActionTypes = {
    INIT: '@@redux/INIT'
}
export default function createStore(reducer, preloadedState, enhancer) {
    // 初始化参数
    let currentReducer = reducer      // 整个reducer
    let currentState = preloadedState //当前的state, getState返回的值就是他，
    let currentListeners = []         // 当前的订阅，搭配 nextListeners
    let nextListeners = currentListeners  //下一次的订阅 ,搭配currentListeners
    let isDispatching = false  //是否处于 dispatch action 状态中
    
    // 内部方法
    function ensureCanMutateNextListeners() { }  // 确保currentListeners 和 nextListeners 是不同的引用
    function getState() { }    // 获得当前的状态，返回的就是currentState
    function subscribe(listener) { }  //订阅监听，返回一个函数，执行该函数，取消监听
    function dispatch(action) { }    // dispacth action
    function replaceReducer(nextReducer) { }  // 替换 reducer
    function observable() { }   //不知道哈哈
    
    //初始化state
    dispatch({ type: ActionTypes.INIT })
   
    //返回方法
    return {
        dispatch,
        subscribe,
        getState,
        replaceReducer,
        [$$observable]: observable
    }
}