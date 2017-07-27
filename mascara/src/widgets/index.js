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
    provider
  } = opts
  const Widget = options[type]

  const query = new EthQuery(provider)
  provider.publicConfigStore.subscribe(console.log)
  const publicConfigStore = provider.publicConfigStore

  render(
    h(Widget, {
      provider,
      publicConfigStore,
    }
  ), container)
}