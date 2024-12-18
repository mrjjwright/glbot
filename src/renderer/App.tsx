import * as ReactDOM from 'react-dom/client'
import Grid from 'src/renderer/components/Grid'
import DefaultLayout from 'src/renderer/components/page/DefaultLayout'
import Text from 'src/renderer/components/Text'
import Row from 'src/renderer/components/Row'
import Badge from 'src/renderer/components/Badge'
import GLWebLogo from 'src/renderer/components/GLWebLogo'
import Providers from 'src/renderer/components/Providers'
import { computed, effect, signal } from 'alien-signals'
import { getRelativePathsContainingString, getSheetTrees, load, saveCell } from 'src/spreadsheet'
import { useEffect, useRef, useState } from 'react'
import Panel from './components/Panel'
import CellPicker from './components/CellPicker'
import CellContent from './components/CellContent'

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

  const _selectedCell = signal<CellLocationWithPath | null>(null)

  const selectedCell = computed<CellLocationWithPath | null>(() => {
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
        return row.cells.get(colId)!
      }
    }
    return null
  })

  const selectedSheetTree = computed(() => {
    const sheetTreesVal = sheetTrees.value.get()
    return sheetTreesVal && sheetTreesVal.length ? sheetTreesVal[0] : undefined
  })

  const chosenFile = signal<string | null>(null)

  effect(() => {
    const file = chosenFile.get()
    const cell = selectedCell.get()

    if (file && cell) {
      saveCell({
        sheetId: '0',
        absolutePath: file,
        location: cell.location
      })
      sheetTrees.load.set(sheetTrees.load.get() + 1)
    }
  })

  return {
    state,
    sheetTrees,
    _selectedCell,
    selectedCell,
    selectedSheetTree,
    chosenFile
  }
}

function App() {
  const path = window.glbot.path

  const [state, setState] = useState(0)
  const model = useRef(Model())
  const effectRef = useRef<ReturnType<typeof effect>>(null!)
  const rootSheetPath = path.join(process.cwd(), 'www')

  useEffect(() => {
    effectRef.current = effect(() => {
      model.current.sheetTrees.value.get()
      model.current.selectedCell.get()
      console.log('State:', state)
      setState((s) => s + 1)
    })

    model.current.sheetTrees.load.set(model.current.sheetTrees.load.get() + 1)

    return () => effectRef.current.stop()
  }, [])

  const sheetTree = model.current.selectedSheetTree.get()
  const selectedCell = model.current.selectedCell.get()

  const handleCellClick = async (cell: CellLocationWithPath) => {
    model.current._selectedCell.set(cell)
    // const result = await window.glbot.dialog.showOpenDialog()
    // if (!result.canceled && result.filePaths.length > 0) {
    //   model.current.chosenFile.set(result.filePaths[0])
    // }
  }
  console.log('selectedCell', selectedCell, state)

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
        {sheetTree && selectedCell && (
          <Panel title="Sheet">
            <CellPicker
              activeSheet={0}
              sheetTree={sheetTree!}
              selectedCell={selectedCell!.location}
              onCellClick={handleCellClick}
            />
          </Panel>
        )}
        <Panel title={'Cell Content'}>
          <div className="App_cellContent">
            {selectedCell ? (
              <CellContent cell={selectedCell} rootSheetPath={rootSheetPath} />
            ) : (
              <Text>No cell selected</Text>
            )}
          </div>
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
