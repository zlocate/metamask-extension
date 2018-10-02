const ObservableStore = require('obs-store')
const EventEmitter = require('events')
const extend = require('xtend')
const MetaPlugin = require('./metaplugin')

class PluginController extends EventEmitter {

  constructor (opts = {}) {
    super()

    this.pluginApi = {
      ping (message) {
        console.log('ping called')
      }
    }

    const initState = extend({
      plugins: {
        sampleApi: {
          script: `
            window.onmessage = function(e){
                if (e.data == 'hello') {
                    alert('It works!');
                    window.parent.postMessage('PONG FROM PLUGIN', '*')
                }
            };
          `,
        },
      },
    }, opts.initState)
    this.store = new ObservableStore(initState)

    this.plugins = Object.keys(initState.plugins).reduce((result, key) => {
      result[key] = new MetaPlugin(initState.plugins[key], this.pluginApi)
      return result
    }, {})
  }

  addPluginMiddleware (req, res, next, end) {
    return end('Added!')
  }

  injectPluginMiddleware (req, res, next, end) {
    return end('Injected!')
  }

}

module.exports = PluginController
