import * as ReactDOM from 'react-dom/client'
import Grid from 'src/renderer/components/Grid'
import DefaultLayout from 'src/renderer/components/page/DefaultLayout'
import Text from 'src/renderer/components/Text'
import Row from 'src/renderer/components/Row'
import Badge from 'src/renderer/components/Badge'
import GLWebLogo from 'src/renderer/components/GLWebLogo'
import Providers from 'src/renderer/components/Providers'
import SheetPanel from 'src/renderer/components/SheetPanel'
import { effect } from 'alien-signals'
import { getSheetTrees, load } from 'src/spreadsheet'
import { useEffect, useRef, useState } from 'react'

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
          <SheetPanel />
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
