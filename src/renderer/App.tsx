import { effect, Signal, signal } from 'alien-signals'
import { createCellGradient, DEFAULT_COLORS } from './interpolate'

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

interface ElementOptions {
  tag?: string
  text?: string
  classes?: string[]
  style?: string
  html?: string
  children?: Node[]
}

function el(options: ElementOptions = {}) {
  const el = document.createElement(options.tag ?? 'div')
  if (options.text) {
    el.textContent = options.text
  }
  for (let c of options.classes ?? []) {
    el.classList.add(c)
  }
  if (options.style) {
    el.setAttribute('style', options.style)
  }
  if (options.html) {
    el.innerHTML = options.html
  }
  if (options.children) {
    for (const child of options.children) {
      el.appendChild(child)
    }
  }
  return el
}

function svg(options: ElementOptions) {
  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  if (options.classes) {
    for (let c of options.classes) {
      svgElement.classList.add(c)
    }
  }
  svgElement.classList.add('icon-inline')
  svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svgElement.setAttribute('viewBox', '0 0 24 24')
  svgElement.setAttribute('fill', 'none')
  svgElement.setAttribute('stroke', 'currentColor')
  svgElement.setAttribute('stroke-width', '1.5')
  svgElement.setAttribute('stroke-linecap', 'round')
  svgElement.setAttribute('stroke-linejoin', 'round')

  if (options.html) {
    // Create the path element properly
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = options.html
    const path = tempDiv.querySelector('path')
    if (path) {
      const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      svgPath.setAttribute('d', path.getAttribute('d') || '')
      svgElement.appendChild(svgPath)
    }
  }

  if (options.style) {
    svgElement.setAttribute('style', options.style)
  }

  return svgElement
}

function KeyValuePair({
  keyText,
  valueText,
  cellGradient,
  rowIndex,
  totalRows
}: {
  keyText: string
  valueText: string
  cellGradient: any
  rowIndex: number
  totalRows: number
}) {
  const fragment = document.createDocumentFragment()

  const keyEl = el({
    classes: ['key'],
    text: keyText,
    style: `background-color: ${cellGradient.getCellColor(rowIndex, 0, totalRows, 2)}`
  })

  const valueEl = el({
    classes: ['value'],
    text: valueText,
    style: `background-color: ${cellGradient.getCellColor(rowIndex, 1, totalRows, 2)}`
  })

  fragment.appendChild(keyEl)
  fragment.appendChild(valueEl)
  return fragment
}

function Control() {
  const root = el({ classes: ['Control', 'span-line', 'subgrid'] })

  const cellGradient = createCellGradient(DEFAULT_COLORS.grayScale)

  root.appendChild(
    el({
      classes: ['control-line', 'title'],
      text: 'GLWeb Translation Profile'
    })
  )

  const keyIcon = svg({
    html: `<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />`
  })

  root.appendChild(
    el({
      classes: ['key'],
      children: [keyIcon],
      style: `text-align: center; background-color: ${cellGradient.getCellColor(0, 0, 4, 2)}`
    })
  )

  root.appendChild(
    el({
      classes: ['value'],
      style: `background-color: ${cellGradient.getCellColor(0, 1, 4, 2)}`
    })
  )

  root.appendChild(
    KeyValuePair({
      keyText: 'intro prompt',
      valueText: '•',
      cellGradient,
      rowIndex: 1,
      totalRows: 4
    })
  )

  return root
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
    const control = Control()
    const edit = Edit({ editValue })
    app.appendChild(control)
    app.appendChild(edit)
  })
}

Model()
