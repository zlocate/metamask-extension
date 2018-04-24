const ethUtil = require('ethereumjs-util')
const normalize = require('eth-sig-util').normalize
const MetamaskConfig = require('../config.js')


const MAINNET_RPC = MetamaskConfig.network.mainnet
const ROPSTEN_RPC = MetamaskConfig.network.ropsten
const KOVAN_RPC = MetamaskConfig.network.kovan
const RINKEBY_RPC = MetamaskConfig.network.rinkeby

/**
 * The config-manager is a convenience object wrapping a pojo-migrator.
 *
 * It exists mostly to allow the creation of convenience methods to access and persist particular portions of the
 * state.
 *
 * @property {object} store The store of this ConfigManager's data.
 * @property {array<Function>} _subs An array of subscribers to updates of the stored config object.
 *
 */
module.exports = ConfigManager
function ConfigManager (opts) {
  // ConfigManager is observable and will emit updates
  this._subs = []
  this.store = opts.store
}

/**
 * A setter for the config property in store
 *
 * @param {string} config The new config object to store
 *
 */
ConfigManager.prototype.setConfig = function (config) {
  var data = this.getData()
  data.config = config
  this.setData(data)
  this._emitUpdates(config)
}

/**
 * A getter for the config property in store
 *
 * @returns {object} The config object in store
 *
 */
ConfigManager.prototype.getConfig = function () {
  var data = this.getData()
  return data.config
}

/**
 * A setter for the store. The store is overwritten and set to the passed data
 *
 * @param {object} data The new store object
 *
 */
ConfigManager.prototype.setData = function (data) {
  this.store.putState(data)
}

/**
 * A getter for the store
 *
 * @returns {object} The whole store object
 *
 */
ConfigManager.prototype.getData = function () {
  return this.store.getState()
}

/**
 * A setter for the forgottenPassword property in store
 *
 * @param {boolean} passwordForgottenState Whether or not the user is flagged as having forgotten their password
 *
 */
ConfigManager.prototype.setPasswordForgotten = function (passwordForgottenState) {
  const data = this.getData()
  data.forgottenPassword = passwordForgottenState
  this.setData(data)
}

/**
 * A getter for the forgottenPassword property in store
 *
 * @returns {boolean} Whether or not the user is flagged as having forgotten their password
 *
 */
ConfigManager.prototype.getPasswordForgotten = function (passwordForgottenState) {
  const data = this.getData()
  return data.forgottenPassword
}

/**
 * A setter for the wallet property in store
 *
 * @param {object} wallet The new wallet object to store
 *
 */
ConfigManager.prototype.setWallet = function (wallet) {
  var data = this.getData()
  data.wallet = wallet
  this.setData(data)
}

/**
 * A setter for the vault in store
 *
 * @param {string} encryptedString The encrypted wallet
 *
 */
ConfigManager.prototype.setVault = function (encryptedString) {
  var data = this.getData()
  data.vault = encryptedString
  this.setData(data)
}

/**
 * A getter for the vault in store
 *
 * @returns {string} The wallet as an encrypted string
 *
 */
ConfigManager.prototype.getVault = function () {
  var data = this.getData()
  return data.vault
}


/**
 * A getter for the keychains in store
 *
 * @returns {array} The stored keychains
 *
 */
ConfigManager.prototype.getKeychains = function () {
  return this.getData().keychains || []
}

/**
 * A setter for the keychains in store
 *
 * @param {array} The stored keychains
 *
 */
ConfigManager.prototype.setKeychains = function (keychains) {
  var data = this.getData()
  data.keychains = keychains
  this.setData(data)
}

/**
 * A getter for the currently selected account
 *
 * @returns {string} A base 16, '0x' prefixed, hex address of the currently selected account
 *
 */
ConfigManager.prototype.getSelectedAccount = function () {
  var config = this.getConfig()
  return config.selectedAccount
}

/**
 * A setter for the currently selected account
 *
 * @param {string} address A base 16 hex address of the currently selected account
 *
 */
ConfigManager.prototype.setSelectedAccount = function (address) {
  var config = this.getConfig()
  config.selectedAccount = ethUtil.addHexPrefix(address)
  this.setConfig(config)
}

/**
 * A getter for the wallet property in store
 *
 * @returns The stored wallet object
 *
 */
ConfigManager.prototype.getWallet = function () {
  return this.getData().wallet
}

/**
 * A setter for the showSeedWords property. Indicates whether the UI is permitted to show the user's seed words.
 *
 * @param {boolean} should Whether or not the seed words can be shown in the UI
 */
ConfigManager.prototype.setShowSeedWords = function (should) {
  var data = this.getData()
  data.showSeedWords = should
  this.setData(data)
}

/**
 * A getter for the showSeedWords property. Indicates whether the UI is permitted to show the user's seed words.
 *
 * @returns {boolean} Whether or not the seed words can be shown in the UI
 */
ConfigManager.prototype.getShouldShowSeedWords = function () {
  var data = this.getData()
  return data.showSeedWords
}

/**
 * A setter for the seedWords in store.
 *
 * @param {string} words The seed words to store.
 *
 */
ConfigManager.prototype.setSeedWords = function (words) {
  var data = this.getData()
  data.seedWords = words
  this.setData(data)
}

/**
 * A getter for the seedWords in store.
 *
 * @returns {string} The seed words to store.
 *
 */
ConfigManager.prototype.getSeedWords = function () {
  var data = this.getData()
  return data.seedWords
}

/**
 * Called to set the isRevealingSeedWords flag. This happens only when the user chooses to reveal
 * the seed words and not during the first time flow.
 *
 * @param {boolean} reveal - Value to set the isRevealingSeedWords flag.
 *
 */
ConfigManager.prototype.setIsRevealingSeedWords = function (reveal = false) {
  const data = this.getData()
  data.isRevealingSeedWords = reveal
  this.setData(data)
}

/**
 * Returns the isRevealingSeedWords flag.
 *
 * @returns {boolean|undefined}
 *
 */
ConfigManager.prototype.getIsRevealingSeedWords = function () {
  const data = this.getData()
  return data.isRevealingSeedWords
}

/**
 * A setter for the provider property in store.
 *
 * @param {string} rpcUrl The new url to which provider.rpcTarget will be set.
 *
 */
ConfigManager.prototype.setRpcTarget = function (rpcUrl) {
  var config = this.getConfig()
  config.provider = {
    type: 'rpc',
    rpcTarget: rpcUrl,
  }
  this.setConfig(config)
}

/**
 * A setter for the provider.type property in store.
 *
 * @param {string} type The new provider type to which provider.type will be set.
 *
 */
ConfigManager.prototype.setProviderType = function (type) {
  var config = this.getConfig()
  config.provider = {
    type: type,
  }
  this.setConfig(config)
}

/**
 * A sets provider.type to 'etherscan'.
 *
 */
ConfigManager.prototype.useEtherscanProvider = function () {
  var config = this.getConfig()
  config.provider = {
    type: 'etherscan',
  }
  this.setConfig(config)
}


/**
 * A getter for the provider property in store.
 *
 * @returns {object} Data about the current provider
 *
 */
ConfigManager.prototype.getProvider = function () {
  var config = this.getConfig()
  return config.provider
}

/**
 * Returns a url for the current RPC based on the provider.type in store.
 *
 * @returns {string} The url of the current RPC
 *
 */
ConfigManager.prototype.getCurrentRpcAddress = function () {
  var provider = this.getProvider()
  if (!provider) return null
  switch (provider.type) {

    case 'mainnet':
      return MAINNET_RPC

    case 'ropsten':
      return ROPSTEN_RPC

    case 'kovan':
      return KOVAN_RPC

    case 'rinkeby':
      return RINKEBY_RPC

    default:
      return provider && provider.rpcTarget ? provider.rpcTarget : RINKEBY_RPC
  }
}

/**
 * A getter for the transactions stored in this ConfigManager.
 *
 * @returns {array} A list of transactions.
 *
 */
ConfigManager.prototype.getTxList = function () {
  var data = this.getData()
  if (data.transactions !== undefined) {
    return data.transactions
  } else {
    return []
  }
}

/**
 * A setter for the transactions stored in this ConfigManager. These should be the transactions of the selected account.
 *
 * @param {array} txList A new list of transactions to store.
 *
 */
ConfigManager.prototype.setTxList = function (txList) {
  var data = this.getData()
  data.transactions = txList
  this.setData(data)
}


/**
 * A getter for the walletNicknames stored in this ConfigManager.
 *
 * @returns {object} An index of wallet addresses to nicknames.
 *
 */
ConfigManager.prototype.getWalletNicknames = function () {
  var data = this.getData()
  const nicknames = ('walletNicknames' in data) ? data.walletNicknames : {}
  return nicknames
}

/**
 * Gets the nickname associated with a single account address
 *
 * @param {string} account A hex address for an account.
 * @returns {string} A nickname the user has previously assigned to the passed in account.
 *
 */
ConfigManager.prototype.nicknameForWallet = function (account) {
  const address = normalize(account)
  const nicknames = this.getWalletNicknames()
  return nicknames[address]
}

/**
 * Sets the nickname associated with a single account address
 *
 * @param {string} account A hex address for an account.
 * @param {string} nickname A new nickname for the passed in account.
 *
 */
ConfigManager.prototype.setNicknameForWallet = function (account, nickname) {
  const address = normalize(account)
  const nicknames = this.getWalletNicknames()
  nicknames[address] = nickname
  var data = this.getData()
  data.walletNicknames = nicknames
  this.setData(data)
}

/**
 * A getter for the salt stored in this ConfigManager.
 *
 * @returns {string} A hashing salt.
 *
 */
ConfigManager.prototype.getSalt = function () {
  var data = this.getData()
  return data.salt
}

/**
 * A setter for the salt stored in this ConfigManager.
 *
 * @param {string} salt A hashing salt.
 *
 */
ConfigManager.prototype.setSalt = function (salt) {
  var data = this.getData()
  data.salt = salt
  this.setData(data)
}

/**
 * Adds a subscribers to this._subs. This subscriber will be called with the config managers state when its config
 * property is updated.
 *
 * @param {Function} fn A function to call when the config manager emits an update. The function will be passed the
 * state object when called.
 * @returns {Function} A function that will remove the subscriber.
 *
 */
ConfigManager.prototype.subscribe = function (fn) {
  this._subs.push(fn)
  var unsubscribe = this.unsubscribe.bind(this, fn)
  return unsubscribe
}

/**
 * Removes a subscribers to this._subs.
 *
 * @param {Function} fn The subscriber to remove.
 *
 */
ConfigManager.prototype.unsubscribe = function (fn) {
  var index = this._subs.indexOf(fn)
  if (index !== -1) this._subs.splice(index, 1)
}

/**
 * Iterates over the subscribers in this._subs and invokes each with the passed state.
 *
 * @param {Object} state A newly update state to pass to each of the subscribers.
 *
 */
ConfigManager.prototype._emitUpdates = function (state) {
  this._subs.forEach(function (handler) {
    handler(state)
  })
}

/**
 * A setter for the lostAccounts stored in this ConfigManager.
 *
 * @param {array<string>} lostAccounts An array of account addresses
 *
 */
ConfigManager.prototype.setLostAccounts = function (lostAccounts) {
  var data = this.getData()
  data.lostAccounts = lostAccounts
  this.setData(data)
}

/**
 * A getter for the lostAccounts stored in this ConfigManager.
 *
 * @returns {array<string>} An array of account account addresses
 *
 */
ConfigManager.prototype.getLostAccounts = function () {
  var data = this.getData()
  return data.lostAccounts || []
}
