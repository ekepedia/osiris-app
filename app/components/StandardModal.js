import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import Modal from 'react-modal';

import DataService from '../services/DataService';

import COMMON from "../common/index";
import StandardButton from "./StandardButton";
import StandardInput from "./StandardInput";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    sectionLabel: {
        color: COMMON.COLORS.COLOR_TEXT_GREY,
        marginBottom: "15px",
        ...COMMON.FONTS.FONT_HEADLINE_BOLD
    },
    inputLabel: {
        color: COMMON.COLORS.COLOR_TEXT_GREY,
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

    renderHeader(title) {
        let { onClose } = this.props;

        return (<div style={{...COMMON.FONTS.FONT_HEADLINE_BOLD}}>
            <div style={{display: "flex"}}>
                <div style={{flex: 1}}>
                    {title}
                </div>
                <div style={{flex: "0 0 15px", marginLeft: "10px"}} onClick={onClose}>
                    <i style={{cursor: "pointer",  fontSize: "11px", lineHeight: "22.85px"}} className="fa-solid fa-x"/>
                </div>
            </div>
        </div>)
    }

    render() {
        let { classes, open } = this.props;

        return (<div className={classes.container}>
            <Modal
                isOpen={open}
                closeTimeoutMS={COMMON.CONSTS.MODAL_TIMING}
                style={{
                    overlay: {
                        ...COMMON.STYLES.STYLE_MODAL_OVERLAY
                    },
                    content: {
                        ...COMMON.STYLES.STYLE_MODAL_CONTENT,
                        maxHeight: COMMON.CONSTS.MODAL_HEIGHT,
                        height: "fit-content"
                    }
                }}
            >
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{flex: "0 0 51px", padding: "15px 25px", borderBottom: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                        <div>{this.renderHeader("Modal Title")}</div>
                    </div>
                    <div style={{flex: 1, padding: "20px 25px"}}>
                        <div className={classes.sectionLabel}>Profile Information</div>
                        <div className={classes.inputLabel}>First Name</div>
                        <StandardInput value={"First Name"}/>
                    </div>
                    <div style={{flex: "0 0 54px", textAlign: "right", padding: "13px 25px",  borderTop: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                        <StandardButton label={"Save"} size={"S"}/>
                    </div>
                </div>
            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(StandardModal)));

