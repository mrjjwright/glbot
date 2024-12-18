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
  rows: Map<row, RowTree>
}

type CellFromFile = {
  sheetId: string
  absolutePath: string
  location: CellLocation
}
