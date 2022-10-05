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
import {EDIT_PORTFOLIO_MODAL, EDIT_PORTFOLIO_MODALS, MODAL_HEIGHT_730} from "../../../common/styles";
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
    }
};

class AddBannerLinkModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        this.resetState();
    }

    resetState() {
        this.setState({
            link_name: null,
            link_url: null,
            link_image_url: null
        })
    }

    fileUploaded(e) {
        if (e.target.files && e.target.files[0]) {

            this.setState({uploading: true});
            const file = e.target.files[0];
            const formData = new FormData();

            formData.append('img', file);

            axios.post("/api/upload-user-img", formData).then((data) => {
                this.setState({uploading: false});

                if (data && data.data && data.data.url) {
                    const { url } = data.data;
                    this.setState({
                        link_image_url: url
                    })
                }
            })
        }
    }


    render() {
        let { classes, open, onClose, onSubmit } = this.props;

        const {
            link_name,
            link_url,
            link_image_url
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
                        maxHeight: COMMON.STYLES.EDIT_PORTFOLIO_MODAL.DEFAULT_MODAL_MAX_HEIGHT,
                        height: `${COMMON.STYLES.MODAL_HEIGHT_730}px`
                    }
                }}
            >
                <div style={COMMON.STYLES.STYLE_MODAL_SUPER_SUPER_CONTAINER}>
                    <div style={COMMON.STYLES.STYLE_MODAL_SUPER_CONTAINER}>
                        <div style={{flex: "0 0 51px", padding: "15px 25px", borderBottom: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <EditPortfolioModalHeader title={"Add Banner Link"} onClose={onClose} />
                        </div>
                        <div style={COMMON.STYLES.STYLE_MODAL_CONTAINER}>
                            <div className={classes.inputLabel}>Title</div>
                            <StandardInput value={link_name} update={(v) => (this.setState({link_name: v}))} />
                            <div className={classes.inputLabel}>URL</div>
                            <StandardInput value={link_url} update={(v) => (this.setState({link_url: v}))} />
                            <div className={classes.inputLabel}>Thumbnail</div>
                            <div style={{width: "100%", height: "418px",}}>
                                <ThumbnailUpload url={this.state.link_image_url} onURL={({url, file_name}) => {
                                    this.setState({
                                        link_image_url: url,
                                    })
                                }}/>
                            </div>
                        </div>
                        <div style={{flex: "0 0 54px", textAlign: "right", padding: "13px 25px",  borderTop: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <StandardButton label={"Save"} size={"S"} onClick={() => {
                                onSubmit ? onSubmit({link_name, link_url, link_image_url}) : null;
                                onClose ? onClose() : null;
                                this.resetState();
                            }}/>
                        </div>
                    </div>

                </div>
            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(AddBannerLinkModal)));

