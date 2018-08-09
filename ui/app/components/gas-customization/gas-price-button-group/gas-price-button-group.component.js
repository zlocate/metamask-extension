import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ButtonGroup from '../../button-group'
import Button from '../../button'

export default class GasPriceButtonGroup extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  static propTypes = {
  }

  renderButton () {
    return (
      <Button>
        <div className="gas-price-button-group__button-fiat-price">$0.30</div>
        <div className="gas-price-button-group__button-crypto-price">.00354 ETH</div>
        <div className="gas-price-button-group__button-time-estimate">~ 2 min 0 sec</div>
        <i className="fa fa-check fa-2x" />
      </Button>
    )
  }

  render () {

    return (
      <ButtonGroup className="gas-price-button-group">
        {this.renderButton()}
        {this.renderButton()}
        {this.renderButton()}
      </ButtonGroup>
    )
  }
}
