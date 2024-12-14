Serve
Supported by: Build

If you want your app to automatically reload as you edit, you should read about live reloading. It combines serve mode with watch mode to listen for changes to the file system.
Serve mode starts a web server that serves your code to your browser on your device. Here's an example that bundles src/app.ts into www/js/app.js and then also serves the www directory over http://localhost:8000/:

import \* as esbuild from 'esbuild'

let ctx = await esbuild.context({
entryPoints: ['src/app.ts'],
outdir: 'www/js',
bundle: true,
})

let { host, port } = await ctx.serve({
servedir: 'www',
})
If you create the file www/index.html with the following contents, the code contained in src/app.ts will load when you navigate to http://localhost:8000/:

<script src="js/app.js"></script>

One benefit of using esbuild's built-in web server instead of another web server is that whenever you reload, the files that esbuild serves are always up to date. That's not necessarily the case with other development setups. One common setup is to run a local file watcher that rebuilds output files whenever their input files change, and then separately to run a local file server to serve those output files. But that means reloading after an edit may reload the old output files if the rebuild hasn't finished yet. With esbuild's web server, each incoming request starts a rebuild if one is not already in progress, and then waits for the current rebuild to complete before serving the file. This means esbuild never serves stale build results.

Note that this web server is intended to only be used in development. Do not use this in production.
