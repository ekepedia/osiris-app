import React from "react";
import _ from "lodash";
import moment from "moment";


import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import COMMON from "../../../common/index";
import { mc } from "../../../common/helpers";
import CoverImageHolder from "../../../components/CoverImageHolder";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    profileHeaderContainer: {
        padding: "75px 35px", position:"relative", paddingBottom: "25px", background: COMMON.COLORS.COLOR_WHITE,
        '@media (max-width: 768px)': {
            padding: "30px 15px",
            paddingBottom: "15px"
        },
    },
    profileCover: {
        height: "150px", width: "100%", overflow: "hidden",
        '@media (max-width: 768px)': {
            height: "75px",
        },
    },
    profileImageContainer: {
        position: "absolute",
        top: "-50px",
        '@media (max-width: 768px)': {
            top: "-18.5px",
        },
    },
    profileImage:{
        height: "100px",
        width: "100px",
        border: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`,
        borderRadius: "4px",
        overflow: "hidden",
        backgroundSize: "cover",
        '@media (max-width: 768px)': {
            height: "37px",
            width: "37px",
        },
    },
    profileHeaderName:{
        ...COMMON.FONTS.FONT_TITLE_2_BOLD,
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.FONT_CAPTION_2_BOLD,
        },
    },
    profileHeaderBio:{
        ...COMMON.FONTS.FONT_SUBHEADER,
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.FONT_CAPTION_3,
        },
    },
    socialLink: {
        background: COMMON.COLORS.OSIRIS_GREEN,
        color: COMMON.COLORS.COLOR_WHITE,
        height: "22px",
        width: "22px",
        textAlign: "center",
        fontSize: "10.5px",
        borderRadius: "6px",
        paddingTop: "5.75px",
        display: "inline-block",
        marginRight: "5px",
    },
};

class PortfolioHeader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, user} = this.props;

        user = user || {};

        let {
            cover_photo_url,
            profile_photo_url,
            first_name,
            last_name,
            bio,
            user_instagram_link,
            user_twitter_link,
        } = user;

        return (<div className={classes.container}>
            <div style={{border: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`, borderRadius: "6px", overflow: "hidden"}}>
                <div className={classes.profileCover}>
                    <CoverImageHolder url={cover_photo_url || "https://i.imgur.com/tM97NWQ.png"}/>
                </div>
                <div className={classes.profileHeaderContainer}>
                    <div className={classes.profileImageContainer}>
                        <div className={classes.profileImage}>
                            <CoverImageHolder url={profile_photo_url}/>
                        </div>
                    </div>
                    <div className={classes.profileHeaderName}>{first_name} {last_name}</div>
                    <div className={classes.profileHeaderBio}>{bio}</div>
                    <div style={{marginTop: "15px"}}>
                        {user_instagram_link && <a href={user_instagram_link} target={"_blank"}>
                            <div className={mc(classes.socialLink)}>
                                <div><i className={mc("fa-brands fa-instagram")}></i></div>
                            </div>
                        </a>}
                        {user_twitter_link && <a href={user_twitter_link} target={"_blank"}>
                            <div className={mc(classes.socialLink)}>
                                <div>
                                    <i className={mc("fa-brands fa-twitter")}></i>
                                </div>
                            </div>
                        </a>}
                    </div>
                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(PortfolioHeader)));

