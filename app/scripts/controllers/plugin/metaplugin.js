const ethUtil = require('ethereumjs-util')

class MetaPlugin {

  constructor (opts = {}) {
    this.script = opts.script
    this.setupIFrame()
  }

  setupIFrame () {
    const html = `
      <!doctype html>
      <meta http-equiv="Content-Security-Policy" content="script-src 'strict-dynamic' 'unsafe-inline' 'sha256-${hash(this.script)}'">
      <html>
        <script>${this.script}</script>
      </html>
    `
    const iframe = document.createElement('iframe')
    iframe.sandbox = 'allow-scripts'
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

