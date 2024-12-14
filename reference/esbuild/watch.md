Watch
Supported by: Build

Enabling watch mode tells esbuild to listen for changes on the file system and to automatically rebuild whenever a file changes that could invalidate the build. Using it looks like this:

import \* as esbuild from 'esbuild'

let ctx = await esbuild.context({
entryPoints: ['app.js'],
outfile: 'out.js',
bundle: true,
})

await ctx.watch()
console.log('watching...')
If you want to stop watch mode at some point in the future, you can call dispose on the context object to terminate the file watcher:

import \* as esbuild from 'esbuild'

let ctx = await esbuild.context({
entryPoints: ['app.js'],
outfile: 'out.js',
bundle: true,
})

await ctx.watch()
console.log('watching...')

await new Promise(r => setTimeout(r, 10 \* 1000))
await ctx.dispose()
console.log('stopped watching')
Watch mode in esbuild is implemented using polling instead of OS-specific file system APIs for portability. The polling system is designed to use relatively little CPU vs. a more traditional polling system that scans the whole directory tree at once. The file system is still scanned regularly but each scan only checks a random subset of your files, which means a change to a file will be picked up soon after the change is made but not necessarily instantly.

With the current heuristics, large projects should be completely scanned around every 2 seconds so in the worst case it could take up to 2 seconds for a change to be noticed. However, after a change has been noticed the change's path goes on a short list of recently changed paths which are checked on every scan, so further changes to recently changed files should be noticed almost instantly.

Note that it is still possible to implement watch mode yourself using esbuild's rebuild API and a file watcher library of your choice if you don't want to use a polling-based approach.

If you are using the CLI, keep in mind that watch mode will be terminated when esbuild's stdin is closed. This prevents esbuild from accidentally outliving the parent process and unexpectedly continuing to consume resources on the system. If you have a use case that requires esbuild to continue to watch forever even when the parent process has finished, you may use --watch=forever instead of --watch.
