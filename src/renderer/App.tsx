import { documentLoad, el } from './dom'
// import { ContentTile } from './ContentTile'
import { Effect } from 'effect'

// Live reload in development
if (process.env.NODE_ENV !== 'production') {
  new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

const program = Effect.scoped(
  documentLoad.pipe(
    Effect.tap(() => Effect.log('Document loaded successfully')),
    Effect.onInterrupt(() => Effect.log('Document load was interrupted'))
  )
)

// Run it
Effect.runPromise(program)
