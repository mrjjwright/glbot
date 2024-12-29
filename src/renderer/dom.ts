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

export function svg(options: ElementOptions) {
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
