import { signal, Signal, effect } from 'alien-signals'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createCellGradient, DEFAULT_COLORS } from './interpolate'

interface ContentLineData<T = any> {
  path: string
  content?: T
  label?: string
}

interface ContentTileData {
  uuid: string
  label?: string
  lines: ContentLineData[]
}

interface TileContext {
  basePath: string
}

export class ContentTile {
  private data: Signal<ContentTileData | undefined>
  private cellGradient = createCellGradient(DEFAULT_COLORS.grayScale)
  private underlyingError = signal<string | undefined>(undefined)
  public root: HTMLElement | undefined

  constructor(
    public context: TileContext,
    public jsonPath: string
  ) {
    this.data = signal(this.loadData())
  }

  private loadData(): ContentTileData | undefined {
    const fullPath = this.resolve(this.jsonPath)
    try {
      const content = readFileSync(fullPath, 'utf-8')
      return JSON.parse(content)
    } catch (err) {
      console.error(`Failed to load content tile from ${fullPath}:`, err)
      if (err instanceof Error) {
        this.underlyingError.set(err.message)
      }
      return undefined
    }
  }

  private createLineUI(lineData: ContentLineData, index: number): DocumentFragment {
    const fragment = document.createDocumentFragment()
    const totalRows = this.data.get().lines.length

    const keyEl = document.createElement('div')
    keyEl.className = 'key'
    keyEl.textContent = lineData.label ?? ''
    keyEl.style.backgroundColor = this.cellGradient.getCellColor(index, 0, totalRows, 2)

    const valueEl = document.createElement('div')
    valueEl.className = 'value'
    valueEl.textContent = lineData.content ? '✓' : '✗'
    valueEl.style.backgroundColor = this.cellGradient.getCellColor(index, 1, totalRows, 2)

    fragment.appendChild(keyEl)
    fragment.appendChild(valueEl)
    return fragment
  }

  public buildUI(): HTMLElement {
    const root = document.createElement('div')
    root.className = 'ContentTile span-line subgrid'

    const titleEl = document.createElement('div')
    titleEl.className = 'control-line title'
    titleEl.textContent = this.data.get().label || 'Content Tile'
    root.appendChild(titleEl)

    effect(() => {
      const data = this.data.get()
      // Clear existing pairs
      while (root.children.length > 1) {
        root.removeChild(root.lastChild!)
      }

      // Add new pairs
      data.lines.forEach((lineData, index) => {
        root.appendChild(this.createLineUI(lineData, index))
      })
    })

    this.root = root
    return root
  }

  public resolve(relativePath: string): string {
    return resolve(this.context.basePath, relativePath)
  }
}
