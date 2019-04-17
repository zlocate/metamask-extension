import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Media from 'react-media'
import MenuBar from '../menu-bar'
import Button from '../../ui/button'
const h = require('react-hyperscript')

const SES = require('ses');

export default class PluginView extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    showDepositModal: PropTypes.func,
    history: PropTypes.object,
  }

  constructor (props) {
    super(props)
    this.paramValues = []
  }

  // renderPluginButtons () {
  //   if (!this.props.selectedPluginScript){ return }
  //   let elements = []
  //   const pluginInterface = this.props.selectedPluginScript
  //   console.log(pluginInterface)

  //   for (var k = 0; k < pluginInterface.actions.length; k++){
  //     const index = k
  //     if (!this.paramValues[index]){
  // 	this.paramValues.push([])
  // 	console.log("def paramValues")
  //     }
  //     for (var i = 0; i < pluginInterface.actions[index].params.length; i++){
  // 	const subIndex = i
  // 	const param = pluginInterface.actions[index].params[subIndex]
  // 	elements.push(h('input', {
  // 	  key: "input" + index + subIndex,
  // 	  className: 'customize-gas-input',
  // 	  placeholder: param.name,
  // 	  type: param.type,
  // 	  onChange: e => {
  // 	    console.log("changed")
  // 	    this.paramValues[index][subIndex] = e.target.value
  // 	  },
  // 	}))

  //     }

  //     elements.push(<Button
  // 		    key={"button"+k}
  // 		    type="primary"
  // 		    className="plugin-view__button"
  // 		    onClick={() => {
  // 		      console.log(this.paramValues[index])
  // 		      pluginInterface.actions[index].call(...this.paramValues[index])
  // 		    }}
  // 		    >
  // 		    {pluginInterface.actions[index].name}
  // 		    </Button>)

  //   }
  //   return elements
  // }

  renderSandboxedUi(){

    const s = SES.makeSESRootRealm({consoleMode: 'allow', errorStackMode: 'allow', mathRandomMode: 'allow'});    
    return s.evaluate(this.props.selectedPluginScript.ui.call, {React, provider: this.provider, pluginApi: this.props.selectedPluginScript.pluginApi})
  }


  componentDidMount() {
  }

  render () {
    console.log("PROPS in plugin view", this.props)
    let html = ""
    if (this.props.selectedPluginScript){
      html = this.props.selectedPluginScript.ui.html
    }
    return (
	<div>
	<div> ----------------------------------------------------------------------------   Plugin view  -------------------------------------------------------------------------------  </div>
	<div> plugin uid: {this.props.selectedPluginUid}    </div>



        <div id="pluginIframe" ref="pluginIframe">


	{this.renderSandboxedUi.bind(this)()}
      </div>

	</div>	
    )    
  }
}


//	<div> Metamask generated UI    </div>	
//	<div> {this.renderPluginButtons.bind(this)()} </div>

