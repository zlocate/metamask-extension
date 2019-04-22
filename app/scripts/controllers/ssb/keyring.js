const ssbKeys = require('ssb-keys')
const createId = require('../../lib/random-id')

class SsbKey {

get type () {
  return `ssb#${this.keyOperations.getCurve()}`
}

constructor (opts) {
}

// In this method, you must return any JSON-serializable JavaScript object that
// you like. It will be encoded to a string, encrypted with the user's password,
 // and stored to disk.
// This is the same object you will receive in the deserialize() method,
// so it should capture all the information you need to restore the Keyring's state.
  async serialize () {
    // TODO: single use issue token for getting the private key based on weather
    // the user has entered their password
    // this is a place holder
    // this.keyOperations.issueConsent()
    return this.keyOperations.getKeys()
  }

  // As discussed above, the deserialize() method will be passed the JavaScript object that you returned when the serialize() method was called.
  async deserialize (opts) {
    if (this._hasBeenCalled) throw new Error('')
    const keys = !opts.keys ? ssbKeys.generate(opts.curve) : opts.keys
    const revocableKeys = {}
    this.public = keys.public
    const forbiddenWrites = ['curve', 'public', 'private', 'id']
    this.keyOperations = new Proxy({}, {
      get: (_, k) => {
        if (k === 'getCurve') return () => keys.curve
        if (k === 'getKeys') {
 return () => new Proxy(keys, {
            set: () => { throw new TypeError('Writes not allowed') },
            get: (obj, k) => obj[k],
        })
}

        return (...args) => ssbKeys[k](keys, ...args)
      },

      set: (_, k, v) => {
        if (forbiddenWrites) throw new Error(`Write Acess Error: writing to keys.${k} is not allowed`)
        return keys[k] = v
      },
    })
  }

  async addAccounts () {
    console.log('SsbKey#addAccounts does nothing but console log this message: best practice create a new ssbKey class object')
  }

  async getAccounts () {
    return [this.public]
  }
// When this method is called, you must return an array of hex-string addresses for the accounts that your Keyring is able to sign for.

  async signTransaction (address, transaction) {

  }
// This method will receive a hex-prefixed, all-lowercase address string for the account you should sign the incoming transaction with.

// For your convenience, the transaction is an instance of ethereumjs-tx, (https://github.com/ethereumjs/ethereumjs-tx) so signing can be as simple as:

// transaction.sign(privateKey)
// You must return a valid signed ethereumjs-tx (https://github.com/ethereumjs/ethereumjs-tx) object when complete, it can be the same transaction you received.

  async signMessage (address, data) {

  }
// The eth_sign method will receive the incoming data, alread hashed, and must sign that hash, and then return the raw signed hash.

  async exportAccount (address) {
    // TODO: single use issue token for getting the private key based on weather
    // the user has entered their password
    // this is a place holder
    // this.keyOperations.issueConsent()
    return this.keyOperations.getKeys().private
  }
// Exports the specified account as a private key hex string.
}

module.exports = SsbKey
