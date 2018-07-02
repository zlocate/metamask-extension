import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { approveWeb3Request, rejectWeb3Request } from '../../ui/app/actions'
import { connect } from 'react-redux'

class Web3Approval extends Component {
  render () {
    const { approveWeb3Request, origin, rejectWeb3Request } = this.props
    return (
      <div className="flex-column flex-grow">
        <style dangerouslySetInnerHTML={{__html: `
          .web3_approval_actions {
            display: flex;
            justify-content: flex-end;
            margin: 14px 25px;
          }
          .web3_approval_actions button {
            margin-left: 10px;
            text-transform: uppercase;
          }
          .web3_approval_content {
            padding: 0 25px;
          }
          .web3_approval_origin {
            font-weight: bold;
            margin: 14px 0;
          }
        `}} />
        <div className="section-title flex-row flex-center">
          <i
            className="fa fa-arrow-left fa-lg cursor-pointer"
            onClick={() => { rejectWeb3Request(origin) }} />
          <h2 className="page-subtitle">Web3 API Request</h2>
        </div>
        <div className="web3_approval_content">
          {"The domain listed below is attempting to request access to the web3 API so it can interact with the Ethereum blockchain. Always double check that you're on the correct site before approving web3 access."}
          <div className="web3_approval_origin">{origin}</div>
        </div>
        <div className="web3_approval_actions">
          <button
            className="btn-green"
            onClick={() => { approveWeb3Request(origin) }}>APPROVE</button>
          <button
            className="cancel btn-red"
            onClick={() => { rejectWeb3Request(origin) }}>REJECT</button>
        </div>
      </div>
    )
  }
}

Web3Approval.propTypes = {
  approveWeb3Request: PropTypes.func,
  origin: PropTypes.string,
  rejectWeb3Request: PropTypes.func,
}

function mapDispatchToProps (dispatch) {
  return {
    approveWeb3Request: origin => dispatch(approveWeb3Request(origin)),
    rejectWeb3Request: origin => dispatch(rejectWeb3Request(origin)),
  }
}

module.exports = connect(null, mapDispatchToProps)(Web3Approval)
