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
      <div class="Line" style="font-weight:bold">glbot</div>
      <div style="grid-column-start: 2; grid-column-end: span 10;">
        <span class="Badge">Hello Transperfect</span> 
        <i class="subdued"> via<span>&nbsp;</span> </i>
        ${GLWebLogo()}
      </div>
      <div class="Line subdued" style="grid-column-end: span 10;">interact less, collaborate more,interact less, collaborate more</div>
    </div>
  `
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
    }
  })
}

Model()
