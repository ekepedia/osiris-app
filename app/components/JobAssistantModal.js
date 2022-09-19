import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';
import Select from "react-select";

import injectSheet from 'react-jss';

import Modal from 'react-modal';

import DataService from '../services/DataService';

import {COLOR_BLACK, COLOR_BORDER_GREY, COLOR_GREEN, COLOR_GREEN_LIGHT, COLOR_WHITE} from "../common/colors";
import {FONT_BODY_BOLD, FONT_TITLE_2_BOLD, FONT_BODY, FONT_FOOTNOTE, FONT_SUBHEADER} from "../common/fonts";
import {STYLE_MODAL_CONTENT, STYLE_MODAL_OVERLAY, MODAL_TIMING, STYLE_BUTTON_SUBHEADER} from "../common/styles";

import COMMON from "../common/index";
import StandardButton from "./StandardButton";
import StandardMultiSelect from "./StandardMultiSelect";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    optionStyle: {
        ...COMMON.FONTS.P100,
        width: "100%",
        height: "32px",
        lineHeight: "32px",
        textAlign: "left",
        marginBottom: "10px",
        outline: "none",
        cursor: "pointer",
        border: `1px solid ${COMMON.COLORS.N400}`,
        color: COMMON.COLORS.N600,
        background: COMMON.COLORS.N0,
        padding: "0 12px",
        borderRadius: "4px"
    },
    optionContainer: {
        maxHeight: "200px",
        overflowY: "scroll"
    },
    modalTitle: {
        ...COMMON.FONTS.H600,
        color: COMMON.COLORS.N900,
        marginBottom: "25px"
    },
    ...COMMON.STYLES.GENERAL.AlignmentStyles
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

    findLabel(options, id) {
        if (!options || !options.length || !id)
            return null

        let label = null;

        options.map((option) => {
            if (option.id + "" === id + "")
                label = option.label
        })

        return label;
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
                className={classes.optionStyle}
                style={{
                    color: selected ? COMMON.COLORS.N800 : null,
                }}
            ><div style={{
                fontSize: "11.75px",
                border: "none",
                display: "inline-block",
                marginRight: "8px",
                color: selected ? COMMON.COLORS.N600 : COMMON.COLORS.N400
            }}>{selected ? <i className="fa-solid fa-square-check"></i> : <i class="fa-regular fa-square"></i>}</div>{option.label}</div>)
        })
    }

    renderHeader() {
        let { onClose} = this.props;
        return (<div>
            <div style={{textAlign: "right"}} onClick={onClose}>
                <i style={{cursor: "pointer", lineHeight: "11px", fontSize: "17.5px", color: COMMON.COLORS.N600}} className="fa-solid fa-xmark"/>
            </div>
        </div>)
    }

    constructIndustryOptions (jobs) {
        jobs = jobs || [];
        let dedup_map = {};
        jobs.forEach((job) => {
            if (job.industries && job.industries.length) {
                job.industries.forEach((industry) => {
                    dedup_map[industry.id] = industry
                })
            }
        });

        this.industries = Object.values(dedup_map);
        return this.industries
    }

    constructLocationOptions (jobs) {
        jobs = jobs || [];
        let dedup_map = {};
        jobs.forEach((job) => {
            if (job.locations && job.locations.length) {
                job.locations.forEach((location) => {
                    dedup_map[location.location_id] = location
                })
            }
        });

        this.locations = Object.values(dedup_map);
        return this.locations
    }

    renderFooter() {
        const { page } = this.state || {};
        const { onSubmit, onClose } = this.props || {};

        return (<div style={{textAlign: "right"}}>
            <div style={{...COMMON.FONTS.H300, display: "inline-block", marginRight: "10px", lineHeight: "32px", cursor: "pointer", color: COMMON.COLORS.N700,}}>
                <div onClick={() => {
                    page <= 1 ? onClose() : this.setState({page: page - 1});
                }}>
                    {page === 1 ? "Cancel" : "Back"}
                </div>
            </div>
            <div style={{display: "inline-block", }}>
                <StandardButton fullWidth={false} label={page === 3 ? "See Jobs" : "Next"} onClick={() => {
                    page === 3 ? onSubmit() : this.setState({page: page + 1} )
                }}/>
            </div>
        </div>)
    }

    render() {
        let { classes, open, onClose, onSubmit, job, jobs, state, addToField, removeFromField, overrideField} = this.props;

        const selectedIndustries = state["selectedIndustries"];
        const selectedIndustriesOptions = (selectedIndustries || []).map((id) => ({value: id, label: this.findLabel(this.industries, id)}));

        const selectedLocations = state["selectedLocations"];
        const selectedLocationsOptions = (selectedLocations  || []).map((id) => ({value: id, label: this.findLabel(this.locations, id)}));

        this.industries = this.constructIndustryOptions(jobs);
        this.locations = this.constructLocationOptions(jobs);

        return (<div className={classes.container}>
            <Modal
                isOpen={open}
                closeTimeoutMS={MODAL_TIMING}
                style={{
                    overlay: {
                        ...STYLE_MODAL_OVERLAY
                    },
                    content: {
                        ...COMMON.STYLES.STANDARD_MODAL_CONTAINER,
                        height: "498px"
                    },
                }}
            >
                <div>
                    <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
                        <div style={{flex: "0 0 16px"}}>
                            <div>
                                {this.renderHeader()}
                            </div>
                        </div>
                        <div style={{flex: 1}}>
                            {this.state.page === 1 && <div className={classes.centerAlignContainerFill}>
                                <div className={classes.verticalAlignObjectFill}>
                                    <div className={classes.modalTitle}>
                                        What type of job are you looking for?
                                    </div>
                                    <div className={classes.optionContainer}>
                                        {this.renderOptions(this.roles, "selectedRoles")}
                                    </div>
                                </div>
                            </div>}

                            {this.state.page === 2 && <div className={classes.centerAlignContainerFill}>
                                <div className={classes.verticalAlignObjectFill}>
                                    <div className={classes.modalTitle}>
                                        What industries are you interested in?
                                    </div>

                                    <div>
                                        <StandardMultiSelect
                                            value={selectedIndustriesOptions}
                                            options={(this.industries || []).map((option) => ({
                                                value: option.id,
                                                label: option.label
                                            }))}
                                            onChange={(ids) => {
                                                overrideField("selectedIndustries", ids)
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>}

                            {this.state.page === 3 && <div className={classes.centerAlignContainerFill}>
                                <div className={classes.verticalAlignObjectFill}>
                                    <div className={classes.modalTitle}>
                                        What locations are you interested in?
                                    </div>
                                    <div>
                                        <StandardMultiSelect
                                            value={selectedLocationsOptions}
                                            options={(this.locations || []).map((option) => ({
                                                value: option.id,
                                                label: option.label
                                            }))}
                                            onChange={(ids) => {
                                                overrideField("selectedLocations", ids)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>}
                        </div>
                        <div style={{flex: "0 0 32px"}}>
                            <div>
                                {this.renderFooter()}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(JobAssistantModal)));

