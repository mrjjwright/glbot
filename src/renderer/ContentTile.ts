import { signal, Signal, effect } from 'alien-signals'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createCellGradient, DEFAULT_COLORS } from './interpolate'
import { el, svg } from './dom'

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

  public static mockTileData(): ContentTileData {
    return {
      uuid: 'mock-' + Math.random().toString(36).substr(2, 9),
      label: 'Mock Content Tile',
      lines: [
        {
          path: '/mock/path1',
          content: 'mock content',
          label: 'First Item'
        },
        {
          path: '/mock/path2',
          content: 'mock content',
          label: 'Second Item'
        },
        {
          path: '/mock/path3',
          content: 'mock content',
          label: 'Third Item'
        }
      ]
    }
  }

  private loadData(): ContentTileData | undefined {
    const fullPath = this.resolve(this.jsonPath)
    try {
      return ContentTile.mockTileData()
      // const content = readFileSync(fullPath, 'utf-8')
      // return JSON.parse(content)
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

      const labelIcon = svg({
        paths: [
          {
            d: 'M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z'
          },
          { d: 'M6 6h.008v.008H6V6Z' }
        ]
      })

      root.appendChild(
        el({
          classes: ['label'],
          children: [labelIcon],
          style: `text-align: center; background-color: ${this.cellGradient.getCellColor(0, 0, 4, 2)}`
        })
      )

      root.appendChild(
        el({
          classes: ['content'],
          style: `background-color: ${this.cellGradient.getCellColor(0, 1, 4, 2)}`
        })
      )

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
