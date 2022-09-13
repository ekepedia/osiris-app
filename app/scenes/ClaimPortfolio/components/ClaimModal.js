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

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    inputLabel: {
        color: COMMON.COLORS.N700,
        marginBottom: "8",
        marginTop: "10px",
        ...COMMON.FONTS.P100
    },
    modalTitle: {
        ...COMMON.FONTS.H600,
        color: COMMON.COLORS.N900,
        marginBottom: "25px"
    },
    ...COMMON.STYLES.GENERAL.AlignmentStyles
};

class StandardModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {

    }

    renderHeader() {
        let { onClose} = this.props;
        return (<div>
            <div style={{textAlign: "right"}} onClick={onClose}>
                <i style={{cursor: "pointer", lineHeight: "11px", fontSize: "17.5px", color: COMMON.COLORS.N600}} className="fa-solid fa-xmark"/>
            </div>
        </div>)
    }

    render() {
        let { classes, open, onUpdate, username, password, email_address, confirm_password, onSubmit } = this.props;

        return (<div className={classes.container}>
            <Modal
                isOpen={open}
                closeTimeoutMS={COMMON.CONSTS.MODAL_TIMING}
                style={{
                    overlay: {
                        ...COMMON.STYLES.STYLE_MODAL_OVERLAY
                    },
                    content: {
                        ...COMMON.STYLES.STANDARD_MODAL_CONTAINER,
                        width: "480px",
                        height: "498px"
                    }
                }}
            >
                <div>
                    <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
                        <div style={{flex: "0 0 16px",}}>
                            <div>{this.renderHeader()}</div>
                        </div>
                        <div style={{flex: 1, padding: "0px 25px"}}>

                            <div className={classes.centerAlignContainerFill}>
                                <div className={classes.verticalAlignObjectFill}>
                                    <div className={classes.modalTitle} style={{textAlign: "center"}}>Welcome to OSIRIS</div>

                                    <div className={classes.inputLabel} style={{marginTop: 0}}>Username</div>
                                    <StandardInput value={username} update={(v) => (onUpdate("username", v))}/>
                                    <div className={classes.inputLabel}>Email Address</div>
                                    <StandardInput value={email_address} update={(v) => (onUpdate("email_address", v))}/>


                                    <div style={{display: "flex"}}>
                                        <div style={{flex: 1, paddingRight: "10px"}}>
                                            <div className={classes.inputLabel}>Password</div>
                                            <StandardInput type={"password"} value={password} update={(v) => (onUpdate("password", v))}/>
                                        </div>
                                        <div style={{flex: 1}}>
                                            <div className={classes.inputLabel}>Confirm Password</div>
                                            <StandardInput type={"password"} value={confirm_password} update={(v) => (onUpdate("confirm_password", v))}/>
                                        </div>
                                    </div>

                                    <div style={{marginTop: "25px"}}>
                                        <StandardButton label={"Claim Portfolio"} fullWidth={true} onClick={() => {
                                            if (onSubmit) onSubmit();
                                        }}/>
                                    </div>
                                </div>
                            </div>


                        </div>
                        <div style={{flex: "0 0 16px"}}>
                            <div style={{height: "100%", width: "100%"}}/>
                        </div>
                    </div>

                </div>

            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(StandardModal)));

