const ObservableStore = require('obs-store')
const EventEmitter = require('events')
const extend = require('xtend')
const MetaPlugin = require('./metaplugin')

class PluginController extends EventEmitter {

  constructor (opts = {}) {
    super()

    this.pluginApi = {
      ping (message) {
        console.log('ping called ' + message)
      }
    }

    const initState = extend({
      plugins: {

        // Imagine we have a plugin named "sampleApi".
        // It presumably also injects an API named window.sampleApi into websites visited.
        sampleApi: {
          script: `

            // A plugin is a function that receives a metamask plugin API:
            function (pluginApi) {

              // A plugin returns an object that adheres to the MetaPlugin protocol:
              return {

                // A MetaPlugin includes a getApi() method that returns an API object.
                getApi() {
                  return {

                    // Let's imagine the protocol requires the API to provide a getName() method.
                    getName() {
                      console.log('sandboxed plugin getting name...')
                      return 'test plugin'
                    }
                  }
                }
              }
            }
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
