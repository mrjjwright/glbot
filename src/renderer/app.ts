import { appendAndGetChild, appendChild, documentLoad, el, elementById } from './dom'
import { Effect, SubscriptionRef, Stream, pipe } from 'effect'
import { createEditor } from './monaco'
import * as monaco from 'monaco-editor'

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

function Top() {
  return el({
    classes: ['Top', 'grid', 'line']
  })
}

function Bottom() {
  return el({
    classes: ['Bottom', 'grid', 'line']
  })
}

function Map() {
  return el({
    classes: ['Map', 'grid']
  })
}

function Control() {
  const root = el({
    classes: ['Control', 'grid']
  })

  // Editor container
  const editorContainer = el({
    classes: ['editor-container']
  })
  root.appendChild(editorContainer)

  // Output panel
  const outputPanel = el({
    classes: ['output-panel']
  })
  root.appendChild(outputPanel)

  // Create Monaco editor
  const editor = createEditor(editorContainer)

  // Parse input into effects with correct types
  function parseSystem(input: string): Effect.Effect<string[], never, never>[] {
    const lines = input.split('\n').filter((line) => line.trim())
    const effects: Effect.Effect<string[], never, never>[] = []

    let currentGroup: string[] = []

    for (const line of lines) {
      if (line.trim() === '') {
        if (currentGroup.length > 0) {
          if (currentGroup[0].trim() === 'all') {
            const textEffects = currentGroup.slice(1).map((l) => {
              const [cmd, ...args] = l.trim().split(' ')
              if (cmd === 'text') {
                return Effect.succeed([args.join(' ').replace(/"/g, '')]) as Effect.Effect<
                  string[],
                  never,
                  never
                >
              }
              return Effect.succeed([l]) as Effect.Effect<string[], never, never>
            })
            effects.push(Effect.map(Effect.all(textEffects), (results) => results.flat()))
          }
        }
        currentGroup = []
      } else {
        currentGroup.push(line)
      }
    }

    // Handle last group
    if (currentGroup.length > 0) {
      if (currentGroup[0].trim() === 'all') {
        const textEffects = currentGroup.slice(1).map((l) => {
          const [cmd, ...args] = l.trim().split(' ')
          if (cmd === 'text') {
            return Effect.succeed([args.join(' ').replace(/"/g, '')]) as Effect.Effect<
              string[],
              never,
              never
            >
          }
          return Effect.succeed([l]) as Effect.Effect<string[], never, never>
        })
        effects.push(Effect.map(Effect.all(textEffects), (results) => results.flat()))
      }
    }

    return effects
  }

  // Handle Cmd+Enter
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
    const text = editor.getValue()
    const effects = parseSystem(text)

    // Run effects and show output
    effects.forEach((effect) => {
      Effect.runPromise(effect).then((result: string[]) => {
        const output = result.join(' ')
        outputPanel.innerHTML += `<div class="output-line">${output}</div>`
      })
    })
  })

  return root
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
  const top = yield* appendAndGetChild(Top)(app)
  yield* appendChild(Bottom)(app)
  yield* appendChild(Map)(top)
  yield* appendChild(Control)(top)

  const testPlayerFork = yield* Effect.fork(testPlayer(playRef))
  const res = yield* testPlayerFork.await
  console.log(res)
})

Effect.runFork(Effect.scoped(program))

function textEffect(text: string): Effect.Effect<string[], never, string[]> {
  return Effect.succeed([text])
}

function listToTextEffect(sepChar: string) {
  return (texts: string[]): Effect.Effect<string[], never, string[]> =>
    Effect.succeed([texts.join(sepChar)])
}

const helloWorld = pipe(
  Effect.all([textEffect('Hello'), textEffect('Parallel'), textEffect('World')]),
  Effect.map((results: string[][]) => results.flat()),
  Effect.map((texts: string[]) => [texts.join(' ')])
) as Effect.Effect<string[], never, never>

Effect.runPromise(helloWorld).then(console.log)

const tileRegistry = {
  'core.text': (text: string): Effect.Effect<string[], never, never> =>
    textEffect(text) as Effect.Effect<string[], never, never>,
  'core.list.to_text': listToTextEffect,
  'core.all': (effects: Effect.Effect<string[], never, never>[]) =>
    Effect.map(Effect.all(effects), (results) => results.flat())
}
