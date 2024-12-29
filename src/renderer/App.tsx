import { effect, Signal, signal } from 'alien-signals'
import { el } from './dom'
import { ContentTile } from './ContentTile'

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
      <div class="start-line" style="font-weight:bold">glbot</div>
      <div class="span-line" style="grid-column-start: 2;">
        <span class="Badge">Hello Transperfect</span> 
        <i class="subdued"> via<span>&nbsp;</span> </i>
        ${GLWebLogo()}
      </div>
      <div class="line subdued">interact less, collaborate more,interact less, collaborate more</div>
    `
  })

  root.appendChild(el({ classes: ['line'] }))
  root.appendChild(el({ classes: ['line'] }))

  return root
}

function createContentTile() {
  const tile = new ContentTile({ basePath: process.cwd(), path: window.glbot.path }, 'content.json')
  return tile.buildUI()
}

function Edit(options: { editValue: Signal<string | null> }) {
  const root = el({ classes: ['Edit', 'span-line'] })
  effect(() => {
    root.textContent = options.editValue.get() ?? ''
  })
  return root
}

function Model() {
  const documentLoaded = signal(false)
  const editValue = signal<string | null>(null)
  document.addEventListener('DOMContentLoaded', () => {
    documentLoaded.set(true)
  })
  const app = document.getElementById('app')!
  effect(() => {
    if (!documentLoaded.get()) {
      return
    }
    app.appendChild(Intro())
    const controller = el({
      classes: ['Controller', 'subgrid', 'line'],
      children: [
        createContentTile(),
        createContentTile(),
        createContentTile(),
        createContentTile(),
        createContentTile(),
        createContentTile()
      ]
    })
    const edit = Edit({ editValue })
    app.appendChild(controller)
    app.appendChild(edit)
  })
}

Model()
