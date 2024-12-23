import * as ReactDOM from 'react-dom/client'
import Grid from 'src/renderer/components/Grid'
import DefaultLayout from 'src/renderer/components/page/DefaultLayout'
import Text from 'src/renderer/components/Text'
import Row from 'src/renderer/components/Row'
import Badge from 'src/renderer/components/Badge'
import Providers from 'src/renderer/components/Providers'
import { computed, effect, Signal, signal } from 'alien-signals'
import {
  getRelativePathsContainingString,
  getSheetTrees,
  load,
  saveCellFromBuffer
} from 'src/spreadsheet'

import { useEffect, useRef, useState } from 'react'
import Panel from './components/Panel'
import CellPicker from './components/CellPicker'
import CellContent from './components/CellContent'
import DebugGrid from './components/DebugGrid'
import GLWebLogo from './components/GLWebLogo'

// Live reload in development
if (process.env.NODE_ENV !== 'production') {
  new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

type Step = {
  input: Signal
  output: Signal
  error: Signal
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

  return {
    state,
    sheetTrees,
    _selectedCell,
    selectedCell,
    selectedSheetTree
  }
}

function App() {
  const path = window.glbot.path
  const [state, setState] = useState(0)
  const model = useRef(Model())

  const rootSheetPath = path.join(process.cwd(), 'www')

  useEffect(() => {
    const subscription = effect(() => {
      model.current.sheetTrees.value.get()
      model.current.selectedCell.get()
      setState((s) => s + 1)
    })

    model.current.sheetTrees.load.set(model.current.sheetTrees.load.get() + 1)
    return () => subscription.stop()
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

  const handleFileDrop = async (file: File, cellLocation: CellLocation) => {
    const buffer = await file.arrayBuffer()

    saveCellFromBuffer({
      sheetId: '0',
      buffer,
      fileName: file.name,
      cellLocation: cellLocation
    })

    // Reload sheet trees
    model.current.sheetTrees.load.set(model.current.sheetTrees.load.get() + 1)
  }

  console.log('selectedCell', selectedCell, state)

  return (
    <DefaultLayout previewPixelSRC="/assets/glweb.svg">
      <DebugGrid />
      <Grid>
        <Row>
          <strong>
            glbot <Badge>Hello Transperfect</Badge>
          </strong>
          <i className="App_subdued">
            via<span>&nbsp;</span>
          </i>
          <GLWebLogo />
        </Row>
        <Row>
          <Text className="App_subdued">interact less, collaborate more</Text>
        </Row>
      </Grid>
      <div className="App_part1">
        <Grid>
          {sheetTree && selectedCell && (
            <Panel title="Sheet">
              <CellPicker
                activeSheet={0}
                sheetTree={sheetTree!}
                selectedCell={selectedCell!.location}
                onCellClick={handleCellClick}
                onFileDrop={handleFileDrop}
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
      </div>
    </DefaultLayout>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Providers>
    <App />
  </Providers>
)
