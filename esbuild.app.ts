import * as esbuild from 'esbuild'

const config = {
  entryPoints: {
    index: 'src/renderer/app.ts'
  },
  tsconfig: 'tsconfig.web.json',
  target: ['chrome131'],
  bundle: true,
  outdir: 'www/js',
  assetNames: '[name]-[hash]',
  minify: process.argv.includes('--minify'),
  sourcemap: true,
  plugins: [
    {
      name: 'react',
      setup(build) {
        build.onResolve({ filter: /^react$/ }, () => {
          return {
            path: './node_modules/react/cjs/react.development.js',
            external: true
          }
        })
      }
    },
    {
      name: 'react-dom',
      setup(build) {
        build.onResolve({ filter: /^react-dom$/ }, () => {
          return {
            path: './node_modules/react-dom/cjs/react-dom.development.js',
            external: true
          }
        })
      }
    }
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.argv.includes('--minify') ? 'production' : 'development'
    )
  }
} satisfies esbuild.BuildOptions

async function build() {
  return await esbuild.build(config)
}

async function startServer() {
  const ctx = await esbuild.context(config)
  await ctx.watch()
  let { host, port } = await ctx.serve({
    servedir: 'www'
  })
  console.log(`glbot is running at https://${host}:${port}`)
}

if (process.argv.includes('--serve')) {
  startServer()
} else {
  build()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
