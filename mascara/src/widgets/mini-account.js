const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const Identicon = require('../../../ui/app/components/identicon.js')
const EthBalance = require('../../../ui/app/components/eth-balance.js')
class MiniAccountWidget extends Component {

  constructor (props, ...args) {
    super(props, ...args)
    this.state = props.state || {}
    props.limitedAccountManager.on('update', (state) => {
      this.setState(state)
    })
  }


  render () {
    const props = this.props
    const {
      selectedAddress = 'locked',
      identities = {},
      pendingTxCount,
      unapprovedMsgCount,
      accounts = {},
      currency = {},
    } = this.state
    console.log('selectedAddress ->', selectedAddress)
    const locked = (selectedAddress === 'locked')
    let value, name
    accounts[selectedAddress] ? value = accounts[selectedAddress].balance : value = '0x0'
    identities[selectedAddress] ? name = identities[selectedAddress].name : name = '...'
    console.log(value, '<- value')
    return h('.flex-row', {
        style: {
          padding: '3px',
          justifyContent: 'space-around',
          alignItems: 'center',
          position: 'absolute',
          right: '0px',
          top: '0px',
          width: '189px',
          border: 'solid',
          borderColor: 'rgba(247, 134, 28, 1)',
          borderBottomLeftRadius: '25px',
        },
      },
        !locked ? [
          h(Identicon, {
            diameter: 28,
            address: selectedAddress,
          }),
          h('.flex-column', {
            style: {
              marginLeft: '5px',
              fontSize: '12px',
            }
          }, [
            h('', {
              style: {
                paddingTop: '5px',
                lineHeight: '1px',
                marginTop: '8px',
              }
            }, name),
            h('', {
              style: {
                fontSize: '12px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                // paddingTop: '3px',
                width: '5em',
                fontSize: '13px',
                fontFamily: 'Montserrat Light',
                textRendering: 'geometricPrecision',
                // marginTop: '10px',
                // marginBottom: '15px',
                color: 'rgb(174, 174, 174)',
              }
            }, selectedAddress),
            h(EthBalance, {
              value,
              needsParse: true,
              conversionRate: currency.conversionRate,
              currentCurrency: currency.currentCurrency,
              showFiat: true,
            }),
          ]),
          h('i.fa.fa-unlock-alt', {
            style: {
              position: 'relative',
              bottom: '20px',
            },
            onClick: () => {
              props.limitedAccountManager.setLocked()
              .then(() => this.setState({selectedAddress: 'locked'}))
            }
          }),
        ] :
        [h('i.fa.fa-lock'), h('','locked')]
      )

  }
}

module.exports = MiniAccountWidget
