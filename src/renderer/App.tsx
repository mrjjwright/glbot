import * as ReactDOM from 'react-dom/client'
import Grid from 'src/renderer/components/Grid'
import DefaultLayout from 'src/renderer/components/page/DefaultLayout'
import Text from 'src/renderer/components/Text'
import Row from 'src/renderer/components/Row'
import Badge from 'src/renderer/components/Badge'
import GLWebLogo from 'src/renderer/components/GLWebLogo'
import Providers from 'src/renderer/components/Providers'
import SheetPanel from 'src/renderer/components/SheetPanel'
import { signal, effect, computed } from 'alien-signals'
import { getRelativePathsContainingString } from 'src/spreadsheet'
import { useEffect, useState } from 'react'

// Live reload in development
if (process.env.NODE_ENV !== 'production') {
  new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

function loadModel() {
  const load = signal(false)
  const sheetPaths = computed(() => {
    const { path } = window.glbot

    if (load.get()) {
      return getRelativePathsContainingString(path.join(process.cwd()), 'sheet_')
    }
    return []
  })

  effect(() => {
    console.log(sheetPaths.get())
  })

  return {
    load,
    sheetPaths
  }
}

function App() {
  const [state, setState] = useState(0)
  const model = loadModel()

  useEffect(() => {
    model.load.set(true)

    effect(() => {
      if (model.sheetPaths.get().length > 0) {
        setState(state + 1)
      }
    })
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
