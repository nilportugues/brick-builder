import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as _ from "lodash"

import { previewComponent } from '../../../hoc/previewComponent';
import MjSpacerModel from '../../../models/MjModels/MjSpacer'

function mapStateToProps(state, ownProps) {
    return {
        component: _.assignIn(new MjSpacerModel(), ownProps.component),
    }
}

@connect(mapStateToProps)
@previewComponent()
export class MjSpacer extends Component  {
    render() {
        const {
            extractComponentHtml,
            getHtml,
            getIndex
        } = this.props

        const _html = extractComponentHtml(getHtml().html)

        return (
            <div
                id={getIndex()}
                dangerouslySetInnerHTML={{ "__html": _html }}
            />
        )
    }
}


export default MjSpacer

