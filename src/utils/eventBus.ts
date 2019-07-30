/*
 * @Description: 全局（单例）消息总线
 * @Author: 毛瑞
 * @Date: 2019-06-03 12:12:12
 */
import Vue from 'vue'

const BUS = new Vue()

/** 事件处理函数
 */
type Handler = (...args: any[]) => void

/** 全局（单例）消息总线
 */
const eventBus = {
  /** 监听事件
   * @param {String} eventName 事件名
   * @param {String|Function} nameSpace:String 命名空间 handler:Function 事件处理函数
   * @param {Function} handler 事件处理函数
   * @param {Boolean} isOnce 是否只监听一次
   *
   * @returns {ThisType} eventBus
   */
  on(
    eventName: string = '',
    nameSpace: string | Handler,
    handler?: Handler,
    isOnce?: boolean
  ) {
    // 参数处理
    if (nameSpace instanceof Function) {
      handler = nameSpace
      nameSpace = ''
    }
    if (!handler) {
      console.error('未提供事件处理函数')
      return this
    }
    nameSpace && (eventName = nameSpace + '.' + eventName)

    // 注册事件
    isOnce ? BUS.$once(eventName, handler) : BUS.$on(eventName, handler)

    return this
  },
  /** 单次监听事件
   * @param {String} eventName 事件名
   * @param {String|Function} nameSpace:String 命名空间 handler:Function 事件处理函数
   * @param {Function} handler 事件处理函数
   *
   * @returns {ThisType} eventBus
   */
  once(eventName: string, nameSpace: string | Handler, handler?: Handler) {
    return this.on(eventName, nameSpace, handler, true)
  },
  /** 取消监听事件
   * 如果没有提供参数，则移除所有的事件监听器；
   * 如果只提供了事件，则移除该事件所有的监听器；
   * 如果同时提供了事件与回调，则只移除这个回调的监听器。
   * @param {String} eventName 事件名
   * @param {String|Function} String:nameSpace 命名空间 Function:handler 事件处理函数
   * @param {Function} handler 事件处理函数
   *
   * @returns {ThisType} eventBus
   */
  off(
    eventName: string | undefined,
    nameSpace: string | Handler,
    handler?: Handler
  ) {
    // 参数处理
    if (nameSpace instanceof Function) {
      handler = nameSpace
      nameSpace = ''
    }

    if (eventName === undefined) {
      BUS.$off(handler as undefined) // 注销事件
    } else if (nameSpace) {
      eventName = nameSpace + '.' + eventName
      // 注销事件
      handler === undefined ? BUS.$off(eventName) : BUS.$off(eventName, handler)
    }

    return this
  },
  /** 触发事件
   * @param {String} eventKey 事件 (= 命名空间.事件名)
   * @param {...Any} args 事件参数列表
   *
   * @returns {ThisType} eventBus
   */
  emit(eventKey: string = '', ...args: any[]) {
    BUS.$emit(eventKey, ...args)

    return this
  },
}

export default eventBus
