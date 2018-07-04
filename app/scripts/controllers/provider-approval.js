const ObservableStore = require('obs-store')

/**
 * A controller that services Ethereum provider API requests
 */
class APIApprovalController {
  /**
   * Creates an APIApprovalController
   *
   * @param {Object} [config] - Options to configure controller
   */
  constructor ({ closePopup, openPopup, platform } = {}) {
    this.store = new ObservableStore()
    this.closePopup = closePopup
    this.openPopup = openPopup
    this.platform = platform

    platform && platform.addMessageListener(({ action, origin, web3 }) => {
      action && action === 'init-api-request' && this.handleAPIRequest(origin, web3)
    })
  }

  /**
   * Called when a tab requests access to an Ethereum provider API
   *
   * @param {string} origin - Origin of the window requesting provider access
   * @param {boolean} web3 - Whether or not this tab requested web3.js injection
   */
  handleAPIRequest (origin, web3) {
    this.store.updateState({ pendingWeb3Requests: [{ origin, web3 }] })
    this.openPopup && this.openPopup()
  }

  /**
   * Called when a user approves web3 access
   *
   * @param {string} origin - Origin of the target window to approve web3 access
   */
  approveAPIRequest (origin) {
    this.closePopup && this.closePopup()
    const requests = this.store.getState().pendingWeb3Requests || []
    this.platform && this.platform.sendMessage({
      action: 'approve-api-request',
      web3: requests[0] && requests[0].web3,
    }, { active: true })
    const pendingWeb3Requests = requests.filter(request => request.origin !== origin)
    this.store.updateState({ pendingWeb3Requests })
  }

  /**
   * Called when a tab rejects web3 access
   *
   * @param {string} origin - Origin of the target window to reject web3 access
   */
  rejectWeb3Request (origin) {
    const { closePopup } = this.opts
    closePopup && closePopup()
    const requests = this.store.getState().pendingWeb3Requests || []
    const pendingWeb3Requests = requests.filter(request => request.origin !== origin)
    this.store.updateState({ pendingWeb3Requests })
  }
}

module.exports = APIApprovalController
