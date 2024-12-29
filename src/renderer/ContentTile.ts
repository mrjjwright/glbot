import { signal, Signal, effect } from 'alien-signals'
import { createCellGradient, DEFAULT_COLORS } from './interpolate'
import { el } from './dom'
import { PlatformPath } from 'path'

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
  path: PlatformPath
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
    const totalRows = this.data.get().lines.length + 1

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
    const root = el({ classes: ['ContentTile', 'control-tile', 'span-control-line', 'subgrid'] })

    effect(() => {
      while (root.children.length > 1) {
        root.removeChild(root.lastChild!)
      }

      const titleEl = el({
        classes: ['control-line', 'title'],
        style: `background-color: ${this.cellGradient.getCellColor(0, 0, 4, 2)}`,
        text: this.data.get().label || 'Content Tile'
      })
      titleEl.textContent = this.data.get().label || 'Content Tile'
      root.appendChild(titleEl)

      const data = this.data.get()

      data.lines.forEach((lineData, index) => {
        root.appendChild(this.createLineUI(lineData, index + 1))
      })
    })

    this.root = root
    return root
  }

  public resolve(relativePath: string): string {
    return this.context.path.resolve(this.context.basePath, relativePath)
  }
}
