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
import StandardCheckbox from "../../../components/StandardCheckbox";

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

class EditExperienceModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        let d = new Date("5/1/2020");
        let MY = convertDateObjectToMonthYear({date: d})
        let D = converMonthYearToDateObject({month: "04", year: "2021"});
        console.log(d, MY, D)
    }

    setDateObjects(user_experience) {

        let start_month = 1;
        let start_year = 2020;

        if (user_experience.start_date) {
            const date = new Date(parseFloat(user_experience.start_date));
            const MY = convertDateObjectToMonthYear({date});
            start_month = MY.month;
            start_year = MY.year;
        }

        user_experience.start_month = user_experience.start_month || start_month;
        user_experience.start_year = user_experience.start_year || start_year;

        let end_month = 1;
        let end_year = 2020;

        if (user_experience.end_date) {
            const date = new Date(parseFloat(user_experience.end_date));
            const MY = convertDateObjectToMonthYear({date});
            end_month = MY.month;
            end_year = MY.year;
        }

        user_experience.end_month = user_experience.end_month || end_month;
        user_experience.end_year = user_experience.end_year || end_year;

        return user_experience;
    }

    render() {
        let { classes, open, onClose, onSubmit, updateField, user_experience } = this.props;

        user_experience = user_experience || {};
        user_experience = this.setDateObjects(user_experience);

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
                        height: user_experience.is_current ? "390px" : "455px"
                    }
                }}
            >
                <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
                    <div style={{flex: "0 0 51px", padding: "15px 25px", borderBottom: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                        <EditPortfolioModalHeader title={"Edit Experience"} onClose={onClose} />
                    </div>
                    <div style={{flex: 1, padding: "20px 25px", overflow: "scroll"}}>



                        <div style={{display: "flex"}}>
                            <div className={classes.smallThumbnailContainer}>
                                <div className={classes.inputLabel}>Company Logo</div>
                                <div className={classes.smallThumbnailHolder}>
                                    <ThumbnailUpload url={user_experience.company_logo_url} onURL={({url, file_name}) => {
                                        updateField("company_logo_url", url)
                                    }}/>
                                </div>
                            </div>
                            <div style={{flex: 1}}>
                                <div className={classes.inputLabel}>Company Name</div>
                                <StandardInput value={user_experience.company_name} update={(v) => (updateField("company_name", v))} />
                                <div className={classes.inputLabel}>Role Name</div>
                                <StandardInput value={user_experience.role_name} update={(v) => (updateField("role_name", v))} />
                            </div>
                        </div>

                        <div>
                            <StandardCheckbox label={"I am currently working in this role"} value={user_experience.is_current} update={(v) => (updateField("is_current", v))}/>
                        </div>

                        <div style={{display: "flex"}}>
                            <div style={{flex: 1, paddingRight: "15px"}}>
                                <div className={classes.inputLabel}>Start date*</div>
                                <StandardSelect value={user_experience.start_month} options={COMMON.CONSTS.MONTHS} update={(v) => (updateField("start_month", v))}/>
                            </div>
                            <div style={{flex: 1}}>
                                <div className={classes.inputLabel}><span style={{opacity: 0}}>-</span></div>
                                <StandardSelect value={user_experience.start_year} options={COMMON.CONSTS.YEARS} update={(v) => (updateField("start_year", v))}/>
                            </div>
                        </div>
                        <div style={{display: user_experience.is_current ? "none" : "flex"}}>
                            <div style={{flex: 1, paddingRight: "15px"}}>
                                <div className={classes.inputLabel}>End date*</div>
                                <StandardSelect value={user_experience.end_month} options={COMMON.CONSTS.MONTHS} update={(v) => (updateField("end_month", v))}/>
                            </div>
                            <div style={{flex: 1}}>
                                <div className={classes.inputLabel}><span style={{opacity: 0}}>-</span></div>
                                <StandardSelect value={user_experience.end_year} options={COMMON.CONSTS.YEARS} update={(v) => (updateField("end_year", v))}/>
                            </div>
                        </div>

                    </div>
                    <div style={{flex: "0 0 54px", textAlign: "right", padding: "13px 25px",  borderTop: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                        <StandardButton label={"Save"} size={"S"} onClick={() => {
                            onSubmit ? onSubmit() : null;
                            onClose ? onClose() : null;
                        }}/>
                    </div>
                </div>
            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(EditExperienceModal)));
