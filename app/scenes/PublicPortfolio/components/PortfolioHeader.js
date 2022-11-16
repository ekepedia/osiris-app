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
    ...COMMON.STYLES.PORTFOLIO.PortfolioHeaderStyles
};

class PortfolioHeader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };

        this.portfolioLinkRef = React.createRef();

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

        if (currentWidth < 50) {
            RATIO = 100/250;
        }

        const currentHeight = currentWidth * RATIO;

        // console.log("RESIZED HEADER", node.clientWidth, currentHeight, node.clientHeight, "ratio:", RATIO)

        this.setState({
            currentWidth,
            currentHeight
        });
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
                </div>
                <div className={classes.profileHeaderContainer}>
                    <div className={classes.profileImageContainer}>
                        <div className={classes.profileImage}>
                            <CoverImageHolder url={profile_photo_url || "/img/generic-user.jpeg"}/>
                        </div>
                    </div>
                    <div className={classes.profileHeaderName}>{first_name} {last_name}</div>
                    <div className={classes.profileHeaderBio}>{bio}</div>
                    <div style={{marginTop: has_link ? "15px" : 0}}>
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
                        {user_vimeo_link && <a href={user_vimeo_link} target={"_blank"}>
                            <div className={mc(classes.socialLink)}>
                                <div>
                                    <i className={mc("fa-brands fa-vimeo-v")}></i>
                                </div>
                            </div>
                        </a>}
                        {user_tiktok_link && <a href={user_tiktok_link} target={"_blank"}>
                            <div className={mc(classes.socialLink)}>
                                <div>
                                    <i className={mc("fa-brands fa-tiktok")}></i>
                                </div>
                            </div>
                        </a>}
                        {user_website_link && <a href={user_website_link} target={"_blank"}>
                            <div className={mc(classes.socialLink)}>
                                <div>
                                    <i className={mc("fa-solid fa-link")}></i>
                                </div>
                            </div>
                        </a>}
                        {user_main_contact_email && <a href={`mailto:${user_main_contact_email}`} target={"_blank"}>
                            <div className={mc(classes.socialLink)}>
                                <div>
                                    <i className={mc("fa-solid fa-envelope")}></i>
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

