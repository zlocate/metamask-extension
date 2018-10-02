import Sandbox from 'websandbox';
const ethUtil = require('ethereumjs-util')

class MetaPlugin {

  constructor (opts = {}, api = {}) {
    this.script = opts.script
    this.api = api
    this.setupIFrame()
  }

  setupIFrame () {

    const sandbox = Sandbox.create(localApi, {frameContainer: '.iframe__container', frameClassName: 'simple__iframe'});
    sandbox.promise
    .then(() => {
      console.log('Sandbox is created. Trying to run code inside');

      return sandbox.run(`
        console.info("Sandboxed code initialized successfully");
        var title = document.createElement('h3');
        title.innerHTML = "Content is generated from the sandbox";
        document.body.appendChild(title);
        Websandbox.connection.remote.testApiFn("some argument");

        Websandbox.connection.setLocalApi({
            sandboxedMethod: function(message) {
                console.info('sandboxedMethod called successfully:', message);
                return 'this is sandboxedMethod result';
            }
        });
     `);
    })
    .then(() => console.log('Code has been ran'))
    .then(() => {
      console.log('Calling sandboxedMethod...');
      return sandbox.connection.remote.sandboxedMethod('hello from host');
    })
    .then(res => console.log('Call was successful:', res));

    const html = `
      <!doctype html>
      <meta http-equiv="Content-Security-Policy" content="script-src 'strict-dynamic' 'unsafe-inline' 'sha256-${hash(this.script)}'">
      <html>
        <script>${this.script}</script>
      </html>
    `
    const iframe = document.createElement('iframe')
    iframe.sandbox = 'allow-scripts '
    iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html)
    console.log('injecting iframe')
    document.head.appendChild(iframe)
    console.log('contacting iframe')
    iframe.contentWindow.postMessage('hello', '*');
    iframe.contentWindow.onmessage = function (e) {
      if (e.data.includes('PLUGIN')) {
        console.log('PONG RECEIVED FROM PLUGIN', e)
      }
    }
  }

}

function hash (text) {
  const buffer = ethUtil.sha256(text)
  return buffer.toString('base64')
}

module.exports = MetaPlugin

