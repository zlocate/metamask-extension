import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import AppHeader from './app-header.component'
const actions = require('../../../store/actions')

const mapStateToProps = state => {
  const { appState, metamask } = state

  return {
    networkDropdownOpen: appState.networkDropdownOpen,
    network: metamask.network,
    provider: metamask.provider,
    selectedAddress: metamask.selectedAddress,
    isUnlocked: metamask.isUnlocked,
    isAccountMenuOpen: metamask.isAccountMenuOpen,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showNetworkDropdown: () => dispatch(actions.showNetworkDropdown()),
    hideNetworkDropdown: () => dispatch(actions.hideNetworkDropdown()),
    toggleAccountMenu: () => dispatch(actions.toggleAccountMenu()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(AppHeader)
