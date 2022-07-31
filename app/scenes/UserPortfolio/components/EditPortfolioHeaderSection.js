import React from "react";
import _ from "lodash";
import moment from "moment";


import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import COMMON from "../../../common/index";
import { mc } from "../../../common/helpers";
import CoverImageHolder from "../../../components/CoverImageHolder";
import StandardButton from "../../../components/StandardButton";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    cameraIconContainer: {
        position: "absolute",
        height: "25px",
        width: "25px",
        borderRadius: "100%",
        top: "-12.5",
        right: "-12.5",
        background: COMMON.COLORS.COLOR_WHITE,
        border: `1px solid ${COMMON.COLORS.LIGHT_GREY}`,
        textAlign: "center",
        cursor: "pointer"
    },
    cameraIcon: {
        fontSize: "13px",
        lineHeight: "23px"
    },
    ...COMMON.STYLES.PORTFOLIO.PortfolioHeaderStyles
};

class PortfolioHeader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };

        this.portfolioLinkRef = React.createRef();
        this.profilePhotoUpload = React.createRef();
        this.profileCoverUpload = React.createRef();
    }

    componentDidMount() {
        setTimeout(() =>{
            this.setHeightRatio();
        }, 5);

        window.addEventListener('resize', this.setHeightRatio.bind(this));
    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.setHeightRatio.bind(this));
    }

    uploadProfilePhoto() {
        if (!this.profilePhotoUpload || !this.profilePhotoUpload.current)
            return;

        this.profilePhotoUpload.current.click();
    }

    uploadCoverPhoto() {
        if (!this.profileCoverUpload || !this.profileCoverUpload.current)
            return;

        this.profileCoverUpload.current.click();
    }

    setHeightRatio() {
        if (!this.portfolioLinkRef || !this.portfolioLinkRef.current)
            return;

        let DELAY = 100;

        clearInterval(this.holdForResize);

        this.runResize();
        this.holdForResize = setTimeout(() => {
            this.runResize();
        }, DELAY);
    }

    runResize() {
        let RATIO = 150/681;
        const node = this.portfolioLinkRef.current;
        const currentWidth = node.clientWidth;

        if (currentWidth < 700) {
            RATIO = 100/250;
        }

        const currentHeight = currentWidth * RATIO;

        console.log("RESIZED HEADER", node.clientWidth, currentHeight, node.clientHeight, "ratio:", RATIO)

        this.setState({
            currentWidth,
            currentHeight
        });
    }

    render() {
        let { classes, user, openEditModal, uploadProfilePhoto, uploadCoverPhoto} = this.props;

        user = user || {};

        let {
            cover_photo_url,
            profile_photo_url,
            first_name,
            last_name,
            bio,
            username,
            user_instagram_link,
            user_twitter_link,
            user_clubhouse_link,
            user_youtube_link,
            user_website_link,
            user_tiktok_link,
            user_main_contact_email,
            user_vimeo_link
        } = user;

        let has_link = (user_instagram_link || user_main_contact_email || user_clubhouse_link || user_youtube_link || user_twitter_link || user_website_link || user_tiktok_link || user_vimeo_link);

        return (<div className={classes.container}>
            <div className={classes.superContainer}>
                <div className={classes.profileCover} ref={this.portfolioLinkRef} style={{height: this.state.currentHeight ? this.state.currentHeight : null}}>
                    <CoverImageHolder url={cover_photo_url || "https://i.imgur.com/tM97NWQ.png"}/>
                    <div className={classes.cameraIconContainer} style={{top: 20, right: 20}} onClick={() => {this.uploadCoverPhoto()}}>
                        <i className={mc("fa-solid fa-camera", classes.cameraIcon)}/>
                        <input type={"file"} style={{display: "none"}} ref={this.profileCoverUpload} onChange={(e) => {
                            uploadCoverPhoto ? uploadCoverPhoto(e) : null
                        }}/>
                    </div>
                </div>
                <div className={classes.profileHeaderContainer}>
                    <div className={classes.profileImageContainer}>
                        <div className={classes.profileImage} style={{overflow: "initial"}}>
                            <CoverImageHolder url={profile_photo_url}/>
                            <div className={classes.cameraIconContainer} onClick={() => {this.uploadProfilePhoto()}} >
                                <i className={mc("fa-solid fa-camera", classes.cameraIcon)}/>
                                <input type={"file"} style={{display: "none"}} ref={this.profilePhotoUpload} onChange={(e) => {
                                    uploadProfilePhoto ? uploadProfilePhoto(e) : null
                                }}/>
                            </div>
                        </div>
                    </div>
                    <div className={classes.editHeaderButtonContainer}>
                        <div className={classes.editHeaderButton}>
                            <a target={"_blank"} href={`/u/${username}`}>
                                <StandardButton label={"Preview"} outline={false}/>
                            </a>
                        </div>
                        <div className={classes.editHeaderButton}>
                            <StandardButton label={"Edit Profile Header"} outline={true} onClick={() => {openEditModal && openEditModal()}}/>
                        </div>
                    </div>
                    <div className={classes.profileHeaderName}>{first_name} {last_name}</div>
                    <div className={classes.profileHeaderBio}>{bio}</div>
                    <div style={{marginTop: "15px"}}>
                        <div className={mc(classes.socialLink)} style={{opacity: user_instagram_link ? 1 : 0.5}} onClick={() => {openEditModal && openEditModal()}}>
                            <div><i className={mc("fa-brands fa-instagram")}></i></div>
                        </div>
                        <div style={{opacity: user_twitter_link ? 1 : 0.5}} className={mc(classes.socialLink)} onClick={() => {openEditModal && openEditModal()}}>
                            <div>
                                <i className={mc("fa-brands fa-twitter")}></i>
                            </div>
                        </div>
                        <div style={{opacity: user_tiktok_link ? 1 : 0.5}} className={mc(classes.socialLink)} onClick={() => {openEditModal && openEditModal()}}>
                            <div>
                                <i className={mc("fa-brands fa-tiktok")}></i>
                            </div>
                        </div>
                        <div style={{opacity: user_website_link ? 1 : 0.5}} className={mc(classes.socialLink)} onClick={() => {openEditModal && openEditModal()}}>
                            <div>
                                <i className={mc("fa-solid fa-link")}></i>
                            </div>
                        </div>

                        <div style={{opacity: user_vimeo_link ? 1 : 0.5}} className={mc(classes.socialLink)} onClick={() => {openEditModal && openEditModal()}}>
                            <div>
                                <i className={mc("fa-brands fa-vimeo-v")}></i>
                            </div>
                        </div>

                        <div style={{opacity: user_main_contact_email ? 1 : 0.5}} className={mc(classes.socialLink)} onClick={() => {openEditModal && openEditModal()}}>
                            <div>
                                <i className={mc("fa-solid fa-envelope")}></i>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(PortfolioHeader)));

