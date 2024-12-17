import * as ReactDOM from 'react-dom/client'
import Grid from 'src/renderer/components/Grid'
import DefaultLayout from 'src/renderer/components/page/DefaultLayout'
import Text from 'src/renderer/components/Text'
import Row from 'src/renderer/components/Row'
import Badge from 'src/renderer/components/Badge'
import GLWebLogo from 'src/renderer/components/GLWebLogo'
import Providers from 'src/renderer/components/Providers'
import { computed, effect, signal } from 'alien-signals'
import { getRelativePathsContainingString, getSheetTrees, load } from 'src/spreadsheet'
import { useEffect, useRef, useState } from 'react'
import Panel from './components/Panel'
import CellPicker from './components/CellPicker'

// Live reload in development
if (process.env.NODE_ENV !== 'production') {
  new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

function App() {

  const fs = window.glbot.fs
  const path = window.glbot.path

  const rootSheetPath = path.join(process.cwd(), 'www')
  
  const [state, setState] = useState(0)
  const sheetTrees = useRef(
    load(() => {
      const sheetPaths = getRelativePathsContainingString(rootSheetPath, '_sheet')
      const trees = getSheetTrees(sheetPaths)
      console.log('Sheet trees:', trees)
      return trees
    })
  )

  // Add signal for manual cell selection
  const _selectedCell = useRef(signal<{ path: string; extension: string } | null>(null))

  const selectedSheetTree = useRef(
    computed(() => {
      const sheetTreesVal = sheetTrees.current.value.get()
      return sheetTreesVal && sheetTreesVal.length ? sheetTreesVal[0] : undefined
    })
  )
  const effectRef = useRef<ReturnType<typeof effect>>(null!)

  const selectedCell = useRef(
    computed(() => {
      // First check if there's a manually selected cell
      const manualSelection = _selectedCell.current.get()
      if (manualSelection) return manualSelection

      // Otherwise fall back to first available cell
      const tree = selectedSheetTree.current.get()
      if (!tree) return null

      // Find first cell in first row that has cells
      for (const [_, row] of tree.rows) {
        if (row.cells.size > 0) {
          const colId = Array.from(row.cells.keys())[0] // Get first column
          const cellPath = row.cells.get(colId)!
          return {
            path: cellPath,
            extension: path.extname(cellPath).toLowerCase()
          }
        }
      }
      return null
    })
  )

  useEffect(() => {
    effectRef.current = effect(() => {
      const trees = sheetTrees.current.value.get()
      if (trees && trees.length > 0) {
        setState(state + 1)
      }
    })

    sheetTrees.current.load.set(true)

    return () => effectRef.current.stop()
  }, [])

  const sheetTree = selectedSheetTree.current.get()

  return (
    <DefaultLayout previewPixelSRC="/assets/glweb.svg">
      <Grid>
        <Row>
          <strong>
            glbot <Badge>Hello Transperfect</Badge>
          </strong>
          <i className="text-subdued">
            via<span>&nbsp;</span>
          </i>
          <GLWebLogo />
        </Row>
        <Row>
          <Text className="text-subdued">interact less, collaborate more</Text>
        </Row>
      </Grid>
      <Grid>
        <Row style={{ display: 'flex', gap: '1rem' }}>
          <Panel title="Sheet">
            <CellPicker activeSheet={0} sheetTree={sheetTree} />
          </Panel>
          <Panel title="Cell Content">
            {(() => {
              const cell = selectedCell.current.get()
              if (!cell) return <Text>No cell selected</Text>

              switch (cell.extension) {
                case '.png':
                case '.jpg':
                case '.jpeg':
                case '.gif':
                  return <img src={`http://localhost:8000/${cell.path}`} style={{ maxWidth: '100%' }} />
                case '.txt':
                case '.md':
                  try {
                    const content = fs.readFileSync(cell.path, 'utf-8')
                    return <pre>{content}</pre>
                  } catch (err) {
                    return <Text>Error reading file: {String(err)}</Text>
                  }
                default:
                  return cell.extension 
                    ? <Text>Unsupported file type: {cell.extension}</Text>
                    : <Text>File has no extension</Text>
              }
            })()}
          </Panel>
        </Row>
      </Grid>
    </DefaultLayout>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Providers>
    <App />
  </Providers>
)
