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

    const labelEl = document.createElement('div')
    labelEl.className = 'label'
    labelEl.textContent = lineData.label ?? ''
    labelEl.style.backgroundColor = this.cellGradient.getCellColor(index, 0, totalRows, 2)

    const contentEl = document.createElement('div')
    contentEl.className = 'content'
    contentEl.textContent = lineData.content ? '✓' : '✗'
    contentEl.style.backgroundColor = this.cellGradient.getCellColor(index, 1, totalRows, 2)

    fragment.appendChild(labelEl)
    fragment.appendChild(contentEl)
    return fragment
  }

  public buildUI(): HTMLElement {
    const root = document.createElement('div')
    root.className = 'control-line subgrid'

    effect(() => {
      while (root.children.length > 1) {
        root.removeChild(root.lastChild!)
      }

      const titleEl = document.createElement('div')
      titleEl.className = 'control-line title'
      titleEl.textContent = this.data.get().label || 'Content Tile'
      root.appendChild(titleEl)

      const data = this.data.get()

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
