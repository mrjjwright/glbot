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
