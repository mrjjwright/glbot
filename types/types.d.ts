/// <reference types="vite/client" />

declare module "*.txt" {
  const content: string
  export default content
}

declare module "*.md" {
  const content: string
  export default content
}

declare module "*.xml" {
  const content: string
  export default content
}

interface JSONVersion {
  timestamp: number
  config: Record<string, any>
  explanation?: string
}

interface JSONGeneratedEvent extends CustomEvent<JSONVersion> {
  type: 'JSONGenerated'
}

interface JSONSelectedEvent extends CustomEvent<JSONVersion> {
  type: 'JSONSelected'
}

interface Database {
  pragma(pragma: string): void
  exec(sql: string): void
  prepare(sql: string): Statement
  transaction<T>(fn: (...args: any[]) => T): (...args: any[]) => T
}

interface Statement {
  run(...params: any[]): RunResult
  get(...params: any[]): any
  all(...params: any[]): any[]
}

interface RunResult {
  changes: number
  lastInsertRowid: number | bigint
}

interface Window {
  electron: ElectronAPI
  db: Database
}
