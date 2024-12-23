import { effect, signal } from 'alien-signals'
import { createTableGradient, DEFAULT_COLORS } from './interpolate'

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
  return el
}

function Model() {
  const documentLoaded = signal(false)
  document.addEventListener('DOMContentLoaded', () => {
    documentLoaded.set(true)
  })

  const app = document.getElementById('app')!

  effect(() => {
    if (documentLoaded.get()) {
      app.innerHTML = Intro()
      app.appendChild(el({ classes: ['line'] }))
      app.appendChild(el({ classes: ['line'] }))

      const tableGradient = createTableGradient(DEFAULT_COLORS.grayScale)

      app.appendChild(
        el({
          classes: ['key-value', 'title'],
          text: 'GLWeb Translation Profile'
        })
      )
      app.appendChild(
        el({
          classes: ['key'],
          text: 'Key',
          style: `background-color: ${tableGradient.getHeaderColor(0, 2)}`
        })
      )
      app.appendChild(
        el({
          classes: ['value'],
          text: 'Value',
          style: `background-color: ${tableGradient.getHeaderColor(1, 2)}`
        })
      )
      app.appendChild(
        el({
          classes: ['key'],
          text: 'intro prompt',
          style: `background-color: ${tableGradient.getCellColor(0, 0, 4, 2)}`
        })
      )
    }
  })
}

Model()
