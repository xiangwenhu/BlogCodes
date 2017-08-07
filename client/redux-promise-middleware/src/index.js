import isPromise from './isPromise';  // 判断是不是promise对象

export const PENDING = 'PENDING';    //执行中状态后缀
export const FULFILLED = 'FULFILLED'; //成功状态后缀
export const REJECTED = 'REJECTED';  //失败状态后缀

const defaultTypes = [PENDING, FULFILLED, REJECTED];

/**
 * @function promiseMiddleware
 * @description
 * @returns {function} thunk
 */
export default function promiseMiddleware(config = {}) {
  const promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypes; // 自定义状态后缀

  return ref => {   // ref = {disptach,getState}，每个中间件都这样  ({dispatch,getState}) => next => action =>.....
    const { dispatch } = ref;

    return next => action => {  // 每个中间件都这样  ({dispatch,getState}) => next => action =>.....
      if (action.payload) {  // payload不为空
        if (!isPromise(action.payload) && !isPromise(action.payload.promise)) {  // action.payload不是promise并且action.payload.promise不为空 ，进入下一个中间件,如果本身就是最后一个中间件,next = store.dispatch
          return next(action);
        }
      } else { //payload为空，进入下一个中间件,如果本身就是最后一个中间件,next = store.dispatch
        return next(action);
      }

      // 解构必要的属性
      const { type, payload, meta } = action;

      // 获得各种action type的后缀
      const [
        _PENDING,
        _FULFILLED,
        _REJECTED
      ] = promiseTypeSuffixes;

      /**
       * @function getAction
       * @description Utility function for creating a rejected or fulfilled
       * flux standard action object.
       * @param {boolean} Is the action rejected?
       * @returns {object} action
       */
      const getAction = (newPayload, isRejected) => ({   //获得action
        type: `${type}_${isRejected ? _REJECTED : _FULFILLED}`,  // 这里的type再30行被存起来了，如果拒绝等于 type + _REJECTED(33左右解构)，反之等于  type + _FULFILLED
        ...((newPayload === null || typeof newPayload === 'undefined') ? {} : {  // 对象解构，获得payload
          payload: newPayload
        }),
        ...(meta !== undefined ? { meta } : {}), // 对象解构，获得meta, 30行解构
        ...(isRejected ? {     // // 对象解构，获得error, 30行解构
          error: true
        } : {})
      });

      /**
       * Assign values for promise and data variables. In the case the payload
       * is an object with a `promise` and `data` property, the values of those
       * properties will be used. In the case the payload is a promise, the
       * value of the payload will be used and data will be null.
       */
      let promise;
      let data;

      //依据不同情况，会的 promise和 data    
      if (!isPromise(action.payload) && typeof action.payload === 'object') {
        promise = payload.promise;
        data = payload.data;
      } else {
        promise = payload;
        data = undefined;
      }

      /**
       * First, dispatch the pending action. This flux standard action object
       * describes the pending state of a promise and will include any data
       * (for optimistic updates) and/or meta from the original action.
       */
      next({   // 进入 pending状态
        type: `${type}_${_PENDING}`,
        ...(data !== undefined ? { payload: data } : {}),
        ...(meta !== undefined ? { meta } : {})
      });

      /*
       * @function transformFulfill
       * @description Transforms a fulfilled value into a success object.
       * @returns {object}
       */
      const transformFulfill = (value = null) => {  // 返回成功的action， value = promise resolve(data)返回的数据
        const resolvedAction = getAction(value, false); // false 表示没有失败
        return { value, action: resolvedAction }; //返回action
      };

      /*
       * @function handleReject
       * @description Dispatch the rejected action.
       * @returns {void}
       */
      const handleReject = reason => {  // disptach 失败的action ， reason = promise reject(err)返回的错误信息
        const rejectedAction = getAction(reason, true);
        dispatch(rejectedAction);  // dispatch 失败的action
      };

      /*
       * @function handleFulfill
       * @description Dispatch the fulfilled action.
       * @param successValue The value from transformFulfill
       * @returns {void}
       */
      const handleFulfill = (successValue) => { // dispatch成功的action
        dispatch(successValue.action);
      };

      /**
       * Second, dispatch a rejected or fulfilled action. This flux standard
       * action object will describe the resolved state of the promise. In
       * the case of a rejected promise, it will include an `error` property.
       *
       * In order to allow proper chaining of actions using `then`, a new
       * promise is constructed and returned. This promise will resolve
       * with two properties: (1) the value (if fulfilled) or reason
       * (if rejected) and (2) the flux standard action.
       *
       * Rejected object:
       * {
       *   reason: ...
       *   action: {
       *     error: true,
       *     type: 'ACTION_REJECTED',
       *     payload: ...
       *   }
       * }
       *
       * Fulfilled object:
       * {
       *   value: ...
       *   action: {
       *     type: 'ACTION_FULFILLED',
       *     payload: ...
       *   }
       * }
       */

      // 91行，transformFulfill实际是返回一个成功的action，进而传递给 handleFulfill去处理，而handleFulfill本身就是dispatch成功的action
      // 如果promise resolve了，那么 transformFulfill 会执行，进入下一个then
      const promiseValue = promise.then(transformFulfill);
      // 当 action.promise或者action.payload.promise 执行时resolve的时候，会执行handleFulfill
      // 当 action.promise或者action.payload.promise 执行的是reject(err)的时候，handleReject会被执行，也就dispatch了失败的action
      const sideEffects = promiseValue.then(handleFulfill, handleReject);
      //不管是成功失败还是失败，都返回一个promise对象，promise的状态是 action.promise或者action.payload.promise的状态
      //resolve的时候外围再then获得的是action对象，
      //reject的时候外面再then获得的是你reject(data)传递的data， reject后，这里正常走的是 then的第一个函数，但是 promiseValue是一个处于reject状态的promise，需要你外围额外的捕捉异常
      return sideEffects.then(() => promiseValue, () => promiseValue);
    };
  };
}
