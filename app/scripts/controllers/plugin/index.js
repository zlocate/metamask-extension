const ObservableStore = require('obs-store')
const EventEmitter = require('events')
const extend = require('xtend')

class PluginController extends EventEmitter {

  constructor (opts = {}) {
    super()

    const initState = extend({
      plugins: [],
    }, opts.initState)
    this.store = new ObservableStore(initState)
  }

  addPluginMiddleware (req, res, next end) {
    return end('Added!')
  }

  injectPluginMiddleware (req, res, next end) {
    return end('Injected!')
  }

}

module.exports = PluginController
