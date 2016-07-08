var assert = require('assert')

const h = require('react-hyperscript')
const Root = require('../../ui/app/root')
const configureStore = require('../../development/mockStore')
const sinon = require('sinon')

const path = require('path')
const fs = require('fs')

// Get all the states.jsons
const statesPath = path.join(__dirname, '..', '..', 'development', 'states')
const stateNames = fs.readdirSync(statesPath)
const states = stateNames.reduce((result, stateFileName) => {
  const statePath = path.join(__dirname, '..', '..', 'development', 'states', stateFileName)
  const stateFile = fs.readFileSync(statePath).toString()
  const state = JSON.parse(stateFile)
  result[stateFileName.split('.')[0].replace(/-/g, ' ', 'g')] = state
  return result
}, {})

import { mount } from 'enzyme'

var store = configureStore(states[Object.keys(states)[1]])

describe('Metamask UI Root', () => {

  it('calls componentDidMount', () => {
    Root.prototype.componentDidMount = sinon.spy()
    const wrapper = mount((
      h(Root, {
       store,
      })
    ))
    assert.ok(Foo.prototype.componentDidMount.calledOnce)
    Foo.prototype.componentDidMount.restore()
  })

})
