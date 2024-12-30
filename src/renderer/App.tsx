import { appendChild, documentLoad, el, elementById } from './dom'
// import { ContentTile } from './ContentTile'
import { Effect } from 'effect'
import { release } from 'os'

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

const program = Effect.scoped(
  documentLoad.pipe(
    Effect.tap(() => Effect.log('Document loaded successfully')),
    Effect.flatMap(() => elementById('app')),
    Effect.flatMap(appendChild(Intro))
  )
)

// Run it
Effect.runPromise(program)
