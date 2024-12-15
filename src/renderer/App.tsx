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
import JSONCopyPaste from 'src/renderer/components/JSONCopyPaste'
import DebugGrid from 'src/renderer/components/DebugGrid'
import GLWebLogo from 'src/renderer/components/GLWebLogo'
import Providers from 'src/renderer/components/Providers'

// Live reload in development
if (process.env.NODE_ENV !== 'production') {
  new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

// Initialize tables
const db = window.db

db.exec(`
  CREATE TABLE IF NOT EXISTS JSONCopyPaste_selected (
    id INTEGER PRIMARY KEY,
    selected_index INTEGER
  )`)

db.exec(`
  CREATE TABLE IF NOT EXISTS JSONCopyPaste_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`)

// Insert initial selected index if not existss
const initSelected = db.prepare(`
  INSERT OR IGNORE INTO JSONCopyPaste_selected (id, selected_index) 
  VALUES (1, NULL)`)
initSelected.run()

const selectedState = db
  .prepare('SELECT selected_index FROM JSONCopyPaste_selected WHERE id = 1')
  .get()
console.log('Initial selected state:', selectedState)

function App() {
  return (
    <DefaultLayout previewPixelSRC="/assets/glweb.svg">
      <DebugGrid />
      <ModalStack />

      <MatrixOpening />

      <Grid>
        <Row>
          <GLWebLogo />
          <strong>
            glbot <Badge>from Transperfect</Badge>
          </strong>
        </Row>
        <Row>
          <Text>AI-powered Transperfect assistants</Text>
        </Row>
      </Grid>

      <Grid>
        <JSONCopyPaste />

        <Chat endpoint="/api/chat" />
      </Grid>
    </DefaultLayout>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Providers>
    <App />
  </Providers>
)
