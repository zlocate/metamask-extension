const h = require('react-hyperscript')
const connect = require('../../metamask-connect')
const LocaleComponent = require('../../components/locale')


class SeedImportSubview extends LocaleComponent {}

module.exports = connect(mapStateToProps)(SeedImportSubview)

function mapStateToProps (state) {
  return {}
}

SeedImportSubview.prototype.render = function () {
  return (
    h('div', {
      style: {
      },
    }, [
      this.t('pasteSeed'),
      h('textarea'),
      h('br'),
      h('button', this.t('submit')),
    ])
  )
}
