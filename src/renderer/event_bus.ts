// src/renderer/event_bus.ts

const bus = new Comment('event-bus')

type EventsDefinition = {
  JSONGenerated: JSONVersion
  JSONSelected: JSONVersion
}

export function publish<K extends keyof EventsDefinition>(
  event: K,
  payload: EventsDefinition[K]
): void {
  const customEvent = new CustomEvent(event, { detail: payload })
  bus.dispatchEvent(customEvent)
}

export function subscribe<K extends keyof EventsDefinition>(
  event: K,
  callback: (payload: EventsDefinition[K]) => void
): () => void {
  const handler = (e: Event) => {
    if (e instanceof CustomEvent) {
      callback(e.detail)
    }
  }

  bus.addEventListener(event, handler)
  return () => bus.removeEventListener(event, handler)
}

// Usage:
// publish('JSONGenerated', { timestamp: Date.now(), config: {} });
// subscribe('JSONSelected', (payload) => console.log(payload.timestamp));
