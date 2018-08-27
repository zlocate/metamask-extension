import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import BasicTabContent from '../basic-tab-content.component'

import GasPriceButtonGroup from '../../../gas-price-button-group/'

const propsMethodSpies = {
  setGasPrice: sinon.spy(),
}

describe('BasicTabContent Component', function () {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<BasicTabContent
      setGasPrice={propsMethodSpies.setGasPrice}
    />)
  })

  afterEach(() => {
    propsMethodSpies.setGasPrice.resetHistory()
  })

  describe('render', () => {
    it('should have a title', () => {
      assert(wrapper.find('.basic-tab-content').childAt(0).hasClass('basic-tab-content__title'))
    })

    it('should render a GasPriceButtonGroup compenent', () => {
      assert.equal(wrapper.find(GasPriceButtonGroup).length, 1)
    })

    it('should pass correct props to GasPriceButtonGroup', () => {
      const {
        onFeeSelection,
      } = wrapper.find(GasPriceButtonGroup).props()
      assert.equal(propsMethodSpies.setGasPrice.callCount, 0)
      onFeeSelection('mockGasPrice')
      assert.equal(propsMethodSpies.setGasPrice.callCount, 1)
      assert.deepEqual(propsMethodSpies.setGasPrice.getCall(0).args, ['mockGasPrice'])
    })
  })
})
