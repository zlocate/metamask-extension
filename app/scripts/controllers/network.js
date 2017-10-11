const assert = require('assert')
const EventEmitter = require('events')
const ObservableStore = require('obs-store')
const ComposedStore = require('obs-store/lib/composed')
const extend = require('xtend')
const EthQuery = require('eth-query')
const createEthRpcClient = require('eth-rpc-client')
const createEthIpfsClient = require('eth-ipfs-client')
const IpfsClient = require('ipfs')
const dagRaw = require('ipld-raw')
const createEventEmitterProxy = require('../lib/events-proxy.js')
const createObjectProxy = require('../lib/obj-proxy.js')
const RPC_ADDRESS_LIST = require('../config.js').network
const DEFAULT_RPC = RPC_ADDRESS_LIST['rinkeby']
const ETH_IPFS_BRIDGES = [
  // '/dns4/ipfs.lab.metamask.io/tcp/443/wss/ipfs/QmdcCVdmHsA1s69GhQZrszpnb3wmtRwv81jojAurhsH9cz',
  '/dns4/fox.musteka.la/tcp/443/wss/ipfs/Qmc7etyUd9tEa3ZBD3LCTMDL96qcMi8cKfHEiLt5nhVdVC',
  '/dns4/bat.musteka.la/tcp/443/wss/ipfs/QmPaBC5Lmfj7vctVxRPcKvfZds9Zk96dgjgthvg4Dgf7at',
  '/dns4/monkey.musteka.la/tcp/443/wss/ipfs/QmZDfxSycZxaaYyrCyHdNEiip3wmxTgriPzEYETEn9Z6K3',
  '/dns4/panda.musteka.la/tcp/443/wss/ipfs/QmUGARsthjG4EJBCrYzkuCESjn5G2akmmuawKPbZrFM3E5',
  '/dns4/tiger.musteka.la/tcp/443/wss/ipfs/QmXFdPj3FuVpkgmNHNTFitkp4DSmVuF6HxNX6tCZr4LFz9',
]

module.exports = class NetworkController extends EventEmitter {

  constructor (config) {
    super()
    config.provider.rpcTarget = this.getRpcAddressForType(config.provider.type, config.provider)
    this.networkStore = new ObservableStore('loading')
    this.providerStore = new ObservableStore(config.provider)
    this.store = new ComposedStore({ provider: this.providerStore, network: this.networkStore })
    this.providerProxy = createObjectProxy()
    this.blockTrackerProxy = createEventEmitterProxy()

    const ipfs = new IpfsClient()
    this.ipfs = ipfs
    ipfs.on('ready', () => {
      ETH_IPFS_BRIDGES.map((address) => ipfs.swarm.connect(address))
    })

    // add "raw" codec for "base2"
    ipfs._ipldResolver.support.add('base2',
      dagRaw.resolver,
      dagRaw.util)

    this.on('networkDidChange', this.lookupNetwork)
  }

  initializeProvider (_providerParams) {
    this._baseProviderParams = _providerParams
    const rpcUrl = this.getCurrentRpcAddress()
    this._configureStandardClient({ rpcUrl })
    this.blockTrackerProxy.on('block', this._logBlock.bind(this))
    this.blockTrackerProxy.on('error', this.verifyNetwork.bind(this))
    this.ethQuery = new EthQuery(this.providerProxy)
    this.lookupNetwork()
  }

  verifyNetwork () {
    // Check network when restoring connectivity:
    if (this.isNetworkLoading()) this.lookupNetwork()
  }

  getNetworkState () {
    return this.networkStore.getState()
  }

  setNetworkState (network) {
    return this.networkStore.putState(network)
  }

  isNetworkLoading () {
    return this.getNetworkState() === 'loading'
  }

  lookupNetwork () {
    this.ethQuery.sendAsync({ method: 'net_version' }, (err, network) => {
      if (err) return this.setNetworkState('loading')
      log.info('web3.getNetwork returned ' + network)
      this.setNetworkState(network)
    })
  }

  setRpcTarget (rpcUrl) {
    this.providerStore.updateState({
      type: 'rpc',
      rpcTarget: rpcUrl,
    })
    this._switchNetwork({ rpcUrl })
  }

  getCurrentRpcAddress () {
    const provider = this.getProviderConfig()
    if (!provider) return null
    return this.getRpcAddressForType(provider.type)
  }

  async setProviderType (type) {
    assert(type !== 'rpc', `NetworkController.setProviderType - cannot connect by type "rpc"`)
    // skip if type already matches
    if (type === 'ipfs') return this._setIpfsClient()
    if (type === this.getProviderConfig().type) return
    // lookup rpcTarget for type
    const rpcTarget = this.getRpcAddressForType(type)
    assert(rpcTarget, `NetworkController - unknown rpc address for type "${type}"`)
    // update connection
    this.providerStore.updateState({ type, rpcTarget })
    this._switchNetwork({ rpcUrl: rpcTarget })
  }

  getProviderConfig () {
    return this.providerStore.getState()
  }

  getRpcAddressForType (type, provider = this.getProviderConfig()) {
    if (RPC_ADDRESS_LIST[type]) return RPC_ADDRESS_LIST[type]
    return provider && provider.rpcTarget ? provider.rpcTarget : DEFAULT_RPC
  }

  //
  // Private
  //

  _setIpfsClient() {
    // update state
    const type = 'ipfs'
    const rpcTarget = this.getRpcAddressForType('mainnet')
    this.providerStore.updateState({ type, rpcTarget })
    // create controller
    const ipfs = this.ipfs
    const client = createEthIpfsClient({ ipfs })
    global.ipfsClient = client
    this._setClient(client)
    this.emit('networkDidChange')
  }

  _switchNetwork (providerParams) {
    this.setNetworkState('loading')
    this._configureStandardClient(providerParams)
    this.emit('networkDidChange')
  }

  _configureStandardClient(_providerParams) {
    const providerParams = extend(this._baseProviderParams, _providerParams)
    const client = createEthRpcClient(providerParams)
    this._setClient(client)
  }

  _setClient (newClient) {
    // teardown old client
    const oldClient = this._currentClient
    if (oldClient) {
      oldClient.blockTracker.stop()
      // asyncEventEmitter lacks a "removeAllListeners" method
      // oldClient.blockTracker.removeAllListeners
      oldClient.blockTracker._events = {}
    }

    // set as new provider
    this._currentClient = newClient
    this.providerProxy.setTarget(newClient.provider)
    this.blockTrackerProxy.setTarget(newClient.blockTracker)
  }

  _logBlock (block) {
    log.info(`BLOCK CHANGED: #${block.number.toString('hex')} 0x${block.hash.toString('hex')}`)
    this.verifyNetwork()
  }
}
