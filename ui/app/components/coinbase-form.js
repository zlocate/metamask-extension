const h = require('react-hyperscript')
const connect = require('../metamask-connect')
const actions = require('../actions')
const LocaleComponent = require('./locale')


class CoinbaseForm extends LocaleComponent {}

module.exports = connect(mapStateToProps)(CoinbaseForm)

function mapStateToProps (state) {
  return {
    warning: state.appState.warning,
  }
}

CoinbaseForm.prototype.render = function () {
  var props = this.props

  return h('.flex-column', {
    style: {
      marginTop: '35px',
      padding: '25px',
      width: '100%',
    },
  }, [
    h('.flex-row', {
      style: {
        justifyContent: 'space-around',
        margin: '33px',
        marginTop: '0px',
      },
    }, [
      h('button.btn-green', {
        onClick: this.toCoinbase.bind(this),
      }, this.t('continueToCoinbase')),

      h('button.btn-red', {
        onClick: () => props.dispatch(actions.goHome()),
      }, this.t('cancel')),
    ]),
  ])
}

CoinbaseForm.prototype.toCoinbase = function () {
  const props = this.props
  const address = props.buyView.buyAddress
  props.dispatch(actions.buyEth({ network: '1', address, amount: 0 }))
}

CoinbaseForm.prototype.renderLoading = function () {
  return h('img', {
    style: {
      width: '27px',
      marginRight: '-27px',
    },
    src: 'images/loading.svg',
  })
}
