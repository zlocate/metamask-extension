import React from 'react'
import PropTypes from 'prop-types'

const ClearApprovedOrigins = (props, context) => {
  const { t } = context
   return (
    <div className="modal-container__content">
      <div className="modal-container__title">
        { `${t('clearApprovalData')}` }
      </div>
      <div className="modal-container__description">
        { t('clearApprovalDataSuccess') }
      </div>
    </div>
  )
}

ClearApprovedOrigins.contextTypes = {
  t: PropTypes.func,
}

export default ClearApprovedOrigins
