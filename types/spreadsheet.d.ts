type CellLocation = {
  row: number
  col: number
}

type CellLocationWithPath = {
  location: CellLocation
  path: string
  extension: string
}

type RowTree = {
  rowId: number
  cells: Map<number, CellLocationWithPath>
}

type SheetTree = {
  sheetId: string
  rows: Map<number, RowTree>
}

type CellFromFile = {
  sheetId: string
  absolutePath: string
  location: CellLocation
}

type DragState = {
  isDragging: boolean
  canDrop: boolean
  cellLocation?: CellLocation
  dragEvent?: React.DragEvent<HTMLDivElement>
}
