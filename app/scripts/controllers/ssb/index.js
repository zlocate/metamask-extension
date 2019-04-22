const createSsbServer = require('./server')
const generateConfig = require('./config')
// # SSB Controller
class SsbController {
  constructor (opts = {}) {
    let encrypt, decrypt
    if (opts.encryptor) {
      config.encrypt = opts.encryptor.encrypt
      config.decrypt = opts.encryptor.decrypt
    }
    const config = generateConfig({encrypt, decrypt})
    opts.path = 'ssb-mm'
    this.sbot = createSsbServer(config)
    debugger
  }

// howerver private is on the content body it will be removed before publish
// all other keys in the content body will be published in the message
// optional call back if no call back return a promise
  publish (content = { type: 'post', private: true }, cb = () => {}) {

  }

// returns an array of all known messages for any given feed
  getFeed (feedId) {

  }

  // the handler is called anytime a new message is received for a given feed
  // if feedId is `'*'` all log messages will trigger the handler
  subscribe (feedId, handler) {

  }

  // returns an array of users public address
  getUserIds (index = 1, cb) {

  }

  // returns the users public address and index=1
  createNewIdentity (cb) {

  }
}

module.exports = SsbController
