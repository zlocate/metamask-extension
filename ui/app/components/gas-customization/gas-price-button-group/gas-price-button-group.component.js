import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ButtonGroup from '../../button-group'
import Button from '../../button'

const GAS_OBJECT_PROPTYPES_SHAPE = {
  fiat: PropTypes.string,
  eth: PropTypes.string,
  timeEstimate: PropTypes.object,
  priceInHexWei: PropTypes.string,
}

export default class GasPriceButtonGroup extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
    lowGas: PropTypes.shape(GAS_OBJECT_PROPTYPES_SHAPE),
    medGas: PropTypes.shape(GAS_OBJECT_PROPTYPES_SHAPE),
    highGas: PropTypes.shape(GAS_OBJECT_PROPTYPES_SHAPE),
    estimatesLoading: PropTypes.bool,
    setCustomGasPriceAndTotal: PropTypes.func,
    fetchGasEstimates: PropTypes.func,
    gasLimit: PropTypes.string,
  }

  componentWillMount () {
    this.props.fetchGasEstimates()
  }

  renderButton ({ fiat, eth, timeEstimate, priceInHexWei }, gasLimit, setCustomGasPriceAndTotal) {
    return (
      <Button onClick={() => {
        setCustomGasPriceAndTotal(priceInHexWei, gasLimit)
      }} >
        <div className="gas-price-button-group__button-fiat-price">{ fiat }</div>
        <div className="gas-price-button-group__button-crypto-price">{ eth }</div>
        <div className="gas-price-button-group__button-time-estimate">{ timeEstimate.time }{ timeEstimate.label }</div>
        <i className="fa fa-check fa-2x" />
      </Button>
    )
  }

  render () {
    const { lowGas, medGas, highGas, setCustomGasPriceAndTotal, estimatesLoading, gasLimit } = this.props

    return (
      <ButtonGroup className="gas-price-button-group" noButtonActiveByDefault={true}>
        {!estimatesLoading && this.renderButton(highGas, gasLimit, setCustomGasPriceAndTotal)}
        {!estimatesLoading && this.renderButton(medGas, gasLimit, setCustomGasPriceAndTotal)}
        {!estimatesLoading && this.renderButton(lowGas, gasLimit, setCustomGasPriceAndTotal)}
      </ButtonGroup>
    )
  }
}
