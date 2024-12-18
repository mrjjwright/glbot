import { PlatformPath } from 'path'

declare global {
  interface Window {
    glbot: {
      db: Database
      git: SimpleGit
      fs: any
      path: PlatformPath
      dialog: Electron.Dialog
    }
  }
}
