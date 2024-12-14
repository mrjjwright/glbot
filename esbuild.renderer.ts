import * as esbuild from 'esbuild'

const config = {
  entryPoints: {
    index: 'src/renderer/renderer.tsx'
  },
  tsconfig: 'tsconfig.web.json',
  platform: 'browser',
  target: ['chrome128'],
  bundle: true,
  outdir: 'www/js',
  assetNames: '[name]-[hash]',
  minify: process.argv.includes('--minify'),
  sourcemap: true
} satisfies esbuild.BuildOptions

async function build() {
  return await esbuild.build(config)
}

async function startServer() {
  const ctx = await esbuild.context(config)
  let { host, port } = await ctx.serve({
    servedir: 'www'
  })
  console.log(`OneLink AI is running at http://${host}:${port}`)
}

if (process.argv.includes('--serve')) {
  startServer()
} else {
  build()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
