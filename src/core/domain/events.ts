import { BaseEventHandler } from '@core/domain/base.event-handler';

export class Events {
  private static subscribers: Map<string, BaseEventHandler[]> = new Map();

  static async emmit<T>(eventType: string, payload: T) {
    if (this.subscribers.has(eventType)) {
      const handlers = this.subscribers.get(eventType);
      if (handlers.length) {
        await Promise.all(handlers.map(handler => handler.handle(payload)));
      }
    }
  }

  static subscribe(eventType: string, handler: BaseEventHandler) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)?.push(handler);
  }
}
