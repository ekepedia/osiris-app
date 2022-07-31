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
import {
    EDIT_PORTFOLIO_MODAL,
    EDIT_PORTFOLIO_MODALS,
    STYLE_MODAL_SUPER_CONTAINER,
    STYLE_MODAL_SUPER_SUPER_CONTAINER
} from "../../../common/styles";
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

class EditSmallLinkModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            link_name: null,
            link_url: null,
            link_image_url: null
        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, open, onClose, onSubmit, updateField, user_link  } = this.props;

        user_link = user_link || {};

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
                <div style={{...STYLE_MODAL_SUPER_SUPER_CONTAINER, height: "100%"}}>
                    <div style={COMMON.STYLES.STYLE_MODAL_SUPER_CONTAINER}>
                        <div style={{flex: "0 0 51px", padding: "15px 25px", borderBottom: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <EditPortfolioModalHeader title={"Edit Link"} onClose={onClose} />
                        </div>
                        <div style={COMMON.STYLES.STYLE_MODAL_CONTAINER}>
                            <div style={{display: "flex"}}>
                                <div className={classes.smallThumbnailContainer}>
                                    <div className={classes.inputLabel}>Thumbnail</div>
                                    <div className={classes.smallThumbnailHolder}>
                                        <ThumbnailUpload url={user_link.link_image_url} onURL={({url, file_name}) => {
                                            updateField("link_image_url", url)
                                        }}/>
                                    </div>
                                </div>
                                <div style={{flex: 1}}>
                                    <div className={classes.inputLabel}>Title</div>
                                    <StandardInput value={user_link.link_name}  update={(v) => (updateField("link_name", v))} />
                                    <div className={classes.inputLabel}>URL</div>
                                    <StandardInput value={user_link.link_url} update={(v) => (updateField("link_url", v))} />
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

                </div>
            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(EditSmallLinkModal)));

