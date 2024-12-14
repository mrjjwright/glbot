import path from 'path'
import fs from 'fs'
import BetterSqlite3 from 'better-sqlite3'

// Error classes (keep these)
export class DatabaseError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message)
    this.cause = cause
  }
}

export class UnsupportedPlatformError extends DatabaseError {
  constructor() {
    super('Unsupported platform')
  }
}

export class FileSystemError extends DatabaseError {
  constructor(message: string, cause?: unknown) {
    super(message, cause)
  }
}

function getAppDataPath(): string {
  const platform = process.platform
  if (platform !== 'darwin' && platform !== 'win32') {
    throw new UnsupportedPlatformError()
  }

  return platform === 'darwin'
    ? path.join(process.env.HOME!, 'Library', 'Application Support', 'glbot')
    : path.join(process.env.APPDATA!, 'glbot')
}

function getLocalDatabasePath(): string {
  return path.join(getAppDataPath(), 'glbot.db')
}

export async function initDb(params: { dbPath?: string; reset?: boolean } = {}): Promise<Database> {
  const dbPath = params.dbPath || getLocalDatabasePath()

  // Reset database if flag is set
  if (params.reset && fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath)
  }

  // Ensure directory exists
  const dbFolder = path.dirname(dbPath)
  if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true })
  }

  try {
    return new BetterSqlite3(dbPath) as Database
  } catch (error) {
    if (error instanceof Error && error.message.includes('EACCES')) {
      throw new FileSystemError('Permission denied while accessing database', error)
    }
    throw new DatabaseError('Failed to initialize database', error)
  }
}

export async function resetDatabase(): Promise<Database> {
  return initDb({ reset: true })
}
