import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import Modal from 'react-modal';

import DataService from '../../../services/DataService';

import COMMON from "../../../common/index";
import {convertDateObjectToMonthYear, converMonthYearToDateObject} from "../../../common/helpers";
import StandardButton from "../../../components/StandardButton";
import StandardInput from "../../../components/StandardInput";
import {EDIT_PORTFOLIO_MODAL, EDIT_PORTFOLIO_MODALS} from "../../../common/styles";
import EditPortfolioModalHeader from "./EditPortfolioModalHeader";
import StandardSelect from "../../../components/StandardSelect";
import axios from "axios";
import CoverImageHolder from "../../../components/CoverImageHolder";
import ThumbnailUpload from "../../../components/ThumbnailUpload";

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

class AddUserEducationModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            company_name: null,
            company_logo_url: null,
            role_name: null,
            is_current: null,
            start_date: null,
            end_date: null,
            start_month: 1,
            start_year: 2022,
            end_month: 1,
            end_year: 2022
        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, open, onClose, onSubmit } = this.props;

        const {
            school_name,
            degree_name,
            school_logo_url,
            start_date,
            end_date,
            start_month,
            start_year,
            end_month,
            end_year
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
                        maxHeight: COMMON.STYLES.EDIT_PORTFOLIO_MODAL.DEFAULT_MODAL_HEIGHT,
                        height: "fit-content"
                    }
                }}
            >
                <div style={{height: "100%", overflow: "hidden"}}>
                    <div style={{display: "flex", flexDirection: "column", height: "100%", overflow: "hidden"}}>
                        <div style={{flex: "0 0 51px", padding: "15px 25px", borderBottom: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <EditPortfolioModalHeader title={"Add Education"} onClose={onClose} />
                        </div>
                        <div style={{flex: 1, padding: "20px 25px"}}>

                            <div style={{display: "flex"}}>
                                <div className={classes.smallThumbnailContainer}>
                                    <div className={classes.inputLabel}>School Logo</div>
                                    <div className={classes.smallThumbnailHolder}>
                                        <ThumbnailUpload url={this.state.school_logo_url} onURL={({url, file_name}) => {
                                            this.setState({
                                                school_logo_url: url,
                                            })
                                        }}/>
                                    </div>
                                </div>
                                <div style={{flex: 1}}>
                                    <div className={classes.inputLabel}>School Name</div>
                                    <StandardInput value={school_name} update={(v) => (this.setState({school_name: v}))} />
                                    <div className={classes.inputLabel}>Degree Name</div>
                                    <StandardInput value={degree_name} update={(v) => (this.setState({degree_name: v}))} />

                                </div>
                            </div>


                            <div style={{display: "flex"}}>
                                <div style={{flex: 1, paddingRight: "15px"}}>
                                    <div className={classes.inputLabel}>Start date</div>
                                    <StandardSelect value={start_month} options={COMMON.CONSTS.MONTHS} update={(v) => (this.setState({start_month: v}))}/>
                                </div>
                                <div style={{flex: 1}}>
                                    <div className={classes.inputLabel}><span style={{opacity: 0}}>-</span></div>
                                    <StandardSelect value={start_year} options={COMMON.CONSTS.YEARS} update={(v) => (this.setState({start_year: v}))}/>
                                </div>
                            </div>
                            <div style={{display: "flex"}}>
                                <div style={{flex: 1, paddingRight: "15px"}}>
                                    <div className={classes.inputLabel}>End date (or expected)</div>
                                    <StandardSelect value={end_month} options={COMMON.CONSTS.MONTHS} update={(v) => (this.setState({end_month: v}))}/>
                                </div>
                                <div style={{flex: 1}}>
                                    <div className={classes.inputLabel}><span style={{opacity: 0}}>-</span></div>
                                    <StandardSelect value={end_year} options={COMMON.CONSTS.YEARS} update={(v) => (this.setState({end_year: v}))}/>
                                </div>
                            </div>
                        </div>
                        <div style={{flex: "0 0 54px", textAlign: "right", padding: "13px 25px",  borderTop: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <StandardButton label={"Save"} size={"S"} onClick={() => {
                                onSubmit ? onSubmit({
                                    school_name,
                                    school_logo_url,
                                    degree_name,
                                    start_date,
                                    end_date,
                                    start_month,
                                    start_year,
                                    end_month,
                                    end_year
                                }) : null;
                                onClose ? onClose() : null;
                            }}/>
                        </div>
                    </div>

                </div>
            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(AddUserEducationModal)));

