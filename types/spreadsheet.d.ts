
type RowTree = {
  rowId: number
  cells: Map<number, boolean>
}

type SheetTree = {
  sheetId: string
  rows: Map<row, RowTree>
}

type CellLocation = {
  row: number
  col: number
}

type CellFromFile = {
  sheetId: string
  absolutePath: string
  location: CellLocation
}
