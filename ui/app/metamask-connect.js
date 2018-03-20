const connect = require('react-redux').connect

//
// this is a wrapper around "connect" that allows us to inject the current i18n locale into props
//

const metamaskConnect = (mapStateToProps, mapDispatchToProps) => {
    return connect(
        _higherOrderMapStateToProps(mapStateToProps),
        mapDispatchToProps
    )
}

const _higherOrderMapStateToProps = (mapStateToProps) => {
    return (state, ownProps = {}) => {
        const stateProps = mapStateToProps
            ? mapStateToProps(state, ownProps)
            : ownProps
        stateProps.localeMessages = state.localeMessages || {}
        return stateProps
    }
}

module.exports = metamaskConnect
