interface TrackValue {
  value?: string
  type: 'px' | 'fr' | '%' | 'auto'
  numeric?: number
}

interface GutterOptions {
  element?: HTMLElement
  track: number
  minSizeStart: number
  minSizeEnd: number
  maxSizeStart: number
  maxSizeEnd: number
}

interface GridOptions {
  columnGutters?: Array<{ element?: HTMLElement; track: number }>
  rowGutters?: Array<{ element?: HTMLElement; track: number }>
  columnMinSizes?: Record<number, number>
  rowMinSizes?: Record<number, number>
  columnMaxSizes?: Record<number, number>
  rowMaxSizes?: Record<number, number>
  columnMinSize?: number
  rowMinSize?: number
  columnMaxSize?: number
  rowMaxSize?: number
  minSize?: number
  maxSize?: number
  columnCursor?: string
  rowCursor?: string
  cursor?: string
  columnSnapOffset?: number
  rowSnapOffset?: number
  snapOffset?: number
  columnDragInterval?: number
  rowDragInterval?: number
  dragInterval?: number
  onDragStart?: (direction: 'column' | 'row', track: number) => void
  onDragEnd?: (direction: 'column' | 'row', track: number) => void
  onDrag?: (direction: 'column' | 'row', track: number, style: string) => void
  writeStyle?: (element: HTMLElement, gridTemplateProp: string, style: string) => void
  gridTemplateColumns?: string
  gridTemplateRows?: string
}

const numeric = (value: string, unit: string): number => Number(value.slice(0, -1 * unit.length))

const parseValue = (value: string): TrackValue | null => {
  if (value.endsWith('px')) return { value, type: 'px', numeric: numeric(value, 'px') }
  if (value.endsWith('fr')) return { value, type: 'fr', numeric: numeric(value, 'fr') }
  if (value.endsWith('%')) return { value, type: '%', numeric: numeric(value, '%') }
  if (value === 'auto') return { value, type: 'auto' }
  return null
}

export const parse = (rule: string): TrackValue[] =>
  rule
    .split(' ')
    .map(parseValue)
    .filter((value): value is TrackValue => value !== null)

export const combine = (rule: string | undefined, tracks: TrackValue[]): string => {
  const prevTracks = rule ? rule.split(' ') : []

  tracks.forEach((track, i) => {
    if (i > prevTracks.length - 1) {
      throw new Error(
        `Unable to set size of track index ${i}, there are only ${
          prevTracks.length
        } tracks in the grid layout.`
      )
    }

    prevTracks[i] = track.value ? track.value : `${track.numeric}${track.type}`
  })

  return prevTracks.join(' ')
}

export const getMatchedCSSRules = (el: Element): CSSStyleRule[] =>
  ([] as CSSStyleRule[])
    .concat(
      ...Array.from(el.ownerDocument.styleSheets).map((s) => {
        let rules: CSSStyleRule[] = []

        try {
          rules = Array.from(s.cssRules || []) as CSSStyleRule[]
        } catch (e) {
          // Ignore results on security error
        }

        return rules
      })
    )
    .filter((r) => {
      let matches = false
      try {
        matches = el.matches(r.selectorText)
      } catch (e) {
        // Ignore matching errors
      }

      return matches
    })

export const getSizeAtTrack = (
  index: number,
  tracks: TrackValue[],
  gap: number,
  end: boolean
): number => {
  const newIndex = end ? index + 1 : index
  const trackSum = tracks
    .slice(0, newIndex)
    .reduce((accum, value) => accum + (value.numeric || 0), 0)
  const gapSum = gap ? index * gap : 0

  return trackSum + gapSum
}

const gridTemplatePropColumns = 'grid-template-columns'
const gridTemplatePropRows = 'grid-template-rows'

class Gutter {
  direction: 'column' | 'row'
  element?: HTMLElement
  track: number
  gridTemplateProp: string = ''
  gridGapProp: string = ''
  cursor: string = ''
  snapOffset: number = 0
  dragInterval: number = 1
  clientAxis: 'clientX' | 'clientY' = 'clientX'
  optionStyle?: string
  onDragStart: (direction: 'column' | 'row', track: number) => void
  onDragEnd: (direction: 'column' | 'row', track: number) => void
  onDrag: (direction: 'column' | 'row', track: number, style: string) => void
  writeStyle: (element: HTMLElement, gridTemplateProp: string, style: string) => void
  minSizeStart: number
  minSizeEnd: number
  maxSizeStart: number
  maxSizeEnd: number
  grid!: HTMLElement
  start: number = 0
  end: number = 0
  size: number = 0
  tracks: string[] = []
  trackValues: TrackValue[] = []
  computedTracks: string[] = []
  computedPixels: TrackValue[] = []
  gap?: string
  computedGap?: string
  computedGapPixels: number = 0
  totalFrs: number = 0
  frToPixels: number = 0
  percentageToPixels: number = 0
  dragStartOffset: number = 0
  aTrack!: number
  bTrack!: number
  aTrackStart!: number
  bTrackEnd!: number
  dragging: boolean = false
  needsDestroy: boolean = false
  destroyCb: (() => void) | null = null

  constructor(direction: 'column' | 'row', options: GutterOptions, parentOptions: GridOptions) {
    this.direction = direction
    this.element = options.element
    this.track = options.track

    if (direction === 'column') {
      this.gridTemplateProp = gridTemplatePropColumns
      this.gridGapProp = 'grid-column-gap'
      this.cursor = getOption(
        parentOptions,
        'columnCursor',
        getOption(parentOptions, 'cursor', 'col-resize')
      )
      this.snapOffset = getOption(
        parentOptions,
        'columnSnapOffset',
        getOption(parentOptions, 'snapOffset', 30)
      )
      this.dragInterval = getOption(
        parentOptions,
        'columnDragInterval',
        getOption(parentOptions, 'dragInterval', 1)
      )
      this.clientAxis = 'clientX'
      this.optionStyle = getOption(parentOptions, 'gridTemplateColumns')
    } else if (direction === 'row') {
      this.gridTemplateProp = gridTemplatePropRows
      this.gridGapProp = 'grid-row-gap'
      this.cursor = getOption(
        parentOptions,
        'rowCursor',
        getOption(parentOptions, 'cursor', 'row-resize')
      )
      this.snapOffset = getOption(
        parentOptions,
        'rowSnapOffset',
        getOption(parentOptions, 'snapOffset', 30)
      )
      this.dragInterval = getOption(
        parentOptions,
        'rowDragInterval',
        getOption(parentOptions, 'dragInterval', 1)
      )
      this.clientAxis = 'clientY'
      this.optionStyle = getOption(parentOptions, 'gridTemplateRows')
    }

    this.onDragStart = getOption(parentOptions, 'onDragStart', NOOP)
    this.onDragEnd = getOption(parentOptions, 'onDragEnd', NOOP)
    this.onDrag = getOption(parentOptions, 'onDrag', NOOP)
    this.writeStyle = getOption(parentOptions, 'writeStyle', defaultWriteStyle)

    this.minSizeStart = options.minSizeStart
    this.minSizeEnd = options.minSizeEnd
    this.maxSizeStart = options.maxSizeStart
    this.maxSizeEnd = options.maxSizeEnd

    this.startDragging = this.startDragging.bind(this)
    this.stopDragging = this.stopDragging.bind(this)
    this.drag = this.drag.bind(this)

    if (this.element) {
      this.element.addEventListener('mousedown', this.startDragging)
      this.element.addEventListener('touchstart', this.startDragging)
    }
  }

  getDimensions(): void {
    const { width, height, top, bottom, left, right } = this.grid.getBoundingClientRect()

    if (this.direction === 'column') {
      this.start = top
      this.end = bottom
      this.size = height
    } else {
      this.start = left
      this.end = right
      this.size = width
    }
  }

  getSizeAtTrack(track: number, end: boolean): number {
    return getSizeAtTrack(track, this.computedPixels, this.computedGapPixels, end)
  }

  getSizeOfTrack(track: number): number {
    const trackValue = this.computedPixels[track]
    return trackValue?.numeric || 0
  }

  getRawTracks(): string {
    const tracks = getStyles(this.gridTemplateProp, [this.grid], getMatchedCSSRules(this.grid))
    if (!tracks.length) {
      if (this.optionStyle) return this.optionStyle
      throw Error('Unable to determine grid template tracks from styles.')
    }
    return tracks[0]
  }

  getGap(): string | null {
    const gap = getStyles(this.gridGapProp, [this.grid], getMatchedCSSRules(this.grid))
    if (!gap.length) {
      return null
    }
    return gap[0]
  }

  getRawComputedTracks(): string {
    return window.getComputedStyle(this.grid)[this.gridTemplateProp as any]
  }

  getRawComputedGap(): string {
    return window.getComputedStyle(this.grid)[this.gridGapProp as any]
  }

  setTracks(raw: string): void {
    this.tracks = raw.split(' ')
    this.trackValues = parse(raw)
  }

  setComputedTracks(raw: string): void {
    this.computedTracks = raw.split(' ')
    this.computedPixels = parse(raw)
  }

  setGap(raw: string | null): void {
    if (raw) this.gap = raw
  }

  setComputedGap(raw: string): void {
    this.computedGap = raw
    this.computedGapPixels = getGapValue('px', raw) || 0
  }

  getMousePosition(e: MouseEvent | TouchEvent): number {
    if ('touches' in e) return e.touches[0][this.clientAxis]
    return (e as MouseEvent)[this.clientAxis]
  }

  startDragging(e: MouseEvent | TouchEvent): void {
    if ('button' in e && e.button !== 0) {
      return
    }

    e.preventDefault()

    if (this.element) {
      this.grid = this.element.parentNode as HTMLElement
    } else {
      const target = e.target
      if (target instanceof HTMLElement && target.parentNode instanceof HTMLElement) {
        this.grid = target.parentNode
      } else {
        throw new Error('Grid parent must be an HTMLElement')
      }
    }

    this.getDimensions()
    this.setTracks(this.getRawTracks())
    this.setComputedTracks(this.getRawComputedTracks())
    this.setGap(this.getGap())
    this.setComputedGap(this.getRawComputedGap())

    const trackPercentage = this.trackValues.filter(
      (track): track is TrackValue => track.type === '%'
    )
    const trackFr = this.trackValues.filter((track): track is TrackValue => track.type === 'fr')

    this.totalFrs = trackFr.length

    if (this.totalFrs) {
      const track = firstNonZero(trackFr)
      if (track !== null) {
        const computedPixel = this.computedPixels[track]
        const trackFrValue = trackFr[track]
        if (computedPixel && trackFrValue && computedPixel.numeric && trackFrValue.numeric) {
          this.frToPixels = computedPixel.numeric / trackFrValue.numeric
        }
      }
    }

    if (trackPercentage.length) {
      const track = firstNonZero(trackPercentage)
      if (track !== null) {
        const computedPixel = this.computedPixels[track]
        const trackPercentageValue = trackPercentage[track]
        if (
          computedPixel &&
          trackPercentageValue &&
          computedPixel.numeric &&
          trackPercentageValue.numeric
        ) {
          this.percentageToPixels = computedPixel.numeric / trackPercentageValue.numeric
        }
      }
    }

    const gutterStart = this.getSizeAtTrack(this.track, false) + this.start
    this.dragStartOffset = this.getMousePosition(e) - gutterStart

    this.aTrack = this.track - 1

    if (this.track < this.tracks.length - 1) {
      this.bTrack = this.track + 1
    } else {
      throw Error(
        `Invalid track index: ${this.track}. Track must be between two other tracks and only ${this.tracks.length} tracks were found.`
      )
    }

    this.aTrackStart = this.getSizeAtTrack(this.aTrack, false) + this.start
    this.bTrackEnd = this.getSizeAtTrack(this.bTrack, true) + this.start

    this.dragging = true

    window.addEventListener('mouseup', this.stopDragging)
    window.addEventListener('touchend', this.stopDragging)
    window.addEventListener('touchcancel', this.stopDragging)
    window.addEventListener('mousemove', this.drag)
    window.addEventListener('touchmove', this.drag)

    this.grid.addEventListener('selectstart', NOOP)
    this.grid.addEventListener('dragstart', NOOP)

    this.grid.style.userSelect = 'none'
    this.grid.style.pointerEvents = 'none'

    this.grid.style.cursor = this.cursor
    window.document.body.style.cursor = this.cursor

    this.onDragStart(this.direction, this.track)
  }

  stopDragging(): void {
    this.dragging = false
    this.cleanup()
    this.onDragEnd(this.direction, this.track)

    if (this.needsDestroy) {
      if (this.element) {
        this.element.removeEventListener('mousedown', this.startDragging)
        this.element.removeEventListener('touchstart', this.startDragging)
      }
      if (this.destroyCb) {
        this.destroyCb()
      }
      this.needsDestroy = false
      this.destroyCb = null
    }
  }

  drag(e: MouseEvent | TouchEvent): void {
    let mousePosition = this.getMousePosition(e)

    const gutterSize = this.getSizeOfTrack(this.track)
    const minMousePosition = Math.max(
      this.aTrackStart + this.minSizeStart + this.dragStartOffset + this.computedGapPixels,
      this.bTrackEnd -
        this.maxSizeEnd -
        this.computedGapPixels -
        (gutterSize - this.dragStartOffset)
    )
    const maxMousePosition = Math.min(
      this.bTrackEnd -
        this.minSizeEnd -
        this.computedGapPixels -
        (gutterSize - this.dragStartOffset),
      this.aTrackStart + this.maxSizeStart + this.dragStartOffset + this.computedGapPixels
    )
    const minMousePositionOffset = minMousePosition + this.snapOffset
    const maxMousePositionOffset = maxMousePosition - this.snapOffset

    if (mousePosition < minMousePositionOffset) {
      mousePosition = minMousePosition
    }

    if (mousePosition > maxMousePositionOffset) {
      mousePosition = maxMousePosition
    }

    if (mousePosition < minMousePosition) {
      mousePosition = minMousePosition
    } else if (mousePosition > maxMousePosition) {
      mousePosition = maxMousePosition
    }

    let aTrackSize =
      mousePosition - this.aTrackStart - this.dragStartOffset - this.computedGapPixels
    let bTrackSize =
      this.bTrackEnd - mousePosition + this.dragStartOffset - gutterSize - this.computedGapPixels

    if (this.dragInterval > 1) {
      const aTrackSizeIntervaled = Math.round(aTrackSize / this.dragInterval) * this.dragInterval
      bTrackSize -= aTrackSizeIntervaled - aTrackSize
      aTrackSize = aTrackSizeIntervaled
    }

    if (aTrackSize < this.minSizeStart) {
      aTrackSize = this.minSizeStart
    }

    if (bTrackSize < this.minSizeEnd) {
      bTrackSize = this.minSizeEnd
    }

    const aTrackValue = this.trackValues[this.aTrack]
    const bTrackValue = this.trackValues[this.bTrack]

    if (aTrackValue && bTrackValue) {
      if (aTrackValue.type === 'px') {
        this.tracks[this.aTrack] = `${aTrackSize}px`
      } else if (aTrackValue.type === 'fr') {
        if (this.totalFrs === 1) {
          this.tracks[this.aTrack] = '1fr'
        } else {
          const targetFr = aTrackSize / this.frToPixels
          this.tracks[this.aTrack] = `${targetFr}fr`
        }
      } else if (aTrackValue.type === '%') {
        const targetPercentage = aTrackSize / this.percentageToPixels
        this.tracks[this.aTrack] = `${targetPercentage}%`
      }

      if (bTrackValue.type === 'px') {
        this.tracks[this.bTrack] = `${bTrackSize}px`
      } else if (bTrackValue.type === 'fr') {
        if (this.totalFrs === 1) {
          this.tracks[this.bTrack] = '1fr'
        } else {
          const targetFr = bTrackSize / this.frToPixels
          this.tracks[this.bTrack] = `${targetFr}fr`
        }
      } else if (bTrackValue.type === '%') {
        const targetPercentage = bTrackSize / this.percentageToPixels
        this.tracks[this.bTrack] = `${targetPercentage}%`
      }
    }

    const style = this.tracks.join(' ')
    this.writeStyle(this.grid, this.gridTemplateProp, style)
    this.onDrag(this.direction, this.track, style)
  }

  cleanup(): void {
    window.removeEventListener('mouseup', this.stopDragging)
    window.removeEventListener('touchend', this.stopDragging)
    window.removeEventListener('touchcancel', this.stopDragging)
    window.removeEventListener('mousemove', this.drag)
    window.removeEventListener('touchmove', this.drag)

    if (this.grid) {
      this.grid.removeEventListener('selectstart', NOOP)
      this.grid.removeEventListener('dragstart', NOOP)

      this.grid.style.userSelect = ''
      this.grid.style.pointerEvents = ''

      this.grid.style.cursor = ''
    }

    window.document.body.style.cursor = ''
  }

  public destroy(immediate: boolean = true, cb?: () => void): void {
    if (immediate || this.dragging === false) {
      this.cleanup()
      if (this.element) {
        this.element.removeEventListener('mousedown', this.startDragging)
        this.element.removeEventListener('touchstart', this.startDragging)
      }

      if (cb) {
        cb()
      }
    } else {
      this.needsDestroy = true
      if (cb) {
        this.destroyCb = cb
      }
    }
  }
}

const getTrackOption = <T>(options: Record<number, T>, track: number, defaultValue: T): T => {
  if (track in options) {
    return options[track]
  }
  return defaultValue
}

export const getStyles = (
  rule: string,
  ownRules: HTMLElement[],
  matchedRules: CSSStyleRule[]
): string[] =>
  [...ownRules, ...matchedRules]
    .map((r) => {
      if (r instanceof HTMLElement) {
        return r.style[rule as any]
      }
      return r.style[rule as any]
    })
    .filter((style): style is string => style !== undefined && style !== '')

export const getGapValue = (unit: string, size: string): number | null => {
  if (size.endsWith(unit)) {
    return Number(size.slice(0, -1 * unit.length))
  }
  return null
}

export const firstNonZero = (tracks: TrackValue[]): number | null => {
  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].numeric && tracks[i].numeric! > 0) {
      return i
    }
  }
  return null
}

export const NOOP = (): boolean => false

export const defaultWriteStyle = (
  element: HTMLElement,
  gridTemplateProp: string,
  style: string
): void => {
  element.style[gridTemplateProp as any] = style
}

export const getOption = (options: GridOptions, propName: string, defaultValue?: any): any => {
  const value = options[propName]
  if (value !== undefined) {
    return value
  }
  return defaultValue
}

const createGutter =
  (direction: 'column' | 'row', options: GridOptions) =>
  (gutterOptions: { element?: HTMLElement; track: number }): Gutter => {
    if (gutterOptions.track < 1) {
      throw Error(
        `Invalid track index: ${gutterOptions.track}. Track must be between two other tracks.`
      )
    }

    const trackMinSizes =
      direction === 'column' ? options.columnMinSizes || {} : options.rowMinSizes || {}
    const trackMaxSizes =
      direction === 'column' ? options.columnMaxSizes || {} : options.rowMaxSizes || {}
    const trackMinSize = direction === 'column' ? 'columnMinSize' : 'rowMinSize'
    const trackMaxSize = direction === 'column' ? 'columnMaxSize' : 'rowMaxSize'

    return new Gutter(
      direction,
      {
        minSizeStart: getTrackOption(
          trackMinSizes,
          gutterOptions.track - 1,
          getOption(options, trackMinSize, getOption(options, 'minSize', 0))
        ),
        minSizeEnd: getTrackOption(
          trackMinSizes,
          gutterOptions.track + 1,
          getOption(options, trackMinSize, getOption(options, 'minSize', 0))
        ),
        maxSizeStart: getTrackOption(
          trackMaxSizes,
          gutterOptions.track - 1,
          getOption(options, trackMaxSize, getOption(options, 'maxSize', Infinity))
        ),
        maxSizeEnd: getTrackOption(
          trackMaxSizes,
          gutterOptions.track + 1,
          getOption(options, trackMaxSize, getOption(options, 'maxSize', Infinity))
        ),
        ...gutterOptions
      },
      options
    )
  }

class Grid {
  columnGutters: Record<number, Gutter>
  rowGutters: Record<number, Gutter>
  options: GridOptions

  constructor(options: GridOptions) {
    this.columnGutters = {}
    this.rowGutters = {}

    this.options = {
      columnGutters: options.columnGutters || [],
      rowGutters: options.rowGutters || [],
      columnMinSizes: options.columnMinSizes || {},
      rowMinSizes: options.rowMinSizes || {},
      columnMaxSizes: options.columnMaxSizes || {},
      rowMaxSizes: options.rowMaxSizes || {},
      ...options
    }

    this.options.columnGutters?.forEach((gutterOptions) => {
      this.columnGutters[gutterOptions.track] = createGutter('column', this.options)(gutterOptions)
    })

    this.options.rowGutters?.forEach((gutterOptions) => {
      this.rowGutters[gutterOptions.track] = createGutter('row', this.options)(gutterOptions)
    })
  }

  addColumnGutter(element: HTMLElement, track: number): void {
    if (this.columnGutters[track]) {
      this.columnGutters[track].destroy()
    }

    this.columnGutters[track] = createGutter(
      'column',
      this.options
    )({
      element,
      track
    })
  }

  addRowGutter(element: HTMLElement, track: number): void {
    if (this.rowGutters[track]) {
      this.rowGutters[track].destroy()
    }

    this.rowGutters[track] = createGutter(
      'row',
      this.options
    )({
      element,
      track
    })
  }

  removeColumnGutter(track: number, immediate: boolean = true): void {
    if (this.columnGutters[track]) {
      this.columnGutters[track].destroy(immediate, () => {
        delete this.columnGutters[track]
      })
    }
  }

  removeRowGutter(track: number, immediate: boolean = true): void {
    if (this.rowGutters[track]) {
      this.rowGutters[track].destroy(immediate, () => {
        delete this.rowGutters[track]
      })
    }
  }

  handleDragStart(e: MouseEvent | TouchEvent, direction: 'column' | 'row', track: number): void {
    if (direction === 'column') {
      if (this.columnGutters[track]) {
        this.columnGutters[track].destroy()
      }

      this.columnGutters[track] = createGutter(
        'column',
        this.options
      )({
        track
      })
      this.columnGutters[track].startDragging(e)
    } else if (direction === 'row') {
      if (this.rowGutters[track]) {
        this.rowGutters[track].destroy()
      }

      this.rowGutters[track] = createGutter(
        'row',
        this.options
      )({
        track
      })
      this.rowGutters[track].startDragging(e)
    }
  }

  destroy(immediate: boolean = true): void {
    Object.keys(this.columnGutters).forEach((track) =>
      this.columnGutters[Number(track)].destroy(immediate, () => {
        delete this.columnGutters[Number(track)]
      })
    )
    Object.keys(this.rowGutters).forEach((track) =>
      this.rowGutters[Number(track)].destroy(immediate, () => {
        delete this.rowGutters[Number(track)]
      })
    )
  }
}

export default (options: GridOptions): Grid => new Grid(options)
