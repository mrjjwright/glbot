import { Effect, SubscriptionRef, Stream } from 'effect'
import { appendChild, documentLoad, el, elementById } from './dom'
import { createEditor } from './monaco'
import createSplitGrid from 'split-grid'

// Live reload in development
if (process.env.NODE_ENV !== 'production') {
  new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

function GLWebLogo() {
  return `<img src="/assets/glweb.svg" alt="GLWeb Logo" class="GLWebLogo" />`
}

function Intro() {
  return el({
    classes: ['Intro', 'cell'],
    html: `
      <div class="intro-content">
        <b>glbot</b> <span class="Badge">Hello Transperfect</span>
        <i class="subdued"> via<span>&nbsp;</span> </i>
        ${GLWebLogo()}
      </div>
      <div class="subdued">
        interact less, collaborate more
      </div>
    `
  })
}

function createGridCells() {
  const fragment = document.createDocumentFragment()

  // Create intro cell
  const introCell = document.createElement('div')
  introCell.className = 'intro-cell cell'
  fragment.appendChild(introCell)

  // Create first gutter
  const gutterRow1 = document.createElement('div')
  gutterRow1.className = 'gutter gutter-row-1'
  fragment.appendChild(gutterRow1)

  // Create top row container
  const topRow = document.createElement('div')
  topRow.className = 'top-row'

  // Create map cell
  const mapCell = document.createElement('div')
  mapCell.className = 'cell map-cell'
  topRow.appendChild(mapCell)

  // Create first column gutter
  const gutterColumn1 = document.createElement('div')
  gutterColumn1.className = 'gutter gutter-column-1'
  topRow.appendChild(gutterColumn1)

  // Create editor cell
  const editorCell = document.createElement('div')
  editorCell.className = 'cell editor-cell'
  topRow.appendChild(editorCell)

  // Create second column gutter
  const gutterColumn2 = document.createElement('div')
  gutterColumn2.className = 'gutter gutter-column-2'
  topRow.appendChild(gutterColumn2)

  // Create preview cell
  const previewCell = document.createElement('div')
  previewCell.className = 'cell preview-cell'
  topRow.appendChild(previewCell)

  // Append top row to fragment
  fragment.appendChild(topRow)

  // Create second gutter
  const gutterRow2 = document.createElement('div')
  gutterRow2.className = 'gutter gutter-row-2'
  fragment.appendChild(gutterRow2)

  // Create output cell
  const outputCell = document.createElement('div')
  outputCell.className = 'cell output-cell'
  fragment.appendChild(outputCell)

  return {
    fragment,
    cells: {
      intro: introCell,
      map: mapCell,
      editor: editorCell,
      preview: previewCell,
      output: outputCell
    }
  }
}

function initializeSplitGrid(container: HTMLElement) {
  return createSplitGrid({
    columnGutters: [
      {
        track: 1,
        element: container.querySelector('.gutter-column-1')! as HTMLElement
      },
      {
        track: 3,
        element: container.querySelector('.gutter-column-2')! as HTMLElement
      }
    ],
    rowGutters: [
      {
        track: 1,
        element: container.querySelector('.gutter-row-1')! as HTMLElement
      },
      {
        track: 3,
        element: container.querySelector('.gutter-row-2')! as HTMLElement
      }
    ],
    onDrag: () => {
      window.dispatchEvent(new Event('resize'))
    }
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

const program = Effect.gen(function* () {
  const playRef = yield* SubscriptionRef.make<PlayState>({
    effect: Effect.succeed('Hello World')
  })

  yield* documentLoad
  yield* Effect.log('Document loaded successfully')

  yield* Effect.fork(player(playRef))

  const app = yield* elementById('app')
  const { fragment, cells } = createGridCells()

  // Setup initial content
  cells.intro.appendChild(Intro())
  createEditor(cells.editor as HTMLElement)

  // Append fragment to app
  yield* appendChild(() => fragment)(app)

  // Initialize split grid using the app element directly
  initializeSplitGrid(app)
})

Effect.runFork(Effect.scoped(program))

export const tileRegistry = {
  'core.text': (text: string): Effect.Effect<string[], never, never> => Effect.succeed([text]),
  'core.list.to_text':
    (sepChar: string) =>
    (texts: string[]): Effect.Effect<string[], never, string[]> =>
      Effect.succeed([texts.join(sepChar)]),
  'core.all': (effects: Effect.Effect<string[], never, never>[]) =>
    Effect.map(Effect.all(effects), (results) => results.flat())
}
