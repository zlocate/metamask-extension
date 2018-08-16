const selectors = {
  getBasicPriceRecommendations,
  getBasicBlockWaitEstimates,
  getCurrentBlockTime,
  getBasicGasEstimateLoadingStatus,
}

module.exports = selectors

function getBasicPriceRecommendations (state) {
  const {
    lowGasPriceRecommendation,
    medGasPriceRecommendation,
    highGasPriceRecommendation,
  } = state.gasEstimates

  return {
    high: highGasPriceRecommendation,
    med: medGasPriceRecommendation,
    low: lowGasPriceRecommendation,
  }
}

function getBasicBlockWaitEstimates (state) {
  const {
    lowBlockWaitEstimates,
    medBlockWaitEstimates,
    highBlockWaitEstimates,
  } = state.gasEstimates

  return {
    high: highBlockWaitEstimates,
    med: medBlockWaitEstimates,
    low: lowBlockWaitEstimates,
  }
}

function getCurrentBlockTime (state) {
  return state.gasEstimates.currentBlockTime
}

function getBasicGasEstimateLoadingStatus (state) {
  return state.gasEstimates.basicEstimateIsLoading
}
