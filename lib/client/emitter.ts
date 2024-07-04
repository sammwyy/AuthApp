export default class Emitter<T extends string> {
  private readonly listeners: Map<T, Function[]>;

  constructor() {
    this.listeners = new Map();
  }

  on(event: T, listener: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event)?.push(listener);
  }

  removeListener(event: T, listener: Function) {
    const listeners = this.listeners.get(event);

    if (listeners) {
      const index = listeners.indexOf(listener);

      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  removeAllListeners(event: T) {
    this.listeners.delete(event);
  }

  removeAll() {
    this.listeners.clear();
  }

  emit(event: T, ...args: any[]) {
    const listeners = this.listeners.get(event);

    if (listeners) {
      for (const listener of listeners) {
        listener(...args);
      }
    }
  }
}
