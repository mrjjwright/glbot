import * as esbuild from 'esbuild'

const config = {
  entryPoints: {
    'main/index': 'src/main/main.ts',
    'preload/index': 'src/preload/preload.ts'
  },
  tsconfig: 'tsconfig.node.json',
  platform: 'node',
  target: ['node20'],
  bundle: true,
  outdir: '.',
  external: ['electron'],
  minify: process.argv.includes('--minify'),
  sourcemap: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.argv.includes('--minify') ? 'production' : 'development'
    )
  }
} satisfies esbuild.BuildOptions

async function watch() {
  const ctx = await esbuild.context(config)
  await ctx.watch()
  console.log('watching...')
  return ctx
}

async function build() {
  return await esbuild.build(config)
}

// Process command line and run
if (!process.argv.includes('--minify')) {
  build()
  // watch()
} else {
  build()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
