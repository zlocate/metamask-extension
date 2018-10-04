import Sandbox from 'websandbox';

class MetaPlugin {

  constructor (opts = {}, api = {}) {
    this.script = opts.script
    this.api = api
    this.setupSandbox()
  }

  setupSandbox () {
    const csp = [
      //"'strict-dynamic'",
      "'unsafe-inline'",
      //"'nonce-1234'",
    ]
    const cspString = csp.join(' ')
    console.log('creating sandbox with csp: ' + cspString)

    const sandboxOpts = {
      frameContainer: 'body',
      frameClassName: 'metaplugin',
      frameContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Security-Policy" content="script-src ${cspString}; default-src self; "frame-ancestors 'self'">
        </head>
        <body></body>
        </html>
      `,
      sandboxAdditionalAttributes: 'allow-popups allow-popups-to-escape-sandbox',
    }
    const sandbox = Sandbox.create(this.api, sandboxOpts)
    this.sandbox = sandbox
    console.log('waiting for sandbox construction\n' + sandboxOpts.frameContent)

    sandbox.promise.then(() => {
      console.log('Sandbox is created. Trying to run code inside');

      return sandbox.run(`
        console.info("Sandboxed code initialized successfully");
        Websandbox.connection.remote.ping("pong");

        const metamaskApi = Object.keys(Websandbox.connection.remote)
        .reduce((result, methodName) => {
          result[methodName] = Websandbox.connection.remote[methodName].bind(Websandbox.connection.remote)
          return result
        }, {})

        const pluginFn = ${this.script}
        const plugin = pluginFn(metamaskApi)
        const pluginApi = plugin.getApi()

        Websandbox.connection.setLocalApi(pluginApi)
     `);
    })
    .then(() => console.log('Code has been ran'))
    .then(() => {
      console.log('Calling sandboxedMethod...');
      return sandbox.connection.remote.sandboxedMethod('hello from host');
    })
    .then(res => console.log('Call was successful:', res))
    .catch(err => console.error('sandbox setup failed', err))

  }

}

module.exports = MetaPlugin

