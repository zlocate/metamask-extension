const fs = require('fs')
const path = require('path')
const pump = require('pump')
const LocalMessageDuplexStream = require('post-message-stream')
const PongStream = require('ping-pong-stream/pong')
const ObjectMultiplex = require('obj-multiplex')
const extension = require('extensionizer')
const PortStream = require('extension-port-stream')

const inpageContent = fs.readFileSync(path.join(__dirname, '..', '..', 'dist', 'chrome', 'inpage.js')).toString()
const inpageSuffix = '//# sourceURL=' + extension.extension.getURL('inpage.js') + '\n'
const inpageBundle = inpageContent + inpageSuffix
let originApproved = false

// Eventually this streaming injection could be replaced with:
// https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Language_Bindings/Components.utils.exportFunction
//
// But for now that is only Firefox
// If we create a FireFox-only code path using that API,
// MetaMask will be much faster loading and performant on Firefox.

if (shouldInjectWeb3()) {
  injectScript(inpageBundle)
  setupStreams()
  listenForProviderRequest()
}

/**
 * Injects a script tag into the current document
 *
 * @param {string} content - Code to be executed in the current document
 */
function injectScript (content) {
  try {
    const container = document.head || document.documentElement
    const scriptTag = document.createElement('script')
    scriptTag.textContent = content
    container.insertBefore(scriptTag, container.children[0])
  } catch (e) {
    console.error('Metamask script injection failed.', e)
  }
}

/**
 * Sets up two-way communication streams between the
 * browser extension and local per-page browser context
 */
function setupStreams () {
  // setup communication to page and plugin
  const pageStream = new LocalMessageDuplexStream({
    name: 'contentscript',
    target: 'inpage',
  })
  const pluginPort = extension.runtime.connect({ name: 'contentscript' })
  const pluginStream = new PortStream(pluginPort)

  // Until this origin is approved, cut-off publicConfig stream writes at the content
  // script level so malicious sites can't snoop on the currently-selected address
  pageStream._write = function (data, encoding, cb) {
    if (typeof data === 'object' && data.name && data.name === 'publicConfig' && !originApproved) {
      cb()
      return
    }
    LocalMessageDuplexStream.prototype._write.apply(pageStream, arguments)
  }

  // forward communication plugin->inpage
  pump(
    pageStream,
    pluginStream,
    pageStream,
    (err) => logStreamDisconnectWarning('MetaMask Contentscript Forwarding', err)
  )

  // setup local multistream channels
  const mux = new ObjectMultiplex()
  mux.setMaxListeners(25)

  pump(
    mux,
    pageStream,
    mux,
    (err) => logStreamDisconnectWarning('MetaMask Inpage', err)
  )
  pump(
    mux,
    pluginStream,
    mux,
    (err) => logStreamDisconnectWarning('MetaMask Background', err)
  )

  // connect ping stream
  const pongStream = new PongStream({ objectMode: true })
  pump(
    mux,
    pongStream,
    mux,
    (err) => logStreamDisconnectWarning('MetaMask PingPongStream', err)
  )

  // connect phishing warning stream
  const phishingStream = mux.createStream('phishing')
  phishingStream.once('data', redirectToPhishingWarning)

  // ignore unused channels (handled by background, inpage)
  mux.ignoreStream('provider')
  mux.ignoreStream('publicConfig')
}

/**
 * Establishes listeners for requests to fully-enable the provider from the dapp context
 * and for full-provider approvals and rejections from the background script context. Dapps
 * should not post messages directly and should instead call provider.enable(), which
 * handles posting these messages automatically.
 */
function listenForProviderRequest () {
  window.addEventListener('message', (event) => {
    if (event.source !== window) { return }
    if (!event.data || !event.data.type || event.data.type !== 'ETHEREUM_ENABLE_PROVIDER') { return }
    extension.runtime.sendMessage({
      action: 'init-provider-request',
      origin: event.source.location.hostname,
    })
  })

  extension.runtime.onMessage.addListener(({ action }) => {
    if (!action) { return }
    switch (action) {
      case 'approve-provider-request':
        originApproved = true
        injectScript(`window.dispatchEvent(new CustomEvent('ethereumprovider', { detail: {}}))`)
        break
      case 'reject-provider-request':
        injectScript(`window.dispatchEvent(new CustomEvent('ethereumprovider', { detail: { error: 'User rejected provider access' }}))`)
        break
    }
  })
}


/**
 * Error handler for page to plugin stream disconnections
 *
 * @param {string} remoteLabel Remote stream name
 * @param {Error} err Stream connection error
 */
function logStreamDisconnectWarning (remoteLabel, err) {
  let warningMsg = `MetamaskContentscript - lost connection to ${remoteLabel}`
  if (err) warningMsg += '\n' + err.stack
  console.warn(warningMsg)
}

/**
 * Determines if Web3 should be injected
 *
 * @returns {boolean} {@code true} if Web3 should be injected
 */
function shouldInjectWeb3 () {
  return doctypeCheck() && suffixCheck() &&
    documentElementCheck() && !blacklistedDomainCheck()
}

/**
 * Checks the doctype of the current document if it exists
 *
 * @returns {boolean} {@code true} if the doctype is html or if none exists
 */
function doctypeCheck () {
  const doctype = window.document.doctype
  if (doctype) {
    return doctype.name === 'html'
  } else {
    return true
  }
}

/**
 * Checks the current document extension
 *
 * @returns {boolean} {@code true} if the current extension is not prohibited
 */
function suffixCheck () {
  var prohibitedTypes = ['xml', 'pdf']
  var currentUrl = window.location.href
  var currentRegex
  for (let i = 0; i < prohibitedTypes.length; i++) {
    currentRegex = new RegExp(`\\.${prohibitedTypes[i]}$`)
    if (currentRegex.test(currentUrl)) {
      return false
    }
  }
  return true
}

/**
 * Checks the documentElement of the current document
 *
 * @returns {boolean} {@code true} if the documentElement is an html node or if none exists
 */
function documentElementCheck () {
  var documentElement = document.documentElement.nodeName
  if (documentElement) {
    return documentElement.toLowerCase() === 'html'
  }
  return true
}

/**
 * Checks if the current domain is blacklisted
 *
 * @returns {boolean} {@code true} if the current domain is blacklisted
 */
function blacklistedDomainCheck () {
  var blacklistedDomains = [
    'uscourts.gov',
    'dropbox.com',
    'webbyawards.com',
    'cdn.shopify.com/s/javascripts/tricorder/xtld-read-only-frame.html',
    'adyen.com',
    'gravityforms.com',
    'harbourair.com',
    'ani.gamer.com.tw',
    'blueskybooking.com',
  ]
  var currentUrl = window.location.href
  var currentRegex
  for (let i = 0; i < blacklistedDomains.length; i++) {
    const blacklistedDomain = blacklistedDomains[i].replace('.', '\\.')
    currentRegex = new RegExp(`(?:https?:\\/\\/)(?:(?!${blacklistedDomain}).)*$`)
    if (!currentRegex.test(currentUrl)) {
      return true
    }
  }
  return false
}

/**
 * Redirects the current page to a phishing information page
 */
function redirectToPhishingWarning () {
  console.log('MetaMask - routing to Phishing Warning component')
  const extensionURL = extension.runtime.getURL('phishing.html')
  window.location.href = extensionURL
}
