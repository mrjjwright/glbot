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

function Model() {
  const path = window.glbot.path

  const rootSheetPath = path.join(process.cwd(), 'www')

  const state = signal(0)
  const sheetTrees = load(() => {
    const sheetPaths = getRelativePathsContainingString(rootSheetPath, '_sheet')
    const trees = getSheetTrees(sheetPaths)
    console.log('Sheet trees:', trees)
    return trees
  })

  const _selectedCell = signal<{ path: string; extension: string } | null>(null)

  const selectedCell = computed(() => {
    // First check if there's a manually selected cell
    const manualSelection = _selectedCell.get()
    if (manualSelection) return manualSelection

    // Otherwise fall back to first available cell
    const tree = selectedSheetTree.get()
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

  const selectedSheetTree = computed(() => {
    const sheetTreesVal = sheetTrees.value.get()
    return sheetTreesVal && sheetTreesVal.length ? sheetTreesVal[0] : undefined
  })

  return {
    state,
    sheetTrees,
    selectedCell,
    selectedSheetTree
  }
}

function App() {
  const fs = window.glbot.fs

  const [state, setState] = useState(0)
  const model = useRef(Model())
  const effectRef = useRef<ReturnType<typeof effect>>(null!)

  useEffect(() => {
    effectRef.current = effect(() => {
      const trees = model.current.sheetTrees.value.get()
      if (trees && trees.length > 0) {
        setState(state + 1)
      }
    })

    model.current.sheetTrees.load.set(true)

    return () => effectRef.current.stop()
  }, [])

  const sheetTree = model.current.selectedSheetTree.get()

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
      <Grid className="App_grid1">
        <Panel title="Sheet">
          <CellPicker activeSheet={0} sheetTree={sheetTree} />
        </Panel>
        <Panel title="Cell Content">
          {(() => {
            const cell = model.current.selectedCell.get()
            if (!cell) return <Text>No cell selected</Text>

            switch (cell.extension) {
              case '.png':
              case '.jpg':
              case '.jpeg':
              case '.gif':
                return (
                  <img src={`http://localhost:8000/${cell.path}`} style={{ maxWidth: '100%' }} />
                )
              case '.txt':
              case '.md':
                try {
                  const content = fs.readFileSync(cell.path, 'utf-8')
                  return <pre>{content}</pre>
                } catch (err) {
                  return <Text>Error reading file: {String(err)}</Text>
                }
              default:
                return cell.extension ? (
                  <Text>Unsupported file type: {cell.extension}</Text>
                ) : (
                  <Text>File has no extension</Text>
                )
            }
          })()}
        </Panel>
      </Grid>
    </DefaultLayout>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Providers>
    <App />
  </Providers>
)
