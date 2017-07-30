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


let css = MetaMaskUiCss()
injectCss(css)
const container = document.getElementById('widget')
let name = 'widget'
window.METAMASK_UI_TYPE = name

const background = new SWcontroller({
  fileName: '/background.js',
  letBeIdle: false,
})
// Setup listener for when the service worker is read
const connectApp = async function (readySw) {
  let connectionStream = SwStream({
    serviceWorker: readySw,
    context: name,
  })
  let providerStream = SwStream({
    serviceWorker: readySw,
    context: name,
  })
  const limitedAccountManager = await connectToAccountManager(connectionStream)
  console.log('limitedAccountManager!!! ->', limitedAccountManager)
  renderWidget({
    container,
    limitedAccountManager: promisisfiyAccountManager(limitedAccountManager),
  })
}

background.on('ready', connectApp)

background.startWorker()
console.log('hello from MetaMascara Widget ui!')


function setupControllerConnection (connectionStream) {
  // this is a really sneaky way of adding EventEmitter api
  // to a bi-directional dnode instance
  return new Promise((resolve, reject) => {
    let eventEmitter = new EventEmitter()
    let accountManagerDnode = Dnode({
      sendUpdate: function (state) {
        console.log('update')
        eventEmitter.emit('update', state)
      },
    })
    connectionStream.pipe(accountManagerDnode).pipe(connectionStream)
    accountManagerDnode.once('remote', function (accountManager) {
      // setup push events
      accountManager.on = eventEmitter.on.bind(eventEmitter)
      resolve(accountManager)
    })

  })
}

async function connectToAccountManager (connectionStream, cb) {
  // setup communication with background
  // setup multiplexing
  let mx = setupMultiplex(connectionStream)
  // connect features
  const accountManager = await setupControllerConnection(mx.createStream('controller'))
  return accountManager
}

function promisisfiyAccountManager (accountManager) {
  return new Proxy(accountManager, {
    get: (accountManager, key) => {
      if (key === 'on') return accountManager.on
      return (...args) => {
        return new Promise((resolve, reject) => {
          try{
            console.log(key)
            if  (args.length) accountManager[key](...args, (err, value) => {!err ? resolve(value) : reject(err)})
            else accountManager[key]((err, value) => {!err ? resolve(value) : reject(err)})
          } catch (err) {
            reject(err)
          }
        })
      }
    }
  })
}