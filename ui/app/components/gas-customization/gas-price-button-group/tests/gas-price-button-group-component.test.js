import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import GasPriceButtonGroup from '../gas-price-button-group.component'

import ButtonGroup from '../../../button-group/'
import Button from '../../../button/'

const propsMethodSpies = {
  setGasPrice: sinon.spy(),
}

describe('GasPriceButtonGroup Component', function () {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<GasPriceButtonGroup
      setGasPrice={propsMethodSpies.setGasPrice}
    />)
  })

  afterEach(() => {
    propsMethodSpies.setGasPrice.resetHistory()
  })

  describe('render', () => {
    it('should render a ButtonGroup',  () => {
      assert(wrapper.is(ButtonGroup))
    })

    it('should render three Buttons', () => {
      assert.equal(wrapper.find(Button).length, 3)
    })

    it('should render a fiat price, crypto price, and time estimate for each button', () => {
      const buttons = wrapper.find(Button)
      let buttonChildren
      buttons.forEach(button => {
        assert.equal(button.find('.gas-price-button-group__button-fiat-price').length, 1)
        assert.equal(button.find('.gas-price-button-group__button-crypto-price').length, 1)
        assert.equal(button.find('.gas-price-button-group__button-time-estimate').length, 1)
      })
    })
  })
})
