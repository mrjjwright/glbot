import { appendAndGetChild, appendChild, documentLoad, el, elementById } from './dom'
import { Effect, SubscriptionRef, Stream, pipe } from 'effect'

// Live reload in development
if (process.env.NODE_ENV !== 'production') {
  new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

function GLWebLogo() {
  return `<img src="/assets/glweb.svg" alt="GLWeb Logo" class="GLWebLogo" />`
}

function Intro() {
  const root = el({
    classes: ['Intro', 'span-line', 'subgrid'],
    html: `
      <div class="line">
        <b>glbot</b> <span class="Badge">Hello Transperfect</span>
        <i class="subdued"> via<span>&nbsp;</span> </i>
        ${GLWebLogo()}
      </div>
      <div class="line subdued">
        interact less, collaborate more
      </div>
    `
  })

  root.appendChild(el({ classes: ['line'] }))
  root.appendChild(el({ classes: ['line'] }))

  return root
}

function Controller() {
  return el({
    classes: ['Controller', 'grid', 'line']
  })
}

function Editor() {
  return el({
    classes: ['Editor', 'grid', 'line']
  })
}

function Graph() {
  return el({
    classes: ['Graph', 'grid']
  })
}

function Tiles() {
  return el({
    classes: ['Tiles', 'grid']
  })
}

function Play() {
  return el({
    classes: ['Play', 'grid']
  })
}

type PlayState = {
  effect: Effect.Effect<any, never, never>
}

const player = (playRef: SubscriptionRef.SubscriptionRef<PlayState>) =>
  Effect.gen(function* () {
    yield* playRef.changes.pipe(
      Stream.tap((state) => Effect.log('Playing tile', state)),
      Stream.tap((state) => Effect.runFork(state.effect)),
      Stream.runDrain
    )
  })

const testPlayer = (playRef: SubscriptionRef.SubscriptionRef<PlayState>) =>
  Effect.gen(function* () {
    yield* Effect.sleep('2 seconds')
    yield* SubscriptionRef.set(playRef, {
      effect: Effect.log('Testing player: Effect executed!')
    })
  })

const program = Effect.gen(function* () {
  const playRef = yield* SubscriptionRef.make<PlayState>({
    effect: Effect.succeed('Hello World')
  })

  yield* documentLoad
  yield* Effect.log('Document loaded successfully')

  yield* Effect.fork(player(playRef))

  const app = yield* elementById('app')
  yield* appendChild(Intro)(app)
  const controller = yield* appendAndGetChild(Controller)(app)
  yield* appendChild(Editor)(app)
  yield* appendChild(Graph)(controller)
  yield* appendChild(Tiles)(controller)
  yield* appendChild(Play)(controller)

  const testPlayerFork = yield* Effect.fork(testPlayer(playRef))
  const res = yield* testPlayerFork.await
  console.log(res)
})

Effect.runFork(Effect.scoped(program))

function textEffect(text: string) {
  return Effect.succeed(text)
}

function listToTextEffect(sepChar: string) {
  return (texts: string[]) => Effect.succeed(texts.join(sepChar))
}

const demoParallelText = pipe(
  Effect.all([textEffect('Hello'), textEffect('Parallel'), textEffect('World')]),
  Effect.andThen(listToTextEffect(' '))
)

Effect.runPromise(demoParallelText).then(console.log)

// Tile effect registry
const tileRegistry = {
  'core.text': textEffect,
  'core.list.to_text': listToTextEffect,
  'core.all': (effects: Effect.Effect<any, never, any>[]) => Effect.all(effects)
}
