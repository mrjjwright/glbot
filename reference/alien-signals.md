<p align="center">
	<img src="assets/logo.png" width="250"><br>
<p>

<p align="center">
	<a href="https://npmjs.com/package/alien-signals"><img src="https://badgen.net/npm/v/alien-signals" alt="npm package"></a>
</p>

# alien-signals

The goal of `alien-signals` is to create a ~~push-pull~~ [push-pull-push model](https://github.com/stackblitz/alien-signals/pull/19) based signal library with the lowest overhead.

We have set the following constraints in scheduling logic:

1. No dynamic object fields
2. No use of Array/Set/Map
3. No recursion calls
4. Class properties must be fewer than 10 (https://v8.dev/blog/fast-properties)

Experimental results have shown that with these constraints, it is possible to achieve excellent performance for a Signal library without using sophisticated scheduling strategies. The overall performance of `alien-signals` is approximately 400% that of Vue 3.4's reactivity system.

For more detailed performance comparisons, please visit: https://github.com/transitive-bullshit/js-reactivity-benchmark

## Motivation

To achieve high-performance code generation in https://github.com/vuejs/language-tools, I needed to write some on-demand computed logic using Signals, but I couldn't find a low-cost Signal library that satisfied me.

In the past, I accumulated some knowledge of reactivity systems in https://github.com/vuejs/core/pull/5912, so I attempted to develop `alien-signals` with the goal of creating a Signal library with minimal memory usage and excellent performance.

Since Vue 3.5 switched to a Pull reactivity system in https://github.com/vuejs/core/pull/10397, I continued to research the Push-Pull reactivity system here. It is worth mentioning that I was inspired by the doubly-linked concept, but `alien-signals` does not use a similar implementation.

## Adoptions

- Used in Vue language tools (https://github.com/vuejs/language-tools) for virtual code generation.

- The core reactivity system code was ported to Vue 3.6 and later. (https://github.com/vuejs/core/pull/12349)

## Usage

### Basic

```ts
import { signal, computed, effect } from 'alien-signals'

const count = signal(1)
const doubleCount = computed(() => count.get() * 2)

effect(() => {
  console.log(`Count is: ${count.get()}`)
}) // Console: Count is: 1

console.log(doubleCount.get()) // 2

count.set(2) // Console: Count is: 2

console.log(doubleCount.get()) // 4
```

### Effect Scope

```ts
import { signal, effectScope } from 'alien-signals'

const count = signal(1)
const scope = effectScope()

scope.run(() => {
  effect(() => {
    console.log(`Count in scope: ${count.get()}`)
  }) // Console: Count in scope: 1

  count.set(2) // Console: Count in scope: 2
})

scope.stop()

count.set(3) // No console output
```

## About `propagate` and `checkDirty` functions

In order to eliminate recursive calls and improve performance, we record the last link node of the previous loop in `propagate` and `checkDirty` functions, and implement the rollback logic to return to this node.

This results in code that is difficult to understand, and you don't necessarily get the same performance improvements in other languages, so we record the original implementation without eliminating recursive calls here for reference.

#### `propagate`

```ts
import { expect, test } from 'vitest'
import { Effect } from '../src'
import { computed, effect, effectScope, endBatch, signal, startBatch } from './api'

test('should clear subscriptions when untracked by all subscribers', () => {
  let bRunTimes = 0

  const a = signal(1)
  const b = computed(() => {
    bRunTimes++
    return a.get() * 2
  })
  const effect1 = effect(() => {
    b.get()
  })

  expect(bRunTimes).toBe(1)
  a.set(2)
  expect(bRunTimes).toBe(2)
  effect1.stop()
  a.set(3)
  expect(bRunTimes).toBe(2)
})

test('should not run untracked inner effect', () => {
  const a = signal(3)
  const b = computed(() => a.get() > 0)

  effect(() => {
    if (b.get()) {
      effect(() => {
        if (a.get() == 0) {
          throw new Error('bad')
        }
      })
    }
  })

  decrement()
  decrement()
  decrement()

  function decrement() {
    a.set(a.get() - 1)
  }
})

test('should run outer effect first', () => {
  const a = signal(1)
  const b = signal(1)

  effect(() => {
    if (a.get()) {
      effect(() => {
        b.get()
        if (a.get() == 0) {
          throw new Error('bad')
        }
      })
    } else {
    }
  })

  startBatch()
  b.set(0)
  a.set(0)
  endBatch()
})

test('should not trigger inner effect when resolve maybe dirty', () => {
  const a = signal(0)
  const b = computed(() => a.get() % 2)

  let innerTriggerTimes = 0

  effect(() => {
    effect(() => {
      b.get()
      innerTriggerTimes++
      if (innerTriggerTimes > 1) {
        throw new Error('bad')
      }
    })
  })

  a.set(2)
})

test('should trigger inner effects in sequence', () => {
  const a = signal(0)
  const b = signal(0)
  const c = computed(() => a.get() - b.get())
  const order: string[] = []

  effect(() => {
    c.get()

    effect(() => {
      order.push('first inner')
      a.get()
    })

    effect(() => {
      order.push('last inner')
      a.get()
      b.get()
    })
  })

  order.length = 0

  startBatch()
  b.set(1)
  a.set(1)
  endBatch()

  expect(order).toEqual(['first inner', 'last inner'])
})

test('should trigger inner effects in sequence in effect scope', () => {
  const a = signal(0)
  const b = signal(0)
  const scope = effectScope()
  const order: string[] = []

  scope.run(() => {
    effect(() => {
      order.push('first inner')
      a.get()
    })

    effect(() => {
      order.push('last inner')
      a.get()
      b.get()
    })
  })

  order.length = 0

  startBatch()
  b.set(1)
  a.set(1)
  endBatch()

  expect(order).toEqual(['first inner', 'last inner'])
})

test('should custom effect support batch', () => {
  class BatchEffect<T = any> extends Effect<T> {
    run(): T {
      startBatch()
      try {
        return super.run()
      } finally {
        endBatch()
      }
    }
  }

  const logs: string[] = []
  const a = signal(0)
  const b = signal(0)

  const aa = computed(() => {
    logs.push('aa-0')
    if (a.get() === 0) {
      b.set(1)
    }
    logs.push('aa-1')
  })

  const bb = computed(() => {
    logs.push('bb')
    return b.get()
  })

  new BatchEffect(() => {
    bb.get()
  }).run()
  new BatchEffect(() => {
    aa.get()
  }).run()

  expect(logs).toEqual(['bb', 'aa-0', 'aa-1', 'bb'])
})

import { expect, test } from 'vitest'
import { checkDirty, Computed, shallowPropagate, SubscriberFlags } from '../src'
import { computed, signal } from './api'

test('should correctly propagate changes through computed signals', () => {
  const src = signal(0)
  const c1 = computed(() => src.get() % 2)
  const c2 = computed(() => c1.get())
  const c3 = computed(() => c2.get())

  c3.get()
  src.set(1) // c1 -> dirty, c2 -> toCheckDirty, c3 -> toCheckDirty
  c2.get() // c1 -> none, c2 -> none
  src.set(3) // c1 -> dirty, c2 -> toCheckDirty

  expect(c3.get()).toBe(1)
})

test('should custom computed support recursion', () => {
  class RecursiveComputed<T> extends Computed<T> {
    get(): T {
      let flags = this.flags
      if (flags & SubscriberFlags.Dirty) {
        if (this.update()) {
          const subs = this.subs
          if (subs !== undefined) {
            shallowPropagate(subs)
          }
        }
      } else if (flags & SubscriberFlags.ToCheckDirty) {
        if (checkDirty(this.deps!)) {
          if (this.update()) {
            const subs = this.subs
            if (subs !== undefined) {
              shallowPropagate(subs)
            }
          }
        } else {
          this.flags = flags & ~SubscriberFlags.ToCheckDirty
        }
      }
      flags = this.flags
      if (flags & SubscriberFlags.Recursed) {
        this.flags = flags & ~SubscriberFlags.Recursed
        return this.get()
      }
      return super.get()
    }
  }

  const logs: string[] = []
  const a = signal(0)
  const b = new RecursiveComputed(() => {
    if (a.get() === 0) {
      logs.push('b-0')
      a.set(100)
      logs.push('b-1 ' + a.get())
      a.set(200)
      logs.push('b-2 ' + a.get())
    } else {
      logs.push('b-2 ' + a.get())
    }
  })

  b.get()

  expect(logs).toEqual(['b-0', 'b-1 100', 'b-2 200', 'b-2 200'])
})

import { expect, test } from 'vitest'
import { unstable } from '../src'
import { signal } from './api'

const { asyncComputed, asyncEffect } = unstable

test('should track dep after await', async () => {
  const src = signal(0)
  const c = asyncComputed(async function* () {
    await sleep(100)
    return (yield src, src).get()
  })
  expect(await c.get()).toBe(0)

  src.set(1)
  expect(await c.get()).toBe(1)
})

test('should trigger asyncEffect', async () => {
  let triggerTimes = 0

  const src = signal(0)
  const c = asyncComputed(async function* () {
    await sleep(100)
    return (yield src, src).get()
  })
  asyncEffect(async function* () {
    triggerTimes++
    ;(yield c, c).get()
  })
  expect(triggerTimes).toBe(1)

  await sleep(200)
  src.set(1)
  await sleep(200)
  expect(triggerTimes).toBe(2)
})

test.skip('should stop calculating when dep updated', async () => {
  let calcTimes = 0

  const a = signal('a0')
  const b = signal('b0')
  const c = asyncComputed(async function* () {
    calcTimes++
    const v1 = (yield a, a).get()
    await sleep(200)
    const v2 = (yield b, b).get()
    return v1 + '-' + v2
  })

  expect(await c.get()).toBe('a0-b0')
  expect(calcTimes).toBe(1)

  a.set('a1')
  const promise = c.get()
  await sleep(100)
  expect(calcTimes).toBe(2)
  a.set('a2')

  expect(await promise).toBe('a2-b0')
  expect(calcTimes).toBe(3)
})

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

import { expect, test } from 'vitest'
import { effect, effectScope, signal } from './api'

test('should not trigger after stop', () => {
  const count = signal(1)
  const scope = effectScope()

  let triggers = 0
  let effect1

  scope.run(() => {
    effect1 = effect(() => {
      triggers++
      count.get()
    })
  })

  expect(triggers).toBe(1)
  count.set(2)
  expect(triggers).toBe(2)
  scope.stop()
  count.set(3)
  expect(triggers).toBe(2)
})

import { untrack } from '../src'
import { signal, computed } from './api'
import { expect, test } from 'vitest'

test('should untrack', () => {
  const src = signal(0)
  const c = computed(() => untrack(() => src.get()))
  expect(c.get()).toBe(0)

  src.set(1)
  expect(c.get()).toBe(0)
})
```
