export function createMiniTimeOut(interval: number, cb: () => void) {
  let timeOut = 0;

  return {
    start() {
      if (timeOut > 0)
        clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        timeOut = 0;
        cb();
      }, interval) as any;
    },
    stop() {
      if (timeOut > 0) {
        clearTimeout(timeOut);
        timeOut = 0;
      }
    },
  }
}
export function createMiniTimer(interval: number, cb: () => void) {
  let timerId = 0;

  return {
    start() {
      if (timerId > 0)
        clearInterval(timerId);
      timerId = setInterval(() => {
        timerId = 0;
        cb();
      }, interval) as any;
    },
    stop() {
      if (timerId > 0) {
        clearInterval(timerId);
        timerId = 0;
      }
    },
  }
}

//节流函数
export function throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;
  let lastExecTime = 0;
  
  return function(this: any, ...args: Parameters<T>) {
    const currentTime = Date.now();
    const timeSinceLastExec = currentTime - lastExecTime;
    
    const remainingTime = delay - timeSinceLastExec;
    
    if (remainingTime <= 0) {
      lastExecTime = currentTime;
      func.apply(this, args);
    } else {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      
      timeoutId = window.setTimeout(() => {
        lastExecTime = Date.now();
        timeoutId = null;
        func.apply(this, args);
      }, remainingTime);
    }
  };
}
