import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import { DragSource } from 'react-dnd'
import { bindActionCreators } from 'redux'
import { DND, Helpers, Templating, Settings } from '../../lib'
import OptionsPreview from '../OptionsPreview'

import TemplatingAction from '../../reducers/Templating/actions'
import MjSection from '../../models/MjModels/MjSection'
import MjContainer from '../../models/MjModels/MjContainer'
import Column from '../Column'
import EmptySection from '../../lib/dnd/components/Drop/EmptySection'
import Empty from './Empty/index'

import OptionsPreviewSection from '../../components/OptionsPreview/Container/Section'
import OptionDrag from '../../components/OptionsPreview/Drag'
import Block, { BlockAction, BlockMore } from '../../ui/Block'
import BlockButton from '../../ui/Block/BlockButton'
import DragSvg from '../../ui/svg/drag'

import styled from 'styled-components'

const SCLayoutSection = styled.div`
    position: relative;
    margin: 0 auto;
    box-sizing: border - box;
`

const SCLayoutAllSection = styled.div`
    position: relative;
    :hover {
        .options {
            display: flex;
        }
    }
`

function mapStateToProps(state, ownProps) {
    const section = _.assignIn(new MjSection(), ownProps.section)
    const container = _.assignIn(new MjContainer(), state.Templating.container)
    return {
        container: container,
        section: section,
        columns: _.chain(state.Templating.columns)
            .filter({ keySection: section.getKey() })
            .orderBy('order', 'asc')
            .value()
    }
}

const cardDrag = {
    beginDrag(props) {
        return {
            order: props.section.order
        }
    }
}

function collectDrag(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    }
}

@connect(mapStateToProps)
@DragSource(DND.Constants.MOVE_SECTION, cardDrag, collectDrag)
export class Section extends Component {
    render() {
        const {
            section,
            columns,
            container,
            connectDragPreview,
            connectDragSource
        } = this.props

        let _styleSection = section.getStylePreview()
        let _styleInSection = {
            width: Helpers.transformTypeObject(
                container.componentAttributes['width']
            ),
            margin: '0 auto'
        }

        if (!!!section.getAttributes()['full-width']) {
            _styleSection = {
                ..._styleSection,
                width: Helpers.transformTypeObject(
                    container.componentAttributes['width']
                )
            }

            _styleInSection = {
                ..._styleInSection,
                width: '100%'
            }
        }

        return (
            <Fragment>
                <DND.Components.Drop.Section section={section}>
                    {connectDragPreview(
                        <div>
                            <Block>
                                <BlockAction>
                                    {connectDragSource(
                                        <span>
                                            <BlockButton cursor="-webkit-grab">
                                                <DragSvg />
                                            </BlockButton>
                                        </span>
                                    )}
                                </BlockAction>

                                {/*// <Templating.Components.Handle.Delete
                                //     component={section}
                                // >
                                //     <OptionsPreview.Delete />
                                // </Templating.Components.Handle.Delete>
                                // <Templating.Components.Handle.Duplicate
                                //     component={section}
                                // >
                                //     <OptionsPreview.Duplicate />
                                // </Templating.Components.Handle.Duplicate>

                                // <Settings.Components.Buttons.Settings
                                //     component={section}
                                // >
                                //     <OptionsPreview.Settings />
                                // </Settings.Components.Buttons.Settings>*/}
                                <SCLayoutSection
                                    id={section.getIndex()}
                                    style={_styleSection}
                                >
                                    <div style={_styleInSection}>
                                        {_.isEmpty(columns) ||
                                        _.isUndefined(columns) ? (
                                            <EmptySection section={section}>
                                                <Empty section={section} />
                                            </EmptySection>
                                        ) : (
                                            columns.map((column, keyColumn) => {
                                                return (
                                                    <Column
                                                        key={keyColumn}
                                                        column={column}
                                                        keySection={section.getKey()}
                                                    />
                                                )
                                            })
                                        )}
                                    </div>
                                </SCLayoutSection>
                            </Block>
                        </div>
                    )}
                </DND.Components.Drop.Section>
            </Fragment>
        )
    }
}

Section.propTypes = {
    columns: PropTypes.array,
    section: PropTypes.object.isRequired
}

export default Section
