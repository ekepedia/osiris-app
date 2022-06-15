import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import Modal from 'react-modal';

import DataService from '../services/DataService';

import COMMON from "../common/index";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
};

class ModalTemplate extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {

    }

    renderHeader(title) {
        let { onClose} = this.props;

        return (<div style={{...COMMON.FONTS.FONT_TITLE_2_BOLD}}>
            <div style={{display: "flex"}}>
                <div style={{flex: 1}}>
                    {title}
                </div>
                <div style={{flex: "0 0 15px", marginLeft: "10px"}} onClick={onClose}>
                    <i style={{cursor: "pointer", lineHeight: "33px", fontSize: "13px"}} className="fa-solid fa-x"/>
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
                        height: COMMON.CONSTS.MODAL_HEIGHT
                    }
                }}
            >
                <div>
                    <div>{this.renderHeader("Modal Title")}</div>
                </div>
            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(ModalTemplate)));

