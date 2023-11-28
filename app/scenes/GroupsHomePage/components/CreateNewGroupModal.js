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
import CompanySelect from "../../../components/CompanySelect";

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

class CreateNewGroupModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            group_name: null,
            group_logo_url: null,
            cover_photo_url:null,
            group_about: null,
            group_website: null,
            group_industry_affiliation: null,
            group_company_affiliation: null,
            group_role_affiliation: null,
            group_school_affiliation: null,
            privacy_setting: null,
        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, open, onClose, onSubmit, options } = this.props;

        const {
            group_name,
            group_logo_url,
            cover_photo_url,
            group_about,
            group_website,
            group_industry_affiliation,
            group_company_affiliation,
            group_role_affiliation,
            group_school_affiliation,
            privacy_setting,
        } = this.state;

        console.log(this.props);


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
                    <div style={{display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", maxHeight: COMMON.STYLES.EDIT_PORTFOLIO_MODAL.DEFAULT_MODAL_MAX_HEIGHT,}}>
                        <div style={{flex: "0 0 51px", padding: "15px 25px", borderBottom: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <EditPortfolioModalHeader title={"Create Group"} onClose={onClose} />
                        </div>

                        <div style={{flex: 1, padding: "20px 25px", overflow: "scroll"}}>
                            <div className={classes.inputLabel}>Group name</div>
                            <StandardInput placeholder={"Ex: 2023 Google Associate Product Managers class of 2023"} value={group_name} update={(v) => (this.setState({group_name: v}))}/>

                            <div className={classes.inputLabel}>Company affiliation</div>
                            <CompanySelect options={options} onChange={(group_company_affiliation) => {
                                this.setState({group_company_affiliation});
                            }}/>

                            <div className={classes.inputLabel}>Group description</div>
                            <StandardInput placeholder={"Ex: This group is for all current Google APMs that started in 2023"} value={group_about} update={(v) => (this.setState({group_about: v}))}/>


                        </div>
                        <div style={{flex: "0 0 54px", textAlign: "right", padding: "13px 25px",  borderTop: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <StandardButton label={"Save"} size={"S"} onClick={() => {
                                onSubmit ? onSubmit({group_name, group_company_affiliation, group_about}) : null;
                                onClose ? onClose() : null;
                            }}/>
                        </div>
                    </div>

                </div>
            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(CreateNewGroupModal)));

