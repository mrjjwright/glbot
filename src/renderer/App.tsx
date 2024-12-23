import { effect, signal } from 'alien-signals'

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
}

function el(options: ElementOptions = {}) {
  const el = document.createElement(options.tag ?? 'div')
  if (options.text) {
    el.textContent = options.text
  }
  for (let c of options.classes ?? []) {
    el.classList.add(c)
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
      app.appendChild(el({ classes: ['line'], text: 'GLWeb Translation Profile Prompt' }))
    }
  })
}

Model()
