import { useEffect, useState } from 'react'
import Text from './Text'

interface CellContentProps {
  cell: CellLocationWithPath
  rootSheetPath: string
}

export default function CellContent({ cell, rootSheetPath }: CellContentProps) {
  const [content, setContent] = useState<string>('')
  const { fs, path } = window.glbot


  useEffect(() => {
    if (cell.extension === '.txt' || cell.extension === '.md') {
      try {
        const fileContent = fs.readFileSync(path.join(rootSheetPath, cell.path), 'utf-8')
        setContent(fileContent)
      } catch (err) {
        setContent(`Error reading file: ${String(err)}`)
      }
    }
  }, [cell.path, rootSheetPath])

  switch (cell.extension) {
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
      return <img src={`http://localhost:8000/${cell.path}`} style={{ maxWidth: '100%' }} />
    case '.txt':
    case '.md':
      return <pre>{content}</pre>
    default:
      return cell.extension ? (
        <Text>Unsupported file type: {cell.extension}</Text>
      ) : (
        <Text>File has no extension</Text>
      )
  }
}
