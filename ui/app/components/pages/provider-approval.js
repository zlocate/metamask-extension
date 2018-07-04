import PageContainerContent from '../page-container'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { approveProviderRequest, rejectProviderRequest } from '../../actions'
import { connect } from 'react-redux'

class ProviderApproval extends Component {
  render () {
    const { approveProviderRequest, origin, rejectProviderRequest } = this.props
    return (
      <PageContainerContent
        title={this.context.t('providerAPIRequest')}
        subtitle={this.context.t('reviewProviderRequest')}
        ContentComponent={() => (
          <div className="provider_approval_content">
            {this.context.t('providerRequestInfo')}
            <div className="provider_approval_origin">{origin}</div>
          </div>
        )}
        submitText={this.context.t('approve')}
        cancelText={this.context.t('reject')}
        onSubmit={() => { approveProviderRequest(origin) }}
        onCancel={() => { rejectProviderRequest(origin) }}
        onClose={() => { rejectProviderRequest(origin) }} />
    )
  }
}

ProviderApproval.propTypes = {
  approveProviderRequest: PropTypes.func,
  origin: PropTypes.string,
  rejectProviderRequest: PropTypes.func,
}

ProviderApproval.contextTypes = {
  t: PropTypes.func,
}

function mapDispatchToProps (dispatch) {
  return {
    approveProviderRequest: origin => dispatch(approveProviderRequest(origin)),
    rejectProviderRequest: origin => dispatch(rejectProviderRequest(origin)),
  }
}

module.exports = connect(null, mapDispatchToProps)(ProviderApproval)
