/// <reference types="vite/client" />

import { Database } from 'src/batcher'

interface Window {
  electron: ElectronAPI
  db: Database
}
