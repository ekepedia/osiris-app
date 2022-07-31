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
import {EDIT_PORTFOLIO_MODAL, EDIT_PORTFOLIO_MODALS} from "../../../common/styles";
import EditPortfolioModalHeader from "./EditPortfolioModalHeader";

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

class StandardModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {

    }

    render() {
        let { classes, open, onClose, onSubmit, updateField, user } = this.props;

        user = user || {};

        console.log("MODAL USER", user);

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
                        <EditPortfolioModalHeader title={"Edit Header"} onClose={onClose} />
                    </div>
                    <div style={{flex: 1, padding: "20px 25px"}}>
                        <div className={classes.sectionLabel}>Profile Information</div>
                        <div className={classes.inputLabel}>First Name</div>
                        <StandardInput value={user.first_name} update={(v) => (updateField("first_name", v))} />
                        <div className={classes.inputLabel}>Last Name</div>
                        <StandardInput value={user.last_name} update={(v) => (updateField("last_name", v))} />
                        <div className={classes.inputLabel}>Bio</div>
                        <StandardInput value={user.bio} update={(v) => (updateField("bio", v))} />
                        <div className={classes.inputLabel}>Instagram Link</div>
                        <StandardInput value={user.user_instagram_link} update={(v) => (updateField("user_instagram_link", v))} />
                        <div className={classes.inputLabel}>Twitter Link</div>
                        <StandardInput value={user.user_twitter_link} update={(v) => (updateField("user_twitter_link", v))} />
                        <div className={classes.inputLabel}>TikTok Link</div>
                        <StandardInput value={user.user_tiktok_link} update={(v) => (updateField("user_tiktok_link", v))} />
                        <div className={classes.inputLabel}>Personal Website Link</div>
                        <StandardInput value={user.user_website_link} update={(v) => (updateField("user_website_link", v))} />
                        <div className={classes.inputLabel}>Vimeo Link</div>
                        <StandardInput value={user.user_vimeo_link} update={(v) => (updateField("user_vimeo_link", v))} />
                        <div className={classes.inputLabel}>Email Contact</div>
                        <StandardInput value={user.user_main_contact_email} update={(v) => (updateField("user_main_contact_email", v))} />
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

export default withApollo(withRouter(injectSheet(Styles)(StandardModal)));

