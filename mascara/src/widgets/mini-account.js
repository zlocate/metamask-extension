const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const identicon = require('../../../ui/app/components/mini-account-panel.js')
class MiniAccountWidget extends Component {

  constructor (props, ...args) {
    super(props, ...args)
    this.state = {}
    props.publicConfigStore.subscribe(this.setState.bind(this))
  }


  render () {
    const props = this.props
    const selectedAddress = this.state.selectedAddress || 'locked'
    console.log('selectedAddress ->', selectedAddress)
    const locked = (selectedAddress === 'locked')
    return h('div', {
        style: {
        },
      },
        !locked ? [h(identicon, {imageSeed: selectedAddress}), selectedAddress] : 'locked'
      )

  }
}

module.exports = MiniAccountWidget
