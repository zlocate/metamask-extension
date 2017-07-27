const Iframe = require('iframe')

module.exports = function setupWidget (opts) {
  window.addEventListener('load', () => {
    console.log(document.body, '<-body')
    const frame = Iframe({
      src: opts.zeroClientProvider || 'https://zero.metamask.io/proxy/widget.html',
      container: opts.container || document.body,
      sandboxAttributes: opts.sandboxAttributes || ['allow-scripts', 'allow-popups', 'allow-same-origin'],
    })
    const iframe = frame.iframe
    iframe.style = `
    border: 0px;
    position: absolute;
    right: 0;
    top: 0;
    `
  })
}
