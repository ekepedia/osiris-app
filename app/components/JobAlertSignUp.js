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

import {COLOR_BLACK, COLOR_BORDER_GREY, COLOR_WHITE} from "../common/colors";
import {FONT_BODY_BOLD, FONT_TITLE_2_BOLD, FONT_BODY, FONT_FOOTNOTE, FONT_SUBHEADER} from "../common/fonts";
import {STYLE_MODAL_CONTENT, STYLE_MODAL_OVERLAY, MODAL_TIMING, STYLE_BUTTON_SUBHEADER} from "../common/styles";
import COMMON from "../common";
import StandardButton from "./StandardButton";
import StandardInput from "./StandardInput";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    modalTitle: {
        ...COMMON.FONTS.H600,
        color: COMMON.COLORS.N900,
        marginBottom: "10px"
    },
    modalSubTitle: {
        ...COMMON.FONTS.P200,
        color: COMMON.COLORS.N900,
        marginBottom: "25px"
    },
    ...COMMON.STYLES.GENERAL.AlignmentStyles
};

class JobAlertSignUp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
        };
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

    componentDidMount() {

    }

    renderHeader() {
        let { onClose} = this.props;
        return (<div>
            <div style={{textAlign: "right"}} onClick={onClose}>
                <i style={{cursor: "pointer", lineHeight: "11px", fontSize: "17.5px", color: COMMON.COLORS.N600}} className="fa-solid fa-xmark"/>
            </div>
        </div>)
    }

    renderFooter() {
        const { page } = this.state || {};
        const { onSubmit, onClose, label, job } = this.props || {};

        let company = "";

        if (job && job.companies && job.companies.length) {
            company = job.companies[0].company_name
        }

        // company = company.toLowerCase();

        return (<div style={{textAlign: "right"}}>
            <div style={{...COMMON.FONTS.H300, display: "inline-block", marginRight: "10px", lineHeight: "32px", cursor: "pointer", color: COMMON.COLORS.N700,}}>
                <div onClick={() => {
                    onClose()
                }}>
                    Cancel
                </div>
            </div>
            <div style={{display: "inline-block", }}>
                <StandardButton fullWidth={false} label={company && company.length ? `Continue to ${company}` : "Continue to Jobs"} onClick={() => {
                    if (onClose) onClose();

                    if (job) window.open(job.apply_link, "_blank");
                }}/>
            </div>
        </div>)
    }

    render() {
        let { classes, open, onClose, state, job, jobs } = this.props;

        this.industries = this.constructIndustryOptions(jobs)
        this.industry_map = {};
        this.industries.forEach((industry) => {
            this.industry_map[industry.id] = industry;
        })

        let industry = "";

        if (job && job.industries && job.industries.length) {
            industry = (job.industries[0] || {}).label
        } else if (state && state["selectedIndustries"] && state["selectedIndustries"].length) {
            industry = (this.industry_map[state["selectedIndustries"][0]] || {}).name
        }

        // industry = (industry + "").toLowerCase();

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
                        height: "498px",
                    }
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
                            <div className={classes.centerAlignContainerFill}>
                                <div className={classes.verticalAlignObjectFill}>
                                    <div className={classes.modalTitle}>
                                        Get more <span style={{textTransform: "capitalize"}}>{industry}</span> opportunities directly in your inbox
                                    </div>
                                    <div className={classes.modalSubTitle}>
                                        Timing is everything! Sign up for {industry} job alerts to give yourself the best chance of getting accepted
                                    </div>
                                    <div>
                                        <StandardInput placeholder={"Email Address"}/>
                                    </div>
                                </div>
                            </div>
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

export default withApollo(withRouter(injectSheet(Styles)(JobAlertSignUp)));

