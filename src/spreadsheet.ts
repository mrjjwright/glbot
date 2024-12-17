import { signal } from 'alien-signals'
import { computed } from 'alien-signals'

export function getRelativePathsContainingString(dir: string, searchString: string): string[] {
  let results: string[] = []

  const { fs, path } = window.glbot

  function recursiveSearch(currentDir: string) {
    const files = fs.readdirSync(currentDir)

    for (const file of files) {
      const fullPath = path.join(currentDir, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        recursiveSearch(fullPath)
      } else if (stat.isFile() && fullPath.includes(searchString)) {
        results.push(path.relative(dir, fullPath))
      }
    }
  }

  recursiveSearch(dir)
  return results
}

export function load<T>(onLoad: () => T) {
  const load = signal(false)
  const value = computed(() => {
    if (load.get()) {
      return onLoad()
    }
    return undefined as T | undefined
  })

  return {
    load,
    value
  }
}

export function saveCell(params: CellFromFile) {
  const { fs, path } = window.glbot

  const { sheetId, absolutePath, location } = params
  const { row, col } = location

  // Create directory structure if it doesn't exist
  const sheetDir = path.join(process.cwd(), `sheet_${sheetId}`)
  const rowDir = path.join(sheetDir, `row_${row}`)
  fs.mkdirSync(sheetDir, { recursive: true })
  fs.mkdirSync(rowDir, { recursive: true })

  // Copy file to destination
  const destPath = path.join(rowDir, `cell${col}`)
  fs.copyFileSync(absolutePath, destPath)
}

export function getSheetTrees(rootDir: string): SheetTree[] {
  const { path } = window.glbot
  const sheetPaths = getRelativePathsContainingString(rootDir, 'sheet_')

  const sheets = new Map<string, SheetTree>()

  for (const p of sheetPaths) {
    const normalizedPath = path.normalize(p)
    const parts = normalizedPath.split(path.sep)
    const sheetMatch = parts[0].match(/^sheet_(\d+)$/)
    if (!sheetMatch) continue

    const sheetId = sheetMatch[1]
    let sheet = sheets.get(sheetId)
    if (!sheet) {
      sheet = {
        sheetId,
        rows: new Map()
      }
      sheets.set(sheetId, sheet)
    }

    if (parts.length < 2) continue
    const rowMatch = parts[1].match(/^row_(\d+)$/)
    if (!rowMatch) continue

    const rowId = parseInt(rowMatch[1])
    let row = sheet.rows.get(rowId)
    if (!row) {
      row = {
        rowId,
        cells: new Map()
      }
      sheet.rows.set(rowId, row)
    }

    if (parts.length < 3) continue
    const cellMatch = parts[2].match(/^cell_(\d+)$/)
    if (!cellMatch) continue

    const colNumber = parseInt(cellMatch[1])
    row.cells.set(colNumber, true)
  }

  return Array.from(sheets.values())
}
