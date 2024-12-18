import { initDb } from 'src/db-init'
import { simpleGit, SimpleGit } from 'simple-git'
import * as fs from 'fs'
import * as path from 'path'
import { dialog } from 'electron'

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
    window.glbot = {
      fs,
      path,
      db,
      git,
      dialog
    }
    console.log('glbot', window.glbot)
  } catch (error) {
    console.error('Failed to initialize:', error)
    throw error
  }
}

main()
