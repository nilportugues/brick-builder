import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import * as _ from 'lodash'
import ColorSelector from '../../Settings/ColorSelector'
import { withHandleSelector } from '../../../hoc/withHandleSelector'
import handleUpdate from '../handleUpdate'

const setAttribute = (component, value) => styleKey =>
    (component.attributes[styleKey] = value)

@withHandleSelector()
class HandleChangeColor extends Component {
    _handleChangeComplete = color => {
        const { getStyleKey, actions, component } = this.props

        const _styleKey = getStyleKey()

        let _newComponent = component

        if (_.isArray(_styleKey)) {
            // Like styleKey MjSocial
            _.each(_styleKey, setAttribute(_newComponent, color))
        } else {
            setAttribute(_newComponent, color)(_styleKey)
        }

        handleUpdate(_newComponent, actions)
    }

    _handleChange = color => {
        const { updateValueSelector } = this.props

        updateValueSelector(color.hex)
    }

    getChildProps = () => {
        return {
            ...this.props,
            handleChange: this._handleChange,
            handleChangeComplete: this._handleChangeComplete
        }
    }

    render() {
        const { children } = this.props

        const childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, this.getChildProps())
        )

        return <Fragment>{childrenWithProps}</Fragment>
    }
}

HandleChangeColor.propTypes = {
    component: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
}

export default HandleChangeColor
