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

import {COLOR_BLACK, COLOR_BORDER_GREY, COLOR_GREEN, COLOR_WHITE} from "../common/colors";
import {FONT_BODY_BOLD, FONT_TITLE_2_BOLD, FONT_BODY, FONT_FOOTNOTE, FONT_SUBHEADER} from "../common/fonts";
import {STYLE_MODAL_CONTENT, STYLE_MODAL_OVERLAY, MODAL_TIMING, STYLE_BUTTON_SUBHEADER} from "../common/styles";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
};

class JobAlertSignUp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: ""
        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, open, onClose, job } = this.props;

        let industry = "";
        let company = "";

        if (job && job.industries && job.industries.length) {
            industry = job.industries[0].label
        }

        industry = industry.toLowerCase();

        if (job && job.companies && job.companies.length) {
            company = job.companies[0].company_name
        }

        company = company.toLowerCase();

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
                        height: "330px"
                    }
                }}
            >
                <div>

                    <div style={{...FONT_TITLE_2_BOLD}}>
                        <div style={{display: "flex"}}>
                            <div style={{flex: 1}}>
                                Get the more <span style={{color: COLOR_GREEN}}>{industry}</span> opportunities directly in your inbox
                            </div>
                            <div style={{flex: "0 0 15px", marginLeft: "10px"}} onClick={onClose}>
                                <i style={{cursor: "pointer", lineHeight: "33px", fontSize: "13px"}} className="fa-solid fa-x"></i>
                            </div>
                        </div>
                    </div>
                    <div style={{...FONT_SUBHEADER, marginTop: "15px"}}>
                        Timing is everything! Sign up for {industry} job alerts to give yourself the best chance to be the first application employers see
                    </div>
                    <div>
                        <input

                            value={this.state.email}
                            onChange={(e) => {
                                this.setState({
                                    email: e.target.value
                                });
                            }}
                            placeholder={"Email Address"}
                            style={{...STYLE_BUTTON_SUBHEADER,
                                width: "100%",
                                height: "40px",
                                lineHeight: "40px",
                                textAlign: "center",
                                marginTop: "15px",
                                outline: "none",
                                cursor: "default",
                                border: `1px solid ${COLOR_BORDER_GREY}`,
                                color: COLOR_BLACK,
                                background: COLOR_WHITE,
                                padding: "0 10px"
                            }}
                        />
                    </div>
                    <div style={{...STYLE_BUTTON_SUBHEADER,
                        width: "100%",
                        height: "40px",
                        lineHeight: "40px",
                        textAlign: "center",
                        marginTop: "15px",
                        padding: "0",
                        opacity: 1,
                        transition: `opacity 250ms ease-in-out`
                    }} onClick={() => {

                        if (onClose) onClose();

                        window.open(job.apply_link, "_blank");

                    }
                    }>
                        Continue to <span style={{textTransform: "capitalize"}}>{company}</span>
                    </div>

                </div>
            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(JobAlertSignUp)));

