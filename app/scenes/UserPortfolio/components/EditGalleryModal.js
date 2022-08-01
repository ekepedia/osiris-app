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
import UserGalleryService from "../../../services/UserGalleryService";

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
    ...COMMON.STYLES.GENERAL.AlignmentStyles,
    ...COMMON.STYLES.PORTFOLIO.EditToggleDeleteStyles,
};

class EditGalleryModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gallery_photo_url: null,
            gallery_order: null,
            gallery_name: null,
            gallery_caption: null,
        };
    }

    componentDidMount() {

    }

    removeUserGallery({user_gallery_id}) {
        const { client, refetch } = this.props;

        let yes = confirm("Are you sure you want delete this photo? This action can not be undone!");

        if (yes) {
            UserGalleryService.removeUserGallery({client, user_gallery_id}).then(() => {
                refetch ? refetch() : refetch;
            })
        }
    }

    toggleActive({user_gallery_id, is_hidden}) {
        const { client, refetch } = this.props;

        UserGalleryService.editUserGallery({client, user_gallery_id, is_hidden: !is_hidden}).then(() => {
            refetch ? refetch() : refetch;
        })
    }

    render() {
        let { classes, open, onClose, onSubmit, user_galleries, onUploadNew} = this.props;

        user_galleries = user_galleries || [];

        console.log("user_galleries in mo", user_galleries)

        const {
            gallery_photo_url,
            gallery_order,
            gallery_name,
            gallery_caption,
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
                        maxHeight: COMMON.STYLES.EDIT_PORTFOLIO_MODAL.DEFAULT_MODAL_HEIGHT,
                        height: "fit-content"
                    }
                }}
            >
                <div style={{height: "100%", overflow: "hidden"}}>
                    <div style={{display: "flex", flexDirection: "column", height: "100%", overflow: "hidden"}}>
                        <div style={{flex: "0 0 51px", padding: "15px 25px", borderBottom: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <EditPortfolioModalHeader title={"Edit Gallery Photos"} onClose={onClose} />
                        </div>
                        <div style={{flex: 1, padding: "20px 25px"}}>

                            {user_galleries.map((user_gallery, i) => {

                                return (<div style={{opacity: user_gallery.is_hidden ? 0.5 : 1}}>
                                    <div style={{display: "flex", height: "40px", lineHeight: "40px", marginTop: i === 0 ? 0 : "15px"}}>
                                        <div style={{flex: "0 0 71px", border: `1px solid ${COMMON.COLORS.LIGHT_GREY}`, borderRadius: "6px", }}>
                                            <CoverImageHolder url={user_gallery.gallery_photo_url}/>
                                        </div>
                                        <div style={{flex: 1, paddingLeft: "15px", ...COMMON.FONTS.FONT_SUBHEADER_BOLD}}>
                                            {user_gallery.gallery_name}
                                        </div>
                                        <div style={{flex: "0 0 42px"}} className={mc(classes.centerAlignContainer, classes.editToggleDeleteSuperContainer)}>
                                            <div className={mc(classes.centerAlignObject, classes.editToggleDeleteContainer)}>
                                                <div className={mc(classes.editToggleDeleteToggle)} onClick={() => (this.toggleActive(user_gallery))}>
                                                    <i className={`fa-solid fa-toggle-${user_gallery.is_hidden ? "off" : "on"}`}/>
                                                </div>
                                                <div className={mc(classes.editToggleDeleteDelete)} onClick={() => (this.removeUserGallery(user_gallery))}>
                                                    <i className="fa-solid fa-xmark"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>)
                            })}
                        </div>
                        <div style={{flex: "0 0 54px", textAlign: "right", padding: "13px 25px",  borderTop: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`}}>
                            <StandardButton label={"Upload New"} size={"S"} onClick={() => {
                                onUploadNew ? onUploadNew() : null;
                                onClose ? onClose() : null;
                            }}/>
                        </div>
                    </div>

                </div>
            </Modal>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(EditGalleryModal)));

