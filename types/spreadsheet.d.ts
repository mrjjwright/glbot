interface CellRange {
  startRow: number
  startCol: number
  endRow: number
  endCol: number
}

interface CellData {
  (range: CellRange): any[]
}

interface Line {
  ranges: CellRange[]
  data: CellData
}

type ObjectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'

interface UIImage {
  src: string
  objectFit: ObjectFit
}

type DragState = {
  isDragging: boolean
  canDrop: boolean
  cellLocation?: CellLocation
  dragEvent?: React.DragEvent<HTMLDivElement>
}
