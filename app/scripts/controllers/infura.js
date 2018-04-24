const ObservableStore = require('obs-store')
const extend = require('xtend')
const log = require('loglevel')

// every ten minutes
const POLLING_INTERVAL = 10 * 60 * 1000

class InfuraController {

  /**
   * Controller responsible for storing, retrieving, polling for and updating the status of Infura's nodes.
   *
   * @typedef {Object} InfuraController
   * @param {object} opts Overrides the defaults for the initial state of this.store
   * @property {object} store.infuraNetworkStatus An object with status information about each of the networks for which
   * Infura has a node. @see {@link https://api.infura.io/v1/status/metamask}. Networks can have a status of 'okay',
   * 'degraded' or 'down'.
   * @property {number} conversionInterval Id of the interval created to periodically update the infuraNetworkStatus in
   * store.
   *
   */
  constructor (opts = {}) {
    const initState = extend({
      infuraNetworkStatus: {},
    }, opts.initState)
    this.store = new ObservableStore(initState)
  }

  /**
   * Responsible for retrieving the status of Infura's nodes. 
   *
   * @returns {Promise<object>} Promises an object with keys named for each of Infura's networks and their status.
   * Networks can have a status of 'okay', 'degraded' or 'down'.
   *
   */
  async checkInfuraNetworkStatus () {
    const response = await fetch('https://api.infura.io/v1/status/metamask')
    const parsedResponse = await response.json()
    this.store.updateState({
      infuraNetworkStatus: parsedResponse,
    })
    return parsedResponse
  }

  /**
   * Creates an interval at which this.checkInfuraNetworkStatus should be called. An existing interval will be cleared
   * with each call.
   *
   */
  scheduleInfuraNetworkCheck () {
    if (this.conversionInterval) {
      clearInterval(this.conversionInterval)
    }
    this.conversionInterval = setInterval(() => {
      this.checkInfuraNetworkStatus().catch(log.warn)
    }, POLLING_INTERVAL)
  }
}

module.exports = InfuraController
