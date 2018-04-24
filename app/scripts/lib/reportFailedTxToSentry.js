const extractEthjsErrorMessage = require('./extractEthjsErrorMessage')

module.exports = reportFailedTxToSentry

/**
 * Utility for formatting failed transaction messages for sending to sentry.
 *
 * @param {object} config
 * @param {object} config.raven The raven instance used to submit the error to Sentry.
 * @param {object} config.txMeta The transaction metadata from which to extract the error message.
 *
 */
function reportFailedTxToSentry({ raven, txMeta }) {
  const errorMessage = 'Transaction Failed: ' + extractEthjsErrorMessage(txMeta.err.message)
  raven.captureMessage(errorMessage, {
    // "extra" key is required by Sentry
    extra: txMeta,
  })
}
