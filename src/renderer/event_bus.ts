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
  console.log('publish', event, payload)
  const customEvent = new CustomEvent(event, { detail: payload })
  bus.dispatchEvent(customEvent)
}

export function subscribe<K extends keyof EventsDefinition>(
  event: K,
  callback: (payload: EventsDefinition[K]) => void
): () => void {
  console.log('subscribe', event, callback)
  const handler = (e: Event) => {
    if (e instanceof CustomEvent) {
      console.log('event received', e.detail)
      callback(e.detail)
    }
  }

  bus.addEventListener(event, handler)
  return () => bus.removeEventListener(event, handler)
}

// Usage:
// publish('JSONGenerated', { timestamp: Date.now(), config: {} });
// subscribe('JSONSelected', (payload) => console.log(payload.timestamp));
