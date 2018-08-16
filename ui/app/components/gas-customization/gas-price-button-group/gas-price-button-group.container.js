import { connect } from 'react-redux'
import { pipe } from 'ramda'
import mapValues from 'lodash.mapvalues'
import GasPriceButtonGroup from './gas-price-button-group.component'
import {
  getBasicPriceRecommendations,
  getBasicBlockWaitEstimates,
  getCurrentBlockTime,
  getBasicGasEstimateLoadingStatus,
} from '../gas.selectors'
import {
  getConversionRate,
  getGasLimit,
  getGasPrice,
} from '../../send/send.selectors'
import {
  formatCurrency,
} from '../../../helpers/confirm-transaction/util'
import {
  calcGasTotal,
} from '../../send/send.utils'
import {
  getCurrentCurrency,
} from '../../../selectors'
// import { setGasPrice, setGasTotal } from '../../../actions'
import {
  fetchGasEstimates,
  setCustomGasPrice,
  setCustomGasTotal,
} from '../../../ducks/gas-estimates.duck'
import {
  conversionUtil,
  multiplyCurrencies,
} from '../../../conversion-util'


const pipeStatetoRenderableProps = pipe(
  mapStateToRaw,
  mapRawToCalculated,
  mapCalculatedToFormatted,
  mapFormattedToProps,
)

function mapStateToProps (state) {
  const estimatesLoading = getBasicGasEstimateLoadingStatus(state)
  const renderableProps = estimatesLoading
    ? {
      lowGas: {},
      medGas: {},
      highGas: {},
    }
    : pipeStatetoRenderableProps(state)

  const {
    lowGas,
    medGas,
    highGas,
  } = renderableProps

  return {
    lowGas,
    medGas,
    highGas,
    estimatesLoading,
    gasLimit: getGasLimit(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setCustomGasPriceAndTotal: (newPrice, gasLimit) => {
      dispatch(setCustomGasPrice(newPrice))
      dispatch(setCustomGasTotal(calcGasTotal(gasLimit, newPrice)))
    },
    fetchGasEstimates: () => dispatch(fetchGasEstimates()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GasPriceButtonGroup)

function mapStateToRaw (state) {
  return {
    blockWaitEstimates: getBasicBlockWaitEstimates(state),
    recommendedPrices: getBasicPriceRecommendations(state),
    currentBlockTime: getCurrentBlockTime(state),
    currentCurrency: getCurrentCurrency(state),
    conversionRate: getConversionRate(state),
    gasLimit: getGasLimit(state),
    gasPrice: getGasPrice(state),
  }
}

function mapRawToCalculated ({
  blockWaitEstimates,
  recommendedPrices,
  currentBlockTime,
  conversionRate,
  currentCurrency,
  gasLimit,
  gasPrice,
}) {
  const recommendedFeesInEth = mapValues(recommendedPrices, price => {
    return conversionUtil(calcGasTotal(gasLimit, price * 0.10), {
      fromNumericBase: 'hex',
      toNumericBase: 'dec',
      fromDenomination: 'GWEI',
      numberOfDecimals: 9,
    })
  })

  const recommendedFeesInFiat = mapValues(recommendedFeesInEth, ethPrice => {
    return conversionUtil(ethPrice, {
      fromNumericBase: 'dec',
      fromCurrency: 'ETH',
      toCurrency: currentCurrency,
      numberOfDecimals: 2,
      conversionRate,
    })
  })

  const pricesInHexWei = mapValues(recommendedPrices, ethPrice => {
    const modifiedEthGasStationPrice = multiplyCurrencies(ethPrice, 0.10, {
      toNumericBase: 'dec',
      multiplicandBase: 10,
      multiplierBase: 10,
      numberOfDecimals: 9,
    })
    return conversionUtil(modifiedEthGasStationPrice, {
      fromNumericBase: 'dec',
      toNumericBase: 'hex',
      fromDenomination: 'GWEI',
      toDenomination: 'WEI',
      numberOfDecimals: 9,
    })
  })

  const timeEstimatesInSeconds = mapValues(blockWaitEstimates, blockWaitEstimate => {
    return multiplyCurrencies(blockWaitEstimate, currentBlockTime, {
      toNumericBase: 'dec',
      multiplicandBase: 10,
      multiplierBase: 10,
      numberOfDecimals: 1,
    })
  })

  return {
    currentCurrency,
    pricesInHexWei,
    recommendedFeesInEth,
    recommendedFeesInFiat,
    timeEstimatesInSeconds,
  }
}

function mapCalculatedToFormatted ({
  timeEstimatesInSeconds,
  recommendedFeesInEth,
  recommendedFeesInFiat,
  currentCurrency,
  pricesInHexWei,
}) {
  const formattedTimeEstimates = mapValues(timeEstimatesInSeconds, totalSeconds => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const time = `${minutes ? minutes + ':' : ''}${seconds} `
    const label = minutes ? 'min' : 'sec'

    return {
      time,
      label,
    }
  })
  const formattedFeesInEth = mapValues(recommendedFeesInEth, feeInEth => feeInEth + ' ETH')
  const formattedFeesInFiat = mapValues(recommendedFeesInFiat, feeInFiat => formatCurrency(feeInFiat, currentCurrency))

  return {
    formattedTimeEstimates,
    formattedFeesInEth,
    formattedFeesInFiat,
    pricesInHexWei,
  }
}

function mapFormattedToProps ({
  formattedTimeEstimates,
  formattedFeesInEth,
  formattedFeesInFiat,
  pricesInHexWei,
}) {
  return {
    lowGas: {
      fiat: formattedFeesInFiat.low,
      eth: formattedFeesInEth.low,
      timeEstimate: formattedTimeEstimates.low,
      priceInHexWei: pricesInHexWei.low,
    },
    medGas: {
      fiat: formattedFeesInFiat.med,
      eth: formattedFeesInEth.med,
      timeEstimate: formattedTimeEstimates.med,
      priceInHexWei: pricesInHexWei.med,
    },
    highGas: {
      fiat: formattedFeesInFiat.high,
      eth: formattedFeesInEth.high,
      timeEstimate: formattedTimeEstimates.high,
      priceInHexWei: pricesInHexWei.high,
    },
  }
}
