

type Callback = (...args) => void;

export class EventEmitter {

  private callbackMap = new Map<string, Set<Callback>>();

  on(event: string, callback: Callback) {
    if (!this.callbackMap.has(event)) {
      this.callbackMap.set(event, new Set([callback]));
      return this;
    }
    const set = this.callbackMap.get(event);
    set.add(callback);
    return this;
  }

  off(event: string, callback: Callback) {
    const set = this.callbackMap.get(event) || new Set();
    set.delete(callback);
    return this;
  }

  emit(event: string, ...args) {
    const set = this.callbackMap.get(event) || new Set();
    set.forEach(cb => typeof cb === "function" && cb(...args));
    return this;
  }

}