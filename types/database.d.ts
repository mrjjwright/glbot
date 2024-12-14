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
