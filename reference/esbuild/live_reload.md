Live reload
Supported by: Build

Live reload is an approach to development where you have your browser open and visible at the same time as your code editor. When you edit and save your source code, the browser automatically reloads and the reloaded version of the app contains your changes. This means you can iterate faster because you don't have to manually switch to your browser, reload, and then switch back to your code editor after every change. It's very helpful when changing CSS, for example.

There is no esbuild API for live reloading directly. Instead, you can construct live reloading by combining watch mode (to automatically start a build when you edit and save a file) and serve mode (to serve the latest build, but block until it's done) plus a small bit of client-side JavaScript code that you add to your app only during development.

The first step is to enable watch and serve together:

import \* as esbuild from 'esbuild'

let ctx = await esbuild.context({
entryPoints: ['app.ts'],
bundle: true,
outdir: 'www',
})

await ctx.watch()

let { host, port } = await ctx.serve({
servedir: 'www',
})
The second step is to add some code to your JavaScript that subscribes to the /esbuild server-sent event source. When you get the change event, you can reload the page to get the latest version of the app. You can do this in a single line of code:

new EventSource('/esbuild').addEventListener('change', () => location.reload())
That's it! If you load your app in the browser, the page should now automatically reload when you edit and save a file (assuming there are no build errors).

This should only be included during development, and should not be included in production. One way to remove this code in production is to guard it with an if statement such as if (!window.IS_PRODUCTION) and then use define to set window.IS_PRODUCTION to true in production.

Live reload caveats
Implementing live reloading like this has a few known caveats:

These events only trigger when esbuild's output changes. They do not trigger when files unrelated to the build being watched are changed. If your HTML file references other files that esbuild doesn't know about and those files are changed, you can either manually reload the page or you can implement your own live reloading infrastructure instead of using esbuild's built-in behavior.

The EventSource API is supposed to automatically reconnect for you. However, there's a bug in Firefox that breaks this if the server is ever temporarily unreachable. Workarounds are to use any other browser, to manually reload the page if this happens, or to write more complicated code that manually closes and re-creates the EventSource object if there is a connection error.

Browser vendors have decided to not implement HTTP/2 without TLS. This means that when using the http:// protocol, each /esbuild event source will take up one of your precious 6 simultaneous per-domain HTTP/1.1 connections. So if you open more than six HTTP tabs that use this live-reloading technique, you will be unable to use live reloading in some of those tabs (and other things will likely also break). The workaround is to enable the https:// protocol.
