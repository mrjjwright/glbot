type CellLocation = {
  row: number
  col: number
}

type CellFromFile = {
  sheetId: string
  absolutePath: string
  location: CellLocation
}
