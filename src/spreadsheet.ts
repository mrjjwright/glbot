export function getRelativePathsContainingString(dir: string, searchString: string): string[] {
  let results: string[] = []

  const fs = require('fs')
  const path = require('path')

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
