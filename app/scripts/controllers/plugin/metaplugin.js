import Sandbox from 'websandbox';

class MetaPlugin {

  constructor (opts = {}, api = {}) {
    this.script = opts.script
    this.api = api
    this.setupSandbox()
  }

  setupSandbox () {

    const sandbox = Sandbox.create(this.api, {frameContainer: 'body', frameClassName: 'metaplugin'})
    this.sandbox = sandbox

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
    .then(res => console.log('Call was successful:', res));

  }

}

module.exports = MetaPlugin

