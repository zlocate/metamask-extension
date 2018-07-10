import PageContainerContent from '../page-container'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { approveWeb3Request, rejectWeb3Request } from '../../actions'
import { connect } from 'react-redux'

class Web3Approval extends Component {
  render () {
    const { approveWeb3Request, origin, rejectWeb3Request } = this.props
    return (
      <PageContainerContent
        title={this.context.t('web3APIRequest')}
        subtitle={this.context.t('pleaseReviewWeb3Request')}
        ContentComponent={() => (
          <div className="web3_approval_content">
            {this.context.t('web3RequestInfo')}
            <div className="web3_approval_origin">{origin}</div>
          </div>
        )}
        submitText={this.context.t('approve')}
        cancelText={this.context.t('reject')}
        onSubmit={() => { approveWeb3Request(origin) }}
        onCancel={() => { rejectWeb3Request(origin) }}
        onClose={() => { rejectWeb3Request(origin) }} />
    )
  }
}

Web3Approval.propTypes = {
  approveWeb3Request: PropTypes.func,
  origin: PropTypes.string,
  rejectWeb3Request: PropTypes.func,
}

Web3Approval.contextTypes = {
  t: PropTypes.func,
}

function mapDispatchToProps (dispatch) {
  return {
    approveWeb3Request: origin => dispatch(approveWeb3Request(origin)),
    rejectWeb3Request: origin => dispatch(rejectWeb3Request(origin)),
  }
}

module.exports = connect(null, mapDispatchToProps)(Web3Approval)
