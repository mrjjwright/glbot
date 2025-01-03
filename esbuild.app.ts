import * as esbuild from 'esbuild'

// Configure worker entry points
const workers = {
  'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
  'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
  'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
  'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
  'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker'
}

const config: esbuild.BuildOptions = {
  entryPoints: {
    index: 'src/renderer/app.ts',
    ...workers
  },
  tsconfig: 'tsconfig.web.json',
  target: ['chrome131'],
  bundle: true,
  outdir: 'www/js',
  assetNames: '[name]-[hash]',
  minify: process.argv.includes('--minify'),
  sourcemap: true,
  loader: {
    '.ttf': 'file',
    '.woff': 'file',
    '.woff2': 'file'
  },
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
}

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
