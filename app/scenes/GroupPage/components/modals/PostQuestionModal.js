import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import Modal from 'react-modal';

import DataService from '../../../../services/DataService';

import COMMON from "../../../../common/index";
import StandardButton from "../../../../components/StandardButton";
import StandardInput from "../../../../components/StandardInput";
import EditPortfolioModalHeader from "../../../UserPortfolio/components/EditPortfolioModalHeader";
import StandardSelect from "../../../../components/StandardSelect";
import GroupPostService from "../../../../services/GroupPostService";
import axios from "axios";
import Select from "react-select/creatable";
import {companyCustomSearch, mc} from "../../../../common/helpers";
import CompanySelect from "../../../../components/CompanySelect";
import CoverImageHolder from "../../../../components/CoverImageHolder";
import TrackingService from "../../../../services/TrackingService";
import AuthService from "../../../../services/AuthService";
import EventService from "../../../../services/EventService";
import PostCategoryDropdown from "../../../../components/PostCategoryDropdown";

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
    groupLHSProfileContainer: {
        marginRight: "15px",
        height: "30px",
        width: "30px",
        borderRadius: "100%",
        border: `2px solid ${COMMON.COLORS.N900}`,
        overflow: "hidden",
        cursor: "pointer",
        alignItems: "center"
    },
    ...COMMON.STYLES.PORTFOLIO.PortfolioPageStyles,
    ...COMMON.STYLES.PORTFOLIO.EditToggleDeleteStyles
};

class PostQuestionModal extends React.Component {

    constructor(props) {
        super(props);

        let user = {};
        let userstring = localStorage.user;

        if (userstring && userstring !== "undefined") {
            user = JSON.parse(userstring)
        }

        this.state = {
            user,
            job_title: null,
            apply_link: null,
            status_id: 2,
            company_id: null,
            multipleChoiceQuestion: false,
        };
    }

    componentDidMount() {
        this.loadUser();
        EventService.on(EventService.events.UPDATE_USER, () => {
            this.loadUser();
        })
    }

    toggleMultipleChoice(){
        if(!this.state.multipleChoiceQuestion){
            this.setState({
                multipleChoiceQuestion: true
            })
        } else {
            this.setState({
                multipleChoiceQuestion: false
            })
        }
        console.log("this.state", this.state);
    }

    loadUser() {
        let {  client, } = this.props;

        AuthService.getCurrentUser().then((user) => {
            this.setState({
                user: user || {}
            })
        })
    }

    render() {
        let { classes, open, onClose, onSubmit, options } = this.props;

        let {user,} = this.state;
        const {
            job_title,
            apply_link,
            status_id,
            company_id,
        } = this.state;

        user = user || {};

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
                        <div style={{display:"flex", padding: "15px 25px", justifyContent: "space-between", alignItems: "center", alignSelf:"stretch", borderBottom: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <div style={COMMON.STYLES.EDIT_PORTFOLIO_MODAL.MODAL_HEADER}>
                            <div style={{display: "flex"}}>
                                <div style={{flex: 1}}>
                                    Add Question
                                </div>
                            </div>
                        </div>
                            <div style={{display:"flex", justifyContent: "space-between", alignItems: "center", gap: "10px"}}>
                                Toggle multiple choice
                                <div className={mc(classes.editToggleDeleteToggle)} onClick={() => (this.toggleMultipleChoice())}>
                                    <i className={`fa-solid fa-toggle-${this.state.multipleChoiceQuestion ? "off" : "on"}`}/>
                                </div>
                                <div style={{flex: "0 0 8px", marginLeft: "10px"}} onClick={onClose}>
                                    <i style={{cursor: "pointer",  fontSize: "18px", lineHeight: "22.85px"}} className="fa-solid fa-xmark"/>
                                </div>
                            </div>
                        </div>

                        <div style={{flex: 1, padding: "20px 25px", overflow: "scroll"}}>
                            <div>
                                <div style={{flex: user && user.user_id ? "0 0 30px" : 0}}>
                                    {user && user.user_id ?
                                        <div title="Profile" id="profile-link" className={classes.groupLHSProfileContainer}>
                                            <div style={{border: `1px solid ${COMMON.COLORS.N0}`, borderRadius: "100%", height: "100%", width: "100%", overflow: "hidden", alignItems: "center"}}>
                                                <CoverImageHolder url={user.profile_photo_url || "/img/generic-user.jpeg"}/>
                                            </div>
                                        </div> : <div title="Profile" id="profile-link" className={classes.groupLHSProfileContainer}>
                                        <div style={{border: `1px solid ${COMMON.COLORS.N0}`, borderRadius: "100%", height: "100%", width: "100%", overflow: "hidden", alignItems: "center"}}>
                                            <CoverImageHolder url={"/img/generic-user.jpeg"}/>
                                        </div>
                                    </div>}
                                </div>
                                <PostCategoryDropdown/>

                            </div>
                            <div className={classes.inputLabel}>Company</div>

                            <CompanySelect options={options} onChange={(company_id) => {
                                this.setState({company_id});
                            }}/>

                            <div className={classes.inputLabel}>Job title</div>
                            <StandardInput placeholder={"Ex: Engineers without borders"} value={job_title} update={(v) => (this.setState({job_title: v}))}/>
                            <div className={classes.inputLabel}>Post URL</div>
                            <StandardInput placeholder={"+ add URL"} value={apply_link} update={(v) => (this.setState({apply_link: v}))}/>
                            <div className={classes.inputLabel}>Status</div>
                            <StandardSelect value={status_id} disableCustom={true} options={COMMON.CONSTS.STATUSES} update={(v) => {this.setState({status_id: v})}}/>



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

export default withApollo(withRouter(injectSheet(Styles)(PostQuestionModal)));

