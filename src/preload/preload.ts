import { initDb } from 'src/db-init'
import { simpleGit, SimpleGit } from 'simple-git'

console.log('db loaded', document)

async function main() {
  try {
    const db = await initDb({ reset: true })

    // Configure simple-git instance
    const git: SimpleGit = simpleGit({
      baseDir: process.cwd(), // Or specify your repo path
      binary: 'git',
      maxConcurrentProcesses: 6,
      trimmed: false,
      // Optional progress logging
      progress: ({ method, stage, progress }) => {
        console.log(`git.${method} ${stage} stage ${progress}% complete`)
      }
    })

    const api = {
      db,
      git // Expose git instance to renderer
    }

    if (process.env.NODE_ENV === 'development') {
      window.electron = api
      window.db = db
      window.git = git // Make git available in dev tools
    }
  } catch (error) {
    console.error('Failed to initialize:', error)
    throw error
  }
}

main()
