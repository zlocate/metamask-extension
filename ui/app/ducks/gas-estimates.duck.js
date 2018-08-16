// Actions
const BASIC_GAS_ESTIMATE_LOADING_STARTED = 'metamask/gas/BASIC_GAS_ESTIMATE_LOADING_STARTED'
const BASIC_GAS_ESTIMATE_LOADING_FINISHED = 'metamask/gas/BASIC_GAS_ESTIMATE_LOADING_FINISHED'
const SET_BASIC_GAS_ESTIMATE_DATA = 'metamask/gas/SET_BASIC_GAS_ESTIMATE_DATA'
const SET_CUSTOM_GAS_PRICE_AND_TOTAL = 'metamask/gas/SET_CUSTOM_GAS_PRICE_AND_TOTAL'
const SET_CUSTOM_GAS_PRICE = 'metamask/gas/SET_CUSTOM_GAS_PRICE'

// TODO: determine if this approach to initState is consistent with conventional ducks pattern
const initState = {
  lowGasPriceRecommendation: '',
  medGasPriceRecommendation: '',
  highGasPriceRecommendation: '',
  lowBlockWaitEstimates: '',
  medBlockWaitEstimates: '',
  highBlockWaitEstimates: '',
  currentBlockTime: null,
  basicEstimateIsLoading: true,
  customTotal: '',
}

// Reducer
export default function reducer ({ gasEstimates: gasEstimatesState = initState }, action = {}) {
  const newState = { ...gasEstimatesState }

  switch (action.type) {
    case BASIC_GAS_ESTIMATE_LOADING_STARTED:
      return {
        ...newState,
        basicEstimateIsLoading: true,
      }
    case BASIC_GAS_ESTIMATE_LOADING_FINISHED:
      return {
        ...newState,
        basicEstimateIsLoading: false,
      }
    case SET_BASIC_GAS_ESTIMATE_DATA:
      const {
        average,
        avgWait,
        blockTime,
        fast,
        fastWait,
        safeLow,
        safeLowWait,
      } = action.value

      return {
        ...newState,
        lowGasPriceRecommendation: safeLow,
        medGasPriceRecommendation: average,
        highGasPriceRecommendation: fast,
        lowBlockWaitEstimates: safeLowWait,
        medBlockWaitEstimates: avgWait,
        highBlockWaitEstimates: fastWait,
        currentBlockTime: blockTime,
      }
    case SET_CUSTOM_GAS_PRICE:
      return {
        ...newState,
        customPrice: action.value,
      }
    case SET_CUSTOM_GAS_PRICE_AND_TOTAL:
      return {
        ...newState,
        customTotal: action.value,
      }
    default:
      return newState
  }
}

// Action Creators
export function basicGasEstimatesLoadingStarted () {
  return {
    type: BASIC_GAS_ESTIMATE_LOADING_STARTED,
  }
}

export function basicGasEstimatesLoadingFinished () {
  return {
    type: BASIC_GAS_ESTIMATE_LOADING_FINISHED,
  }
}

export function setBasicGasEstimateData (basicGasEstimateData) {
  return {
    type: SET_BASIC_GAS_ESTIMATE_DATA,
    value: basicGasEstimateData,
  }
}

export function setCustomGasTotal (total) {
  return {
    type: SET_CUSTOM_GAS_PRICE_AND_TOTAL,
    value: total,
  }
}

export function setCustomGasPrice (gasPrice) {
  return {
    type: SET_CUSTOM_GAS_PRICE,
    value: gasPrice,
  }
}

export function fetchGasEstimates () {
  return (dispatch) => {
    dispatch(basicGasEstimatesLoadingStarted())

    return fetch('https://ethgasstation.info/json/ethgasAPI.json', {
      'headers': {},
      'referrer': 'http://ethgasstation.info/json/',
      'referrerPolicy': 'no-referrer-when-downgrade',
      'body': null,
      'method': 'GET',
      'mode': 'cors'}
    )
      .then(r => r.json())
      .then(({
        block_time: blockTime,
        safeLow,
        safeLowWait,
        average,
        avgWait,
        fast,
        fastWait,
      }) => {
        dispatch(setBasicGasEstimateData({
          blockTime,
          safeLow,
          safeLowWait,
          average,
          avgWait,
          fast,
          fastWait,
        }))
        dispatch(basicGasEstimatesLoadingFinished())
      })
  }
}
