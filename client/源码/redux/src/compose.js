/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  /* 执行前 a,b格式 =  next => action => {
       ...     
       result = next(action)    
       ...
       return result       //返回的是action
   } 
      
   b执行后是  action = {
     ...
     result = (...args)(action)  // 第一次...args等于store.dispatch，参看 compose(...chain)(store.dispatch),之后都是下一次的中间件执行函数    
     ...
     return result
   }, 
    紧接着作为 a函数的next参数，执行a,依此类推，所以 next 实际就是 下一层中间件的执行函数，就是上面的那个样子

   */
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
