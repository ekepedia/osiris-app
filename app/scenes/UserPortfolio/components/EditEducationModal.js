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
    }
};

class EditEducationModal extends React.Component {

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

    setDateObjects(user_education) {

        let month = 1;
        let year = 2020;

        if (user_education.start_date) {
            const date = new Date(parseFloat(user_education.start_date));
            const MY = convertDateObjectToMonthYear({date});
            month = MY.month;
            year = MY.year;
        }

        user_education.start_month = user_education.start_month || month;
        user_education.start_year = user_education.start_year ||  year;

        return user_education;
    }

    render() {
        let { classes, open, onClose, onSubmit, updateField, user_education } = this.props;

        user_education = user_education || {};
        user_education = this.setDateObjects(user_education);

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
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{flex: "0 0 51px", padding: "15px 25px", borderBottom: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                        <EditPortfolioModalHeader title={"Edit Education"} onClose={onClose} />
                    </div>
                    <div style={{flex: 1, padding: "20px 25px"}}>
                        <div className={classes.inputLabel}>School</div>
                        <StandardInput value={user_education.school_name} update={(v) => (updateField("school_name", v))} />
                        <div className={classes.inputLabel}>Degree</div>
                        <StandardInput value={user_education.degree_name} update={(v) => (updateField("degree_name", v))} />


                        <div style={{display: "flex"}}>
                            <div style={{flex: 1, paddingRight: "15px"}}>
                                <div className={classes.inputLabel}>Month</div>
                                <StandardSelect value={user_education.start_month} options={COMMON.CONSTS.MONTHS} update={(v) => (updateField("start_month", v))}/>
                            </div>
                            <div style={{flex: 1}}>
                                <div className={classes.inputLabel}>Year</div>
                                <StandardSelect value={user_education.start_year} options={COMMON.CONSTS.YEARS} update={(v) => (updateField("start_year", v))}/>
                            </div>
                        </div>


                        <select value={user_education.start_year} onChange={(e) => (updateField("start_year", e.target.value))}>
                            <option>2020</option>
                            <option>2021</option>
                            <option>2022</option>
                        </select>
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

export default withApollo(withRouter(injectSheet(Styles)(EditEducationModal)));

