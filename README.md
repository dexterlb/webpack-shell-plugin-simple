# webpack-shell-plugin-simple

A plugin for executing shell commands upon webpack hooks.

Similar to [webpack-shell-plugin-next](https://github.com/s00d/webpack-shell-plugin-next),
but a lot simpler:

- stdin/stdout is sent to the parent process stdin/stdout
- non-zero exit status always terminates the build
- no async or parallel command execution: the command blocks the entire webpack process
- all commands are run inside a (insecure) shell

If something like silent output or handling exit status is required,
it can be done by executing a shell script and handling it there.

### example usage

```js
const WebpackShellPluginSimple = require('webpack-shell-plugin-simple');
...
module.exports = {
  ...
  plugins: [
    new WebpackShellPluginSimple([
      {
        on: ['run', 'watchRun'],
        exec: './scripts/pre_build.sh',
      },
      {
        on: 'afterEmit',
        exec: [
          './scripts/post_build.sh',
          'echo "done."',
        ],
      },
    ]),
    ...
  ],
  ...
}
```

The `on:` key may contain names of arbitrary
[webpack hooks](https://webpack.js.org/api/compiler-hooks).
