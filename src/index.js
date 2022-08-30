const child_process = require('child_process');

class WebpackShellPluginSimple {
    constructor(hooks) {
        this.hooks = hooks
    }

    apply(compiler) {
        const self = this

        for (const hook_config of this.hooks) {
            for (const hook of listify(hook_config.on)) {
                if (!hook in compiler.hooks) {
                    throw new Error("no such hook: " + hook);
                }

                compiler.hooks[hook].tap("webpack-shell-plugin-simple", () => {
                    self.run_cmds(hook_config.exec)
                })
            }
        }
    }

    run_cmds(cmds) {
        for (const s of listify(cmds)) {
            this.run_cmd(s)
        }
    }

    run_cmd(cmd) {
        const opts = {
            shell: true,
            stdio: 'inherit',
        }

        const res = child_process.spawnSync(cmd, [], opts)

        if (res.error) {
            throw res.error
        }

        if (res.status != 0) {
            throw new Error('command ' + cmd + ' exited with status ' + res.status)
        }
    }
}

function listify(o) {
    if (Array.isArray(o)) {
        return o
    } else {
        return [o]
    }
}

module.exports = WebpackShellPluginSimple
