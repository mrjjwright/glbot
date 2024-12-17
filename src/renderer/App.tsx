import * as ReactDOM from 'react-dom/client'
import Grid from 'src/renderer/components/Grid'
import DefaultLayout from 'src/renderer/components/page/DefaultLayout'
import Text from 'src/renderer/components/Text'
import Row from 'src/renderer/components/Row'
import Badge from 'src/renderer/components/Badge'
import GLWebLogo from 'src/renderer/components/GLWebLogo'
import Providers from 'src/renderer/components/Providers'
import { computed, effect } from 'alien-signals'
import { getSheetTrees, load } from 'src/spreadsheet'
import { useEffect, useRef, useState } from 'react'
import Panel from './components/Panel'
import CellPicker from './components/CellPicker'

// Live reload in development
if (process.env.NODE_ENV !== 'production') {
  new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

function App() {
  const [state, setState] = useState(0)
  const sheetTrees = useRef(
    load(() => {
      const trees = getSheetTrees(process.cwd())
      console.log('Sheet trees:', trees)
      return trees
    })
  )
  const selectedSheetTree = useRef(
    computed(() => {
      const sheetTreesVal = sheetTrees.current.value.get()
      return sheetTreesVal && sheetTreesVal.length ? sheetTreesVal[0] : undefined
    })
  )
  const effectRef = useRef<ReturnType<typeof effect>>(null!)

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
        <Row>
          <Panel title="Sheet">
            <CellPicker activeSheet={0} sheetTree={sheetTree} />
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
