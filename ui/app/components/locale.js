const Component = require('react').Component
const { getMessage } = require('../../i18n-helper')

class LocaleComponent extends Component {

  t (messageKey) {
    return getMessage(this.props.localeMessages, messageKey)
  }

}

module.exports = LocaleComponent
