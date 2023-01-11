import { Events } from '@core/domain/events';

export abstract class BaseEventHandler {
  protected constructor(private readonly eventTypes: string[]) {}

  abstract handle(payload: any): Promise<void>;

  listen() {
    this.eventTypes.map(event => Events.subscribe(event, this));
  }
}
