const h = require('react-hyperscript')
const connect = require('../../metamask-connect')
const LocaleComponent = require('../../components/locale')

import Select from 'react-select'

// Subviews
const JsonImportView = require('./json.js')
const PrivateKeyImportView = require('./private-key.js')

class AccountImportSubview extends LocaleComponent {}

module.exports = connect(mapStateToProps)(AccountImportSubview)

function mapStateToProps (state) {
  return {
    menuItems: [
      this.t('privateKey'),
      this.t('jsonFile'),
    ],
  }
}

AccountImportSubview.prototype.render = function () {
  const props = this.props
  const state = this.state || {}
  const { menuItems } = props
  const { type } = state

  return (
    h('div.new-account-import-form', [

      h('.new-account-import-disclaimer', [
        h('span', this.t('importAccountMsg')),
        h('span', {
          style: {
            cursor: 'pointer',
            textDecoration: 'underline',
          },
          onClick: () => {
            global.platform.openWindow({
              url: 'https://metamask.helpscoutdocs.com/article/17-what-are-loose-accounts',
            })
          },
        }, this.t('here')),
      ]),

      h('div.new-account-import-form__select-section', [

        h('div.new-account-import-form__select-label', this.t('selectType')),

        h(Select, {
          className: 'new-account-import-form__select',
          name: 'import-type-select',
          clearable: false,
          value: type || menuItems[0],
          options: menuItems.map((type) => {
            return {
              value: type,
              label: type,
            }
          }),
          onChange: (opt) => {
            this.setState({ type: opt.value })
          },
        }),

      ]),

      this.renderImportView(),
    ])
  )
}

AccountImportSubview.prototype.renderImportView = function () {
  const props = this.props
  const state = this.state || {}
  const { type } = state
  const { menuItems } = props
  const current = type || menuItems[0]

  switch (current) {
    case this.t('privateKey'):
      return h(PrivateKeyImportView)
    case this.t('jsonFile'):
      return h(JsonImportView)
    default:
      return h(JsonImportView)
  }
}
