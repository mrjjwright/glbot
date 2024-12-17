import * as fs from 'fs'
import * as path from 'path'

import { simpleGit } from 'simple-git'

interface Cell {}

interface Sheet {
  name: Cell
  signals: Map<string, Cell>
  // add more ihere if needed
}

function getRelativePathsContainingString(dir: string, searchString: string): string[] {
  let results: string[] = []

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
