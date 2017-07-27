const EventEmitter = require('events').EventEmitter
const injectCss = require('inject-css')
const Dnode = require('dnode')
const SWcontroller = require('client-sw-ready-event/lib/sw-client.js')
const SwStream = require('sw-stream/lib/sw-stream.js')
const MetamaskInpageProvider = require('../../app/scripts/lib/inpage-provider.js')
const MetaMaskUiCss = require('../../ui/css')
const MetamascaraPlatform = require('../../app/scripts/platforms/window')
const setupMultiplex = require('../../app/scripts/lib/stream-utils.js').setupMultiplex
const renderWidget = require('./widgets')
// create platform global
global.platform = new MetamascaraPlatform()


var css = MetaMaskUiCss()
injectCss(css)
const container = document.getElementById('widget')
var name = 'widget'
window.METAMASK_UI_TYPE = name

const background = new SWcontroller({
  fileName: '/background.js',
  letBeIdle: false,
})
// Setup listener for when the service worker is read
let provider
const connectApp = function (readySw) {
  let connectionStream = SwStream({
    serviceWorker: readySw,
    context: name,
  })
  provider = new MetamaskInpageProvider(connectionStream)
}
background.on('ready', (sw) => {
  connectApp(sw)
})

background.startWorker()
.then(() => {
  renderWidget({container, provider})
})
console.log('hello from MetaMascara Widget ui!')


function setupControllerConnection (connectionStream, cb) {
  // this is a really sneaky way of adding EventEmitter api
  // to a bi-directional dnode instance
  var eventEmitter = new EventEmitter()
  var accountManagerDnode = Dnode({
    sendUpdate: function (state) {
      eventEmitter.emit('update', state)
    },
  })
  connectionStream.pipe(accountManagerDnode).pipe(connectionStream)
  accountManagerDnode.once('remote', function (accountManager) {
    // setup push events
    accountManager.on = eventEmitter.on.bind(eventEmitter)
    cb(null, accountManager)
  })
}

function connectToAccountManager (connectionStream, cb) {
  // setup communication with background
  // setup multiplexing
  var mx = setupMultiplex(connectionStream)
  // connect features
  setupControllerConnection(mx.createStream('controller'), cb)
}