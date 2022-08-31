import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import Modal from 'react-modal';

import DataService from '../../../services/DataService';

import COMMON from "../../../common/index";
import StandardButton from "../../../components/StandardButton";
import StandardInput from "../../../components/StandardInput";
import EditPortfolioModalHeader from "../../UserPortfolio/components/EditPortfolioModalHeader";
import StandardSelect from "../../../components/StandardSelect";
import axios from "axios";
import Select from "react-select/creatable";
import {companyCustomSearch} from "../../../common/helpers";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    sectionLabel: {
        color: COMMON.COLORS.DARK_GREY,
        marginBottom: "5px",
        ...COMMON.FONTS.FONT_HEADLINE_BOLD
    },
    inputLabel: {
        color: COMMON.COLORS.DARK_GREY,
        marginTop: "10px",
        marginBottom: "6px",
        ...COMMON.FONTS.FONT_FOOTNOTE
    },
    ...COMMON.STYLES.PORTFOLIO.PortfolioPageStyles
};

class AddSavedJobModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            job_title: null,
            apply_link: null,
            status_id: 2,
            company_id: null,
        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, open, onClose, onSubmit, options } = this.props;

        const {
            job_title,
            apply_link,
            status_id,
            company_id,
        } = this.state;


        return (<div className={classes.container}>
            <Modal
                isOpen={open}
                closeTimeoutMS={COMMON.STYLES.MODAL_TIMING}
                style={{
                    overlay: {
                        ...COMMON.STYLES.STYLE_MODAL_OVERLAY
                    },
                    content: {
                        ...COMMON.STYLES.EDIT_PORTFOLIO_MODAL.MODAL_CONTAINER,
                        maxHeight: COMMON.STYLES.EDIT_PORTFOLIO_MODAL.DEFAULT_MODAL_MAX_HEIGHT,
                        height: "fit-content"
                    }
                }}
            >
                <div style={{height: "100%", overflow: "hidden"}}>
                    <div style={{display: "flex", flexDirection: "column", height: "100%", overflow: "hidden"}}>
                        <div style={{flex: "0 0 51px", padding: "15px 25px", borderBottom: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <EditPortfolioModalHeader title={"Add Job"} onClose={onClose} />
                        </div>
                        <div style={{flex: 1, padding: "20px 25px"}}>
                            <div className={classes.inputLabel}>Company</div>
                            <Select
                                height="31px"
                                isClearable={true}
                                placeholder="Choose a company ..."
                                options={options}
                                filterOption={companyCustomSearch}
                                styles={{indicatorSeparator: () => ({display: "none"})}}
                                onChange={(e) => {
                                    console.log("ON CHANGE", e)
                                    if (e && e.value) {
                                        this.setState({
                                            company_id: e.value
                                        })
                                    }
                                }}
                            />


                            <div className={classes.inputLabel}>Job title</div>
                            <StandardInput placeholder={"Ex: Engineer"} value={job_title} update={(v) => (this.setState({job_title: v}))}/>
                            <div className={classes.inputLabel}>Post URL</div>
                            <StandardInput placeholder={"+ add URL"} value={apply_link} update={(v) => (this.setState({apply_link: v}))}/>
                            <div className={classes.inputLabel}>Status</div>
                            <StandardSelect value={status_id} options={COMMON.CONSTS.STATUSES} update={(v) => {this.setState({status_id: v})}}/>



                        </div>
                        <div style={{flex: "0 0 54px", textAlign: "right", padding: "13px 25px",  borderTop: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <StandardButton label={"Save"} size={"S"} onClick={() => {
                                onSubmit ? onSubmit({job_title, apply_link, status_id, company_id}) : null;
                                onClose ? onClose() : null;
                            }}/>
                        </div>
                    </div>

                </div>
            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(AddSavedJobModal)));

