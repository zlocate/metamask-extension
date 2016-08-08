const createId = require('hat')
const extend = require('xtend')
const unmountComponentAtNode = require('react-dom').unmountComponentAtNode
const findDOMNode = require('react-dom').findDOMNode
const render = require('react-dom').render
const h = require('react-hyperscript')
const PendingTxDetails = require('../../../ui/app/components/pending-tx-details')
const PendingMsgDetails = require('../../../ui/app/components/pending-msg-details')
const MetaMaskUiCss = require('../../../ui/css')
const extension = require('./extension')
var notificationHandlers = {}
let pressHandler

const notifications = {
  createUnlockRequestNotification: createUnlockRequestNotification,
  createTxNotification: createTxNotification,
  createMsgNotification: createMsgNotification,
}
module.exports = notifications
window.METAMASK_NOTIFIER = notifications

setupListeners()

function setupListeners () {

  // notification button press
  pressHandler = function (notificationId, buttonIndex) {
    var handlers = notificationHandlers[notificationId]
    if (buttonIndex === 0) {
      handlers.confirm()
    } else {
      handlers.cancel()
    }
  }

}

// creation helper
function createUnlockRequestNotification (opts) {
  var message = 'An Ethereum app has requested a signature. Please unlock your account.'
  return alert(message)
}

function createTxNotification (state) {
  var msg = 'New Unsigned Tx: ' + JSON.stringify(state.txParams, null, 2)
  var result = confirm(msg)

  if (result || !chrome.runtime) {
    state.onConfirm()
  } else {
    state.onCancel('user denied transaction')
  }
}

function createMsgNotification (state) {
  // guard for extension bug https://github.com/MetaMask/metamask-plugin/issues/236
  if (!extension.notifications) return console.error('Chrome notifications API missing...')

  renderMsgNotificationSVG(state, function (err, notificationSvgSource) {
    if (err) throw err

    showNotification(extend(state, {
      title: 'New Unsigned Message',
      imageUrl: toSvgUri(notificationSvgSource),
    }))
  })
}

function showNotification (state) {
  // guard for extension bug https://github.com/MetaMask/metamask-plugin/issues/236
  if (!extension.notifications) return console.error('Chrome notifications API missing...')

  var id = createId()
  extension.notifications.create(id, {
    type: 'image',
    requireInteraction: true,
    iconUrl: '/images/icon-128.png',
    imageUrl: state.imageUrl,
    title: state.title,
    message: '',
    buttons: [{
      title: 'Approve',
    }, {
      title: 'Reject',
    }],
  })
  notificationHandlers[id] = {
    confirm: state.onConfirm,
    cancel: state.onCancel,
  }
}

function renderTxNotificationSVG (state, cb) {
  var content = h(PendingTxDetails, state)
  renderNotificationSVG(content, cb)
}

function renderMsgNotificationSVG (state, cb) {
  var content = h(PendingMsgDetails, state)
  renderNotificationSVG(content, cb)
}

function renderNotificationSVG (content, cb) {
  var container = document.createElement('div')
  var confirmView = h('div.app-primary', {
    style: {
      width: '360px',
      height: '240px',
      padding: '16px',
      // background: '#F7F7F7',
      background: 'white',
    },
  }, [
    h('style', MetaMaskUiCss()),
    content,
  ])

  render(confirmView, container, function ready() {
    var rootElement = findDOMNode(this)
    var viewSource = rootElement.outerHTML
    unmountComponentAtNode(container)
    var svgSource = svgWrapper(viewSource)
    // insert content into svg wrapper
    cb(null, svgSource)
  })
}

function svgWrapper (content) {
  var wrapperSource = `
  <svg xmlns="http://www.w3.org/2000/svg" width="360" height="240">
     <foreignObject x="0" y="0" width="100%" height="100%">
        <body xmlns="http://www.w3.org/1999/xhtml" height="100%">{{content}}</body>
     </foreignObject>
  </svg>
  `
  return wrapperSource.split('{{content}}').join(content)
}

function toSvgUri (content) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(content)
}
