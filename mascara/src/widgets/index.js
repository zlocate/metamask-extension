const render = require('react-dom').render
const h = require('react-hyperscript')
const EthQuery = require('ethjs-query')
const options = {
  'mini-account': require('./mini-account')
}

module.exports = renderWidget


async function renderWidget (opts = {}) {
  const {
    type = 'mini-account',
    container,
    provider,
    limitedAccountManager,
  } = opts
  const Widget = options[type]
  // const query = new EthQuery(provider)
  const state = await limitedAccountManager.getState()
  render(
    h(Widget, {
      provider,
      limitedAccountManager,
      state
    }
  ), container)
}