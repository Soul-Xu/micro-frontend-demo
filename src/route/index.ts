import { EventType } from '../types'
// 保存原有方法
const originalPush = window.history.pushState;
const originalReplace = window.history.replaceState;

const capturedListeners: Record<EventType, Function[]> = {
	hashchange: [],
	popstate: [],
}

let historyEvent: PopStateEvent | null = null

export const myRoute = () => {
  // 重写方法
  window.history.pushState = (...args) => {
    // 调用原有方法
    originalPush.apply(window.history, args)
    // URL改变逻辑，即如何处理子应用路由
    // todo
  }
  window.history.replaceState = (...args) => {
    originalReplace.apply(window.history, args) 
    // URL 改变逻辑，即如何处理子应用路由
    // todo
  }
  // 监听事件，触发 URL 改变逻辑 popState, hashChange
  window.addEventListener("hashchange", () => {});
  window.addEventListener("popstate", () => {});
   // 重写方法
  window.addEventListener = myEventListener(window.addEventListener);
  window.removeEventListener = myEventListener(window.removeEventListener);
	const hasListeners = (name: EventType, fn: Function) => {
		return capturedListeners[name].filter((listener) => listener === fn).length;
	}
	var myEventListener = (func: Function): any => {
		return function (name: string, fn: Function) {
			// 如果是以下事件，保存回调函数
			if (name === "hashchange" || name === "popstate") {
				if (!hasListeners(name, fn)) {
					capturedListeners[name].push(fn);
					return
				} else {
					capturedListeners[name] = capturedListeners[name].filter(
						(listener) => listener !== fn
					)
				}
			}
			return func.apply(window, arguments);
		}
	}
}

// 后续渲染子应用后使用，用于执行之前保存的回调函数
export function callCapturedListeners() {
	if (historyEvent) {
		Object.keys(capturedListeners).forEach((eventName) => {
			const listeners = capturedListeners[eventName as EventType]
			if (listeners.length) {
				listeners.forEach((listener) => {
					// @ts-ignore
					listener.call(this, historyEvent)
				})
			}
		})
		historyEvent = null
	}
}