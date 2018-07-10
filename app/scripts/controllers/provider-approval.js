const ObservableStore = require('obs-store')

/**
 * A controller that services user-approved requests for an Ethereum provider API
 */
class ProviderApprovalController {
  /**
   * Creates an ProviderApprovalController
   *
   * @param {Object} [config] - Options to configure controller
   */
  constructor ({ closePopup, openPopup, platform } = {}) {
    this.store = new ObservableStore()
    this.closePopup = closePopup
    this.openPopup = openPopup
    this.platform = platform

    platform && platform.addMessageListener(({ action, origin, web3 }) => {
      action && action === 'init-provider-request' && this.handleProviderRequest(origin, web3)
    })
  }

  /**
   * Called when a tab requests access to an Ethereum provider API
   *
   * @param {string} origin - Origin of the window requesting provider access
   * @param {boolean} web3 - Whether or not this tab requested web3.js injection
   */
  handleProviderRequest (origin, web3) {
    this.store.updateState({ providerRequests: [{ origin, web3 }] })
    this.openPopup && this.openPopup()
  }

  /**
   * Called when a user approves access to an Ethereum provider API
   *
   * @param {string} origin - Origin of the target window to approve provider access
   */
  approveProviderRequest (origin) {
    this.closePopup && this.closePopup()
    const requests = this.store.getState().providerRequests || []
    this.platform && this.platform.sendMessage({
      action: 'approve-provider-request',
      web3: requests[0] && requests[0].web3,
    }, { active: true })
    const providerRequests = requests.filter(request => request.origin !== origin)
    this.store.updateState({ providerRequests })
  }

  /**
   * Called when a tab rejects access to an Ethereum provider API
   *
   * @param {string} origin - Origin of the target window to reject provider access
   */
  rejectProviderRequest (origin) {
    this.closePopup && this.closePopup()
    const requests = this.store.getState().providerRequests || []
    const providerRequests = requests.filter(request => request.origin !== origin)
    this.store.updateState({ providerRequests })
  }
}

module.exports = ProviderApprovalController
