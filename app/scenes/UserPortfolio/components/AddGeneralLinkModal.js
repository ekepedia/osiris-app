import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import Modal from 'react-modal';

import DataService from '../../../services/DataService';

import COMMON from "../../../common/index";
import {convertDateObjectToMonthYear, converMonthYearToDateObject, mc} from "../../../common/helpers";
import StandardButton from "../../../components/StandardButton";
import StandardInput from "../../../components/StandardInput";
import {EDIT_PORTFOLIO_MODAL, EDIT_PORTFOLIO_MODALS} from "../../../common/styles";
import EditPortfolioModalHeader from "./EditPortfolioModalHeader";
import StandardSelect from "../../../components/StandardSelect";
import axios from "axios";
import CoverImageHolder from "../../../components/CoverImageHolder";
import {FONT_HEADLINE_BOLD} from "../../../common/fonts";
import {OSIRIS_BLACK, OSIRIS_TAN} from "../../../common/colors";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    modalTitle: {
        color: COMMON.COLORS.DARK_GREY,
        ...COMMON.FONTS.FONT_HEADLINE_BOLD,
        lineHeight: "19px",
        '& span': {
            ...COMMON.FONTS.FONT_SUBHEADER,
            lineHeight: "19px"
        },
        marginBottom: "5px"
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
    optionContainer: {
        display: "flex",
        marginTop: "15px"
    },
    optionImageContainer: {
        flex: "0 0 60px",
    },
    optionImage: {
        border: `1px solid ${COMMON.COLORS.LIGHT_GREY}`,
        height: "45px",
        width: "45px",
        borderRadius: "6px"
    },

    optionLabel: {
        flex: "1",
        paddingTop: "5px",
        paddingRight: "10px",
        ...COMMON.FONTS.FONT_SUBHEADER_BOLD,
        color: COMMON.COLORS.COLOR_BLACK,
        '& span': {
            ...COMMON.FONTS.FONT_FOOTNOTE,
            color: COMMON.COLORS.DARK_GREY,
            lineHeight: "16px"
        }
    },
    optionAddContainer: {
        ...COMMON.FONTS.FONT_SUBHEADER_BOLD,
        flex: "0 0 27px",
        color: COMMON.COLORS.OSIRIS_GREEN,
        lineHeight: "19px",
        marginTop: "13px",
        cursor: "pointer"
    },
    optionImageIcon: {
        color: COMMON.COLORS.COLOR_WHITE,
        height: "100%",
        width: "100%",
        fontSize: "19px"
    },
    ...COMMON.STYLES.GENERAL.AlignmentStyles,
};

class AddGeneralLinkModal extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }


    render() {
        let { classes, open, onClose, openSmallLink, openBannerLink, openYoutubeLink, openGallery } = this.props;


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
                    <div style={{display: "flex", flexDirection: "column", height: "100%", overflow: "hidden"}}>
                        <div style={{flex: "0 0 51px", padding: "15px 25px", borderBottom: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <EditPortfolioModalHeader title={"Add to Portfolio"} onClose={onClose} />
                        </div>
                        <div style={{flex: 1, padding: "20px 25px"}}>

                            <div className={classes.modalTitle}>
                                <div>Share your content</div>
                                <div><span>Share content directly on your portfolio</span></div>
                            </div>

                            <div style={{display: "flex"}}>
                                <div style={{flex: 1, paddingRight: "50px"}}>
                                    <div className={classes.optionContainer} onClick={() => {openSmallLink ? openSmallLink() : null}}>
                                        <div className={classes.optionImageContainer}>
                                            <div className={classes.optionImage} style={{background: COMMON.COLORS.OSIRIS_GREEN}}>
                                                <div className={mc(classes.centerAlignContainer, classes.optionImageIcon)}>
                                                    <div className={classes.centerAlignObject}>
                                                        <i className={mc("fa-solid fa-link")}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={classes.optionLabel}>
                                            <div>Link</div>
                                            <div><span>Share links on your portfolio</span></div>
                                        </div>
                                        <div className={classes.optionAddContainer}>Add</div>
                                    </div>
                                    <div className={classes.optionContainer} onClick={() => {openGallery ? openGallery() : null}}>
                                        <div className={classes.optionImageContainer}>
                                            <div className={classes.optionImage} style={{background: COMMON.COLORS.OSIRIS_BLACK}}>
                                                <div className={mc(classes.centerAlignContainer, classes.optionImageIcon)}>
                                                    <div className={classes.centerAlignObject}>
                                                        <i className="fa-solid fa-image"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={classes.optionLabel}>
                                            <div>Gallery</div>
                                            <div><span>Add gallery images</span></div>
                                        </div>
                                        <div className={classes.optionAddContainer}>Add</div>
                                    </div>
                                </div>
                                <div style={{flex: 1}}>
                                    <div className={classes.optionContainer} onClick={() => {openBannerLink ? openBannerLink() : null}}>
                                        <div className={classes.optionImageContainer}>
                                            <div className={classes.optionImage} style={{background: COMMON.COLORS.OSIRIS_TAN}}>
                                                <div className={mc(classes.centerAlignContainer, classes.optionImageIcon)}>
                                                    <div className={classes.centerAlignObject}>
                                                        <i className="fa-solid fa-camera"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={classes.optionLabel}>
                                            <div>Banner Image + Link</div>
                                            <div><span>Share a banner image with a link</span></div>
                                        </div>
                                        <div className={classes.optionAddContainer}>Add</div>
                                    </div>
                                    <div className={classes.optionContainer} onClick={() => {openYoutubeLink ? openYoutubeLink() : null}}>
                                        <div className={classes.optionImageContainer}>
                                            <div className={classes.optionImage}>
                                                <div className={mc(classes.centerAlignContainer, classes.optionImageIcon)}>
                                                    <div className={classes.centerAlignObject} style={{color: "#FF0000"}}>
                                                        <i className="fa-brands fa-youtube"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={classes.optionLabel}>
                                            <div>YouTube</div>
                                            <div><span>Share YouTube videos on your portfolio</span></div>
                                        </div>
                                        <div className={classes.optionAddContainer}>Add</div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(AddGeneralLinkModal)));

