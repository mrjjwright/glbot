// @ts-nocheck
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import Grid from 'src/renderer/components/Grid'
import DefaultLayout from 'src/renderer/components/page/DefaultLayout'
import Text from 'src/renderer/components/Text'
import Row from 'src/renderer/components/Row'
import ModalStack from 'src/renderer/components/ModalStack'
import Chat from 'src/renderer/components/Chat'
import Badge from 'src/renderer/components/Badge'
import MatrixOpening from 'src/renderer/components/MatrixOpening'
import ControlPanel from 'src/renderer/components/ControlPanel'
import DebugGrid from 'src/renderer/components/DebugGrid'
import GLWebLogo from 'src/renderer/components/GLWebLogo'
import Providers from 'src/renderer/components/Providers'
import DataTable from 'src/renderer/components/DataTable'
import SheetPanel from 'src/renderer/components/SheetPanel'
// Live reload in development
if (process.env.NODE_ENV !== 'production') {
  new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

// Initialize tables
const db = window.db

db.exec(`
  CREATE TABLE IF NOT EXISTS ControlPanel_selected (
    id INTEGER PRIMARY KEY,
    selected_index INTEGER
  )`)

db.exec(`
  CREATE TABLE IF NOT EXISTS ControlPanel_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`)

// Insert initial selected index if not existss
const initSelected = db.prepare(`
  INSERT OR IGNORE INTO ControlPanel_selected (id, selected_index) 
  VALUES (1, NULL)`)
initSelected.run()

const selectedState = db
  .prepare('SELECT selected_index FROM ControlPanel_selected WHERE id = 1')
  .get()
console.log('Initial selected state:', selectedState)

function App() {
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
          <ControlPanel />
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
