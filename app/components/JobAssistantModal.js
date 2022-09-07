import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import Modal from 'react-modal';

import DataService from '../services/DataService';

import {COLOR_BLACK, COLOR_BORDER_GREY, COLOR_GREEN, COLOR_GREEN_LIGHT, COLOR_WHITE} from "../common/colors";
import {FONT_BODY_BOLD, FONT_TITLE_2_BOLD, FONT_BODY, FONT_FOOTNOTE, FONT_SUBHEADER} from "../common/fonts";
import {STYLE_MODAL_CONTENT, STYLE_MODAL_OVERLAY, MODAL_TIMING, STYLE_BUTTON_SUBHEADER} from "../common/styles";

import COMMON from "../common/index";
import StandardButton from "./StandardButton";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    nextButton: {
        ...STYLE_BUTTON_SUBHEADER,
        width: "100%",
        height: "40px",
        lineHeight: "40px",
        textAlign: "center",
        marginTop: "15px",
        padding: "0",
        opacity: 1,
        transition: `opacity 250ms ease-in-out`
    },
    backButtom: {
        ...STYLE_BUTTON_SUBHEADER,
        width: "100%",
        height: "40px",
        lineHeight: "40px",
        textAlign: "center",
        marginTop: "15px",
        padding: "0",
        opacity: 1,
        transition: `opacity 250ms ease-in-out`,
        border: `1px solid ${COLOR_GREEN}`,
        color: COLOR_GREEN,
        background: "none"
    },
    inputStyle: {...STYLE_BUTTON_SUBHEADER,
        width: "100%",
        height: "40px",
        lineHeight: "40px",
        textAlign: "center",
        marginTop: "15px",
        outline: "none",
        cursor: "pointer",
        border: `1px solid ${COLOR_BORDER_GREY}`,
        color: COLOR_BLACK,
        background: COLOR_WHITE,
        padding: "0 10px",
    },
    optionContainer: {
        height: "200px",
        overflowY: "scroll"
    }
};

class JobAssistantModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 1
        };

        this.roles = [];
        DataService.getRoles().then(({roles}) => {
            this.roles = roles;
            this.setState({ roles});
        })

        this.industries = [];
        DataService.getIndustries().then(({industries}) => {
            this.industries = industries;
            this.setState({ industries});
        })

        this.locations = [];
        DataService.getLocations().then(({locations}) => {
            this.locations = locations;
            this.setState({ locations});
        })
    }

    componentDidMount() {

    }

    renderOptions(options, field) {

        let { classes, open, onClose, job, state, addToField, removeFromField} = this.props;

        return options.map((option) => {

            const selectedOptions = state[field];
            const selected = selectedOptions && selectedOptions.indexOf(option.id) !== -1;

            return (<div
                key={option.id}
                onClick={(e) => {
                    selected ? removeFromField(field, option.id) : addToField(field, option.id)
                }}
                className={classes.inputStyle}
                style={{
                    background: selected ? COLOR_GREEN_LIGHT : null,
                    border: selected ? `1px solid ${COLOR_GREEN}` : null,
                }}
            >{option.label} {selected ? <i class="fa-solid fa-check"></i> : null}</div>)
        })
    }

    renderHeader(title) {
        let { onClose} = this.props;

        return (<div style={{...COMMON.FONTS.H600}}>
            <div style={{display: "flex"}}>
                <div style={{flex: 1}}>
                    {title}
                </div>
                <div style={{flex: "0 0 15px", marginLeft: "10px"}} onClick={onClose}>
                    <i style={{cursor: "pointer", lineHeight: "33px", fontSize: "13px"}} className="fa-solid fa-x"/>
                </div>
            </div>
        </div>)
    }

    render() {
        let { classes, open, onClose, onSubmit, job, state, addToField, removeFromField} = this.props;

        return (<div className={classes.container}>
            <Modal
                isOpen={open}
                closeTimeoutMS={MODAL_TIMING}
                style={{
                    overlay: {
                        ...STYLE_MODAL_OVERLAY
                    },
                    content: {
                        ...STYLE_MODAL_CONTENT,
                        height: "350px"
                    }
                }}
            >
                <div>

                    {this.state.page === 1 && <div>
                        <div>
                            {this.renderHeader("What type of job are you looking for?")}
                        </div>
                        <div className={classes.optionContainer}>
                            {this.renderOptions(this.roles, "selectedRoles")}
                        </div>
                        <div style={{display: "flex"}}>
                            <div style={{flex: 1}}>
                                <StandardButton fullWidth={true} label={"Continue"} onClick={() => {this.setState({page: 2})}}/>
                            </div>
                        </div>

                    </div>}

                    {this.state.page === 2 && <div>
                        <div>
                            {this.renderHeader("What industries are you most interested in?")}
                        </div>
                        <div className={classes.optionContainer}>
                            {this.renderOptions(this.industries, "selectedIndustries")}
                        </div>
                        <div style={{display: "flex"}}>
                            <div style={{flex: 1, paddingRight: "10px"}}>
                                <StandardButton secondary={true} fullWidth={true} label={"Back"} onClick={() => {this.setState({page: 1})}}/>
                            </div>
                            <div style={{flex: 1}}>
                                <StandardButton fullWidth={true} label={"Continue"} onClick={() => {this.setState({page: 3})}}/>
                            </div>
                        </div>

                    </div>}

                    {this.state.page === 3 && <div>
                        <div>
                            {this.renderHeader("What locations are you most interested in?")}
                        </div>
                        <div className={classes.optionContainer}>
                            {this.renderOptions(this.locations, "selectedLocations")}
                        </div>
                        <div style={{display: "flex"}}>
                            <div style={{flex: 1, paddingRight: "10px"}}>
                                <StandardButton secondary={true} fullWidth={true} label={"Back"} onClick={() => {this.setState({page: 2})}}/>
                            </div>
                            <div style={{flex: 1}}>
                                <StandardButton fullWidth={true} label={"See Jobs"} onClick={() => {onSubmit();}}/>
                            </div>


                        </div>

                    </div>}



                </div>
            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(JobAssistantModal)));

