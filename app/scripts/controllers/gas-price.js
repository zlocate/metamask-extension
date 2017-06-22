const ObservableStore = require('obs-store')
const Suggestor = require('eth-gas-price-suggestor')
const DEFAULT_GAS_PRICE = 20000000000 // 20 gwei

class GasPriceController {

  constructor (opts = {}) {
    this.suggestor = new Suggestor(opts)
    this.blockTracker = opts.blockTracker
    this.store = new ObservableStore(DEFAULT_GAS_PRICE)

    this.blockTracker.on('block', async function () {
      try {
        const suggested = await this.suggestor.currentAverage()
        this.store.putState(suggested)
      } catch (e) {
        log.warn('Failed to update gas price', e)
      }
    })
  }

  //
  // PUBLIC METHODS
  //

  getGasPrice () {
    return this.store.getState()
  }
}

module.exports = GasPriceController
