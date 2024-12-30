import { Effect } from 'effect'

interface ElementOptions {
  tag?: string
  text?: string
  classes?: string[]
  style?: string
  html?: string
  children?: Node[]
}

export function el(options: ElementOptions = {}) {
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

export function svg(options: ElementOptions & { paths: { d: string }[] }) {
  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  if (options.classes) {
    for (let c of options.classes) {
      svgElement.classList.add(c)
    }
  }
  svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svgElement.setAttribute('viewBox', '0 0 24 24')
  svgElement.setAttribute('fill', 'none')
  svgElement.setAttribute('stroke', 'currentColor')
  svgElement.setAttribute('stroke-width', '1.5')
  svgElement.setAttribute('stroke-linecap', 'round')
  svgElement.setAttribute('stroke-linejoin', 'round')

  if (options.paths) {
    for (const path of options.paths) {
      const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      svgPath.setAttribute('d', path.d)
      svgElement.appendChild(svgPath)
    }
    // Create the path element properly
  }

  if (options.style) {
    svgElement.setAttribute('style', options.style)
  }

  return svgElement
}

export function tagIcon() {
  return svg({
    classes: ['label', 'icon-inline'],
    paths: [
      {
        d: 'M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z'
      },
      { d: 'M6 6h.008v.008H6V6Z' }
    ]
  })
}

// Define the document load resource interface
interface DocumentLoadResource {
  readonly handler: EventListener
  readonly cleanup: () => void
}

// Define how the resource is acquired
const acquire = Effect.tryPromise({
  try: () =>
    new Promise<DocumentLoadResource>((resolve) => {
      const handler: EventListener = () => {
        console.log('Document is loaded.')
        resolve({
          handler,
          cleanup: () => {
            console.log('removing handler for DOMContentLoaded', handler)
            document.removeEventListener('DOMContentLoaded', handler)
          }
        })
      }
      document.addEventListener('DOMContentLoaded', handler)
    }),
  catch: () => new Error('documentLoadError')
})

// Define how the resource is released
const release = (resource: DocumentLoadResource) => Effect.sync(() => resource.cleanup())

// Create the resource management workflow
export const documentLoad = Effect.acquireRelease(acquire, release)
