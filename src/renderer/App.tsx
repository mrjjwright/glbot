import { appendAndGetChild, appendChild, documentLoad, el, elementById } from './dom'
import { Effect } from 'effect'

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
    classes: ['Controller', 'subgrid', 'line']
  })
}

function Editor() {
  return el({
    classes: ['Editor', 'subgrid', 'line']
  })
}

function Graph() {
  return el({
    classes: ['Graph', 'subgrid']
  })
}

function Tiles() {
  return el({
    classes: ['Tiles', 'subgrid']
  })
}

function Play() {
  return el({
    classes: ['Play', 'subgrid']
  })
}

const program = Effect.gen(function* () {
  // wait for document to load
  yield* documentLoad
  yield* Effect.log('Document loaded successfully')

  const app = yield* elementById('app')
  yield* appendChild(Intro)(app)
  const controller = yield* appendAndGetChild(Controller)(app)
  yield* appendChild(Editor)(app)
  yield* appendChild(Graph)(controller)
})

Effect.runPromise(Effect.scoped(program))
