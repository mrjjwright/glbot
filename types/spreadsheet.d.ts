
type RowTree = {
  rowId: string
  cells: Map<number, boolean>
}

type SheetTree = {
  sheetId: string
  rows: Map<string, RowTree>
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
