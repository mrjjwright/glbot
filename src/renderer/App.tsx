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
  return `
      <div class="start-line" style="font-weight:bold">glbot</div>
      <div class="span-line" style="grid-column-start: 2;">
        <span class="Badge">Hello Transperfect</span> 
        <i class="subdued"> via<span>&nbsp;</span> </i>
        ${GLWebLogo()}
      </div>
      <div class="line subdued">interact less, collaborate more,interact less, collaborate more</div>
    </div>
  `
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

function Control() {
  const root = el({ classes: ['Control', 'span-line'] })

  root.innerHTML = Intro()
  root.appendChild(el({ classes: ['line'] }))
  root.appendChild(el({ classes: ['line'] }))

  const cellGradient = createCellGradient(DEFAULT_COLORS.grayScale)

  root.appendChild(
    el({
      classes: ['key-value', 'title'],
      text: 'GLWeb Translation Profile'
    })
  )

  const keyIcon = svg({
    html: `<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />`
  })

  const bgColor = cellGradient.getHeaderColor(0, 2)

  root.appendChild(
    el({
      classes: ['key'],
      children: [keyIcon],
      style: `background-color: ${bgColor};  text-align: center; `
    })
  )

  root.appendChild(
    el({
      classes: ['value'],
      text: '',
      style: `background-color: ${cellGradient.getHeaderColor(1, 2)}`
    })
  )
  root.appendChild(
    el({
      classes: ['key'],
      text: 'intro prompt',
      style: `background-color: ${cellGradient.getCellColor(0, 0, 4, 2)}`
    })
  )

  root.appendChild(
    el({
      classes: ['value'],
      text: '•',
      style: `background-color: ${cellGradient.getCellColor(0, 1, 4, 2)}`
    })
  )

  root.appendChild(
    el({
      html: `
          <div class="App">
            <div class="control-cell">
              <!-- Control content here -->
            </div>
            <div class="details-cell">
              <div class="gl-profile-grid">
                <!-- GL Profile Assistant grid content here -->
              </div>
            </div>
          </div>
        `
    })
  )
  return root
}

function Edit(options: { editValue: Signal<string> }) {
  const root = el({ classes: ['Control', 'span-line'] })
  effect(() => {
    root.textContent = options.editValue.get()
  })
  return root
}

function Model() {
  const documentLoaded = signal(false)
  const editValue = signal('hello')
  document.addEventListener('DOMContentLoaded', () => {
    documentLoaded.set(true)
  })
  const app = document.getElementById('app')!
  const edit = Edit({ editValue })
  const control = Control()
  effect(() => {
    if (!documentLoaded.get()) {
      return
    }
    app.appendChild(control)
    app.appendChild(edit)
  })
}

Model()
