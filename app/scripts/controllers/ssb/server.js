const SecretStack = require('secret-stack')

const SSB = require('ssb-db')

// create a sbot with default caps. these can be overridden again when you call create.
function createSsbServer (config) {
    return SecretStack({ caps: require('./caps') })
    .use(SSB)
    .use(require('ssb-gossip'))
    .use(require('ssb-replicate'))
    .use(require('ssb-ebt'))
    .use({init: (...args) => {
      args

    }})
    .use(require('ssb-ws'))(config)
}

module.exports = createSsbServer
