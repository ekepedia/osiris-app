import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';
import {COLOR_WHITE, OSIRIS_BLACK} from "../../common/colors";

import COMMON from "../../common/index";
import { mc } from "../../common/helpers";


import OnBoardingModal from "../../components/OnBoardingModal"
import {FONT_LARGE_TITLE_BOLD, FONT_TITLE_2} from "../../common/fonts";
import NavBar from "../../components/NavBar";
import CoverImageHolder from "../../components/CoverImageHolder";

const DEFAULT_MAX_WIDTH = 1150;
const DEFAULT_MAX_WIDTH_HALF = Math.round(DEFAULT_MAX_WIDTH/2);

const HERO_MAX_WIDTH = 454;
const LEFT_PADDING = `calc(25vw - ${HERO_MAX_WIDTH/2}px)`;

const CUT_OFF_1 = 950;

const MOBILE_PADDING = 30;

const Styles = {
    ...COMMON.STYLES.MOBILE_STYLES,
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    paddingLeftDefault: {
        paddingLeft: LEFT_PADDING,
        [`@media (max-width: ${CUT_OFF_1}px)`]: {
            paddingLeft: `${MOBILE_PADDING}px`,
        },
    },
    marginLeftDefault: {
        marginLeft: LEFT_PADDING,
        [`@media (max-width: ${CUT_OFF_1}px)`]: {
            marginLeft: `${MOBILE_PADDING}px`,
            marginRight: `${MOBILE_PADDING}px`,
        },
    },
    paddingRightDefault: {
        paddingRight: LEFT_PADDING
    },
    marginRightDefault: {
        marginRight: LEFT_PADDING,
        [`@media (max-width: ${CUT_OFF_1}px)`]: {
            marginLeft: `${MOBILE_PADDING}px`,
            marginRight: `${MOBILE_PADDING}px`,
        },
    },
    section: {
        padding: "180px",
        '@media (max-width: 768px)': {
            padding: "180px",
        },
    },
    sectionContainerDefault: {
        width: "calc(100vw - 30px)",
        maxWidth: `${DEFAULT_MAX_WIDTH}px`,
        margin: "auto"
    },
    sectionLeftSectionDefault: {
        maxWidth: "370px",
    },
    sectionLeftSectionNoRight: {
        paddingLeft: `calc(50vw - ${DEFAULT_MAX_WIDTH}px/2)`,
    },
    sectionRightSectionDefault: {
        maxWidth: "370px",
        textAlign: "right",
        marginLeft: "auto",
    },
    sectionLeftPadding: {
        paddingLeft: "180px"
    },
    sectionWidthWide: {
        maxWidth: "415px",

    },
    sectionWidthNarrow: {
        maxWidth: "365px"
    },
    sectionHeader: {
        ...COMMON.FONTS.FONT_CAPTION_2_BOLD,
        textTransform: "uppercase",
        marginBottom: "5px"
    },
    sectionTitle: {
        ...COMMON.FONTS.FONT_TITLE_2_BOLD,
        marginBottom: "15px",
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.FONT_TITLE_3_BOLD,
        },
    },
    sectionBody: {
        ...COMMON.FONTS.FONT_BODY,
        marginBottom: "15px",
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.FONT_FOOTNOTE,
            marginBottom: "0px",

        },
    },
    sectionCTA: {
        ...COMMON.FONTS.FONT_HEADLINE_BOLD,
        marginTop: "15px"
    },
    featureContainer: {
        width: "200px",

        display: "inline-block",
        verticalAlign: "top",
        marginRight: "35px",
        overflow: "hidden",
        whiteSpace: "normal"
    },
    featureContainerWide: {
        width: "300px",

        display: "inline-block",
        verticalAlign: "top",
        marginRight: "35px",
        overflow: "hidden",
        whiteSpace: "normal"
    },
    featureImage: {
        height: "200px",

        width: "100%",
        background: "black",
        borderRadius: "6px"
    },
    featureImageTall: {
        height: "300px",

        width: "100%",
        background: "red",
        borderRadius: "6px"
    },
    featureName: {
        ...COMMON.FONTS.FONT_BODY_BOLD,
        marginTop: "10px",
        color: COMMON.COLORS.COLOR_BLACK
    },
    featureBio: {
        ...COMMON.FONTS.FONT_CAPTION_1,
        marginTop: "2px",
        color: COMMON.COLORS.COLOR_BLACK
    },
    footerDefault: {
        ...COMMON.FONTS.FONT_BODY,
        marginBottom: "5px"
    },
    footerBold: {
        ...COMMON.FONTS.FONT_BODY_BOLD,
        marginBottom: "5px"
    },
    landingContainer: {
        height: "100%",
        '@media (max-width: 768px)': {
            height: "fit-content",
            marginBottom: "65px"
        },
    },
    landingHeroText: {
        maxWidth: "454px",
        marginTop: "calc(50vh - 116px - 65px)",
        '@media (max-width: 768px)': {
            marginTop: "65px",
        },
    },
    landingHeroTitle: {
        ...COMMON.FONTS.FONT_LARGE_TITLE_BOLD,
        marginBottom: "15px",
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.FONT_TITLE_2_BOLD,
            marginBottom: "10px"
        },
    },
    landingHeroBody: {
        ...COMMON.FONTS.FONT_TITLE_3,
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.FONT_FOOTNOTE,
        },
    },
    profileHighlights: {
        paddingTop: "50px",
        marginBottom: "100px",
        '@media (max-width: 768px)': {
            marginBottom: "50px",
        },
    },
    userProfileSectionContainer: {
        paddingTop: "50px",
        marginBottom: "100px",
        '@media (max-width: 768px)': {
            marginBottom: "50px",
        },
    },
    userProfileSection: {
        paddingTop: "243px",
        '@media (max-width: 768px)': {
            paddingTop: "0",
        },
    },
    peerSupportSectionContainer: {
        paddingTop: "50px",
        paddingBottom: "100px",
        background: COMMON.COLORS.OSIRIS_GREEN,
        color: COMMON.COLORS.COLOR_WHITE,
        '@media (max-width: 768px)': {
            paddingBottom: "50px",
        },
    },
    peerSupportSection: {
        marginLeft: "auto",
        paddingTop: "243px",
        '@media (max-width: 768px)': {
            marginLeft: "0",
            paddingTop: "0",
        },
    },
    findAJobSectionContainer: {
        paddingTop: "100px",
        marginBottom: "100px",
        '@media (max-width: 768px)': {
            paddingTop: "50px",
            marginBottom: "50px",
        },
    },
    findAJobSection: {
        paddingTop: "93px",
        '@media (max-width: 768px)': {
            paddingTop: "0",
        },
    },
    applySectionContainer: {
        paddingTop: "100px",
        marginBottom: "100px",
        '@media (max-width: 768px)': {
            paddingTop: "50px",
            marginBottom: "50px",
        },
    },
    applySection: {
        paddingLeft: "25px",
        width: "100%",
        height: "366px",
        '@media (max-width: 768px)': {
            paddingLeft: "30px",
            paddingRight: "30px",
        },
    },
    applyHolder: {
        background: COMMON.COLORS.OSIRIS_GREEN,
        height: "100%",
        width: "100%",
        padding: "50px 75px",
        borderRadius: "6px",
        textAlign: "center",
        '@media (max-width: 768px)': {
            padding: "50px 20px",
        },
    },
    mobileImageContainer: {
        display: "none",
        width: "100%",
        marginTop: "50px",
        padding: "0 30px",
        '@media (max-width: 768px)': {
            display: "block",
        },
    },
    mobileImage: {
        width: "100%"
    }
};

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showOnBoardingModal: false
        };
    }

    componentDidMount() {

    }

    setOnBoardingModal(show) {
        this.setState({
            showOnBoardingModal: show
        })
    }

    render() {
        let { classes, client, match: { params } } = this.props;

        return (<div className={classes.container}>


            <div style={{display: "flex", flexDirection: "column", height: "100%", overflow: "hidden"}}>
                <div style={{flex: "0 0 50px"}}>
                    <NavBar/>
                </div>
                <div style={{flex: 1, overflow: "scroll"}}>
                    <div>
                        <div className={mc(classes.landingContainer)}>
                            <div style={{display: "flex", height: "100%"}}>
                                <div style={{flex: 1}}>
                                    <div>
                                        <div className={mc(classes.marginLeftDefault, classes.landingHeroText)}>
                                            <div className={mc(classes.landingHeroTitle)}>The professional network built for the multi-hyphenate generation</div>
                                            <div className={mc(classes.landingHeroBody)}>OSIRIS is redefining what a social and career network can and should be by redefining the professional for today’s generation</div>
                                            <div style={{marginTop: "25px"}}>
                                                <div style={{...COMMON.STYLES.STYLE_BUTTON_HEADLINE, background: COMMON.COLORS.OSIRIS_GREEN}} onClick={() => (this.setOnBoardingModal(true))}>Claim your portfolio</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{flex: 1, height: "100%"}} className={mc(classes.hideOnMobile)}>

                                    <div style={{display: "flex", height: "100%"}}>
                                        <div style={{flex: 1, marginRight: "5px", height: "100%"}}>
                                            <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
                                                <div style={{flex: 1, overflow: "hidden", marginBottom: "5px",}}>
                                                    <CoverImageHolder url={"/img/hero-1.png"}/>
                                                </div>
                                                <div style={{flex: 1, overflow: "hidden", marginTop: "5px",}}>
                                                    <CoverImageHolder url={"/img/hero-2.png"}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{flex: 1, marginLeft: "5px", height: "100%"}}>
                                            <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
                                                <div style={{flex: 1, overflow: "hidden", marginBottom: "5px",}}>
                                                    <CoverImageHolder url={"/img/hero-3.png"}/>
                                                </div>
                                                <div style={{flex: 1, overflow: "hidden", marginTop: "5px",}}>
                                                    <CoverImageHolder url={"/img/hero-4.png"}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>


                        <div style={{paddingTop: "50px"}}>
                                <div className={mc(classes.marginLeftDefault, classes.sectionWidthWide, )}>
                                    <div>
                                        <div className={mc(classes.sectionHeader)}>Community</div>
                                        <div className={mc(classes.sectionTitle)}>Connect with a diverse and inclusive community</div>
                                        <div className={mc(classes.sectionBody)}>OSIRIS connects you with your peers, companies, and mentors across industries irrespective of your background</div>
                                    </div>
                                </div>
                        </div>


                        <div className={mc(classes.profileHighlights)}>
                            <div style={{width: "100%", overflow: "scroll"}}>
                                <div className={mc(classes.marginLeftDefault)} style={{width: "fit-content", whiteSpace: "nowrap"}}>
                                    <div className={mc(classes.featureContainer)}>
                                        <Link to={"/u/jason"}>
                                            <div className={mc(classes.featureImage)}>
                                                <CoverImageHolder url={"/img/Instagram post - 1.png"}/>
                                            </div>
                                            <div className={mc(classes.featureName)}>Jason Mayden</div>
                                            <div className={mc(classes.featureBio)}>President Fear of God Athletics & Founder Trillicon Vally</div>
                                        </Link>
                                    </div>
                                    <div className={mc(classes.featureContainer)}>
                                        <div className={mc(classes.featureImageTall)}>
                                            <CoverImageHolder url={"/img/Instagram story - 3.png"}/>
                                        </div>
                                        <div className={mc(classes.featureName)}>Alicia Gutierrez</div>
                                        <div className={mc(classes.featureBio)}>Content Director Soho House</div>
                                    </div>
                                    <div className={mc(classes.featureContainer)}>
                                        <div className={mc(classes.featureImage)}>
                                            <CoverImageHolder url={"/img/Instagram post - 2.png"}/>
                                        </div>
                                        <div className={mc(classes.featureName)}>Sade Ndya</div>
                                        <div className={mc(classes.featureBio)}>Cinematographer</div>
                                    </div>
                                    <div className={mc(classes.featureContainer)}>
                                        <div className={mc(classes.featureImageTall)}>
                                            <CoverImageHolder url={"/img/Instagram story - 4.png"}/>
                                        </div>
                                        <div className={mc(classes.featureName)}>Abigail Africa</div>
                                        <div className={mc(classes.featureBio)}>Design Strategist</div>
                                    </div>
                                    <div className={mc(classes.featureContainerWide)}>
                                        <div className={mc(classes.featureImage)}>
                                            <CoverImageHolder url={"/img/Instagram story - 5.png"}/>
                                        </div>
                                        <div className={mc(classes.featureName)}>Amber Grimes</div>
                                        <div className={mc(classes.featureBio)}>EVP LVRN</div>
                                    </div>
                                    <div className={mc(classes.featureContainer)}>
                                        <div className={mc(classes.featureImageTall)}>
                                            <CoverImageHolder url={"/img/Instagram story - 6.png"}/>
                                        </div>
                                        <div className={mc(classes.featureName)}>Mohamed Sahid</div>
                                        <div className={mc(classes.featureBio)}>Creative Director</div>
                                    </div>

                                </div>

                            </div>


                        </div>

                        <div className={mc(classes.userProfileSectionContainer)}>
                            <div style={{display: "flex"}}>
                                <div style={{flex: 1}}>
                                    <div className={mc(classes.userProfileSection)}>
                                        <div className={mc(classes.marginLeftDefault, classes.sectionWidthWide,)}>
                                            <div>
                                                <div className={mc(classes.sectionHeader)}>User Profile</div>
                                                <div className={mc(classes.sectionTitle)}>Create your portfolio link in minutes</div>
                                                <div className={mc(classes.sectionBody)}>Your portfolio is as unique as you are. Connect your socials, website, store, videos, music, podcast, events, and more. Even share it, helping people find all your information in one place.</div>
                                                <div className={mc(classes.sectionCTA)}>Design Your Portfolio <span><i className="fa-solid fa-arrow-right"></i></span></div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className={mc(classes.mobileImageContainer)}>
                                        <img className={mc(classes.mobileImage)} src={"/img/profile-hero.png"}/>
                                    </div>
                                </div>
                                <div style={{flex: 1.2}} className={mc(classes.hideOnMobile)}>
                                    <div className={mc(classes.marginRightDefault)} style={{maxWidth: "637px"}}>
                                        <div style={{width: "100%", textAlign: "center"}}>
                                            <img style={{width: "100%", maxWidth: "666px", margin: "auto"}} src={"/img/profile-hero.png"}/>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div className={mc(classes.peerSupportSectionContainer)}>
                            <div style={{display: "flex"}}>
                                <div style={{flex: 1}} className={mc(classes.hideOnMobile)}>
                                    <div style={{width: "100%",}}>
                                        <img style={{width: "100%", maxWidth: "666px"}} className={mc(classes.marginLeftDefault)} src={"/img/question-hero.png"}/>
                                    </div>
                                </div>
                                <div style={{flex: 1}}>
                                    <div>
                                        <div className={mc(classes.marginRightDefault)}>
                                            <div className={mc(classes.sectionWidthWide, classes.peerSupportSection)}>
                                                <div className={mc(classes.sectionHeader)}>PEER & MENTOR SUPPORT</div>
                                                <div className={mc(classes.sectionTitle)}>Connect with your community</div>
                                                <div className={mc(classes.sectionBody)}>We verify every user before allowing them to join OSIRIS. As a result, users can post questions anonymously, allowing for authentic insights, feedback, and advice from community members</div>
                                                <div className={mc(classes.sectionCTA)}>Ask a question <span><i className="fa-solid fa-arrow-right"></i></span></div>
                                            </div>
                                        </div>
                                        <div className={mc(classes.mobileImageContainer)}>
                                            <img className={mc(classes.mobileImage)} src={"/img/question-hero.png"}/>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className={mc(classes.findAJobSectionContainer)}>
                            <div style={{display: "flex"}}>
                                <div style={{flex: 1}}>
                                    <div className={mc(classes.findAJobSection)}>
                                        <div className={mc(classes.paddingLeftDefault)}>
                                            <div className={mc(classes.sectionWidthWide)}>
                                                <div className={mc(classes.sectionHeader)}>ACCESS TO JOBS</div>
                                                <div className={mc(classes.sectionTitle)}>Find a job that represents you</div>
                                                <div className={mc(classes.sectionBody)}>OSIRIS allows you to find opportunities with companies that represent you. Use 10+ unique filters to sort through roles and get access to DE&I stats before applying</div>
                                                <div className={mc(classes.sectionCTA)}>Find A Job <span><i className="fa-solid fa-arrow-right"></i></span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={mc(classes.mobileImageContainer)}>
                                        <img className={mc(classes.mobileImage)} src={"/img/jobs-hero.png"}/>
                                    </div>
                                </div>
                                <div style={{flex: 1.2}} className={mc(classes.hideOnMobile)}>
                                    <div style={{width: "100%", maxWidth: "666px", marginLeft: "auto"}} className={mc(classes.marginRightDefault)}>
                                        <img style={{width: "100%", }} src={"/img/jobs-hero.png"}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={mc(classes.applySectionContainer)}>
                            <div style={{display: "flex"}}>
                                <div style={{flex: 1}} className={mc(classes.hideOnMobile)}>
                                    <div style={{width: "100%", paddingRight: "25px", height: "366px", overflow: "hidden"}} className={mc(classes.paddingLeftDefault)}>
                                        <img style={{width: "100%", height: "100%"}} src={"/img/sign-up-hero.png"}/>
                                    </div>
                                </div>
                                <div style={{flex: 1}}>
                                    <div className={mc(classes.paddingRightDefault, classes.applySection)}>
                                        <div className={mc(classes.applyHolder)}>
                                            <div style={{height: "100%", width: "100%", position:"relative",}}>
                                                <div style={{maxWidth: "225px", margin: "auto"}}>
                                                    <div style={{...COMMON.FONTS.FONT_TITLE_1_BOLD, color: COMMON.COLORS.COLOR_WHITE}}>Apply to join OSIRIS today.</div>
                                                    <div style={{...COMMON.FONTS.FONT_HEADLINE_BOLD, marginTop: "10px", color: COMMON.COLORS.COLOR_WHITE}}>Get Started</div>
                                                </div>
                                                <div style={{display: "flex", position: "absolute", width: "100%", bottom: 0}}>
                                                    <div style={{flex:1, marginRight: "10px"}}>
                                                        <input

                                                            placeholder={"Email Address"}

                                                            style={{
                                                            height: "41px",
                                                            lineHeight: "41px",
                                                            background: COMMON.COLORS.COLOR_WHITE,
                                                            ...COMMON.FONTS.FONT_BODY,
                                                            paddingLeft: "10px",
                                                            border: "none",
                                                            outline: "none",
                                                            borderRadius: "6px",
                                                            width: "100%"
                                                        }}/>
                                                    </div>
                                                    <div style={{flex: "0 0 117px"}}>
                                                        <div
                                                            onClick={() => (this.setOnBoardingModal(true))}

                                                            style={{
                                                            height: "41px",
                                                            lineHeight: "41px",
                                                            background: COMMON.COLORS.COLOR_WHITE,
                                                            ...COMMON.FONTS.FONT_HEADLINE_BOLD,
                                                            textAlign: "center",
                                                            borderRadius: "6px",
                                                            cursor: "pointer"
                                                        }}>Apply to Join</div>
                                                    </div>
                                                </div>

                                            </div>


                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>


                        <div style={{background: COMMON.COLORS.OSIRIS_BLACK, paddingTop: "75px", paddingBottom: "75px", color: COMMON.COLORS.COLOR_WHITE, ...COMMON.FONTS.FONT_BODY}} className={mc(classes.paddingLeftDefault, classes.paddingRightDefault, classes.hideOnMobile)}>
                            <div style={{display: "flex"}}>
                                <div style={{flex: 1, ...COMMON.FONTS.FONT_TITLE_2_BOLD}} >
                                    OSIRIS
                                </div>
                                <div style={{flex: 1}}>
                                    <div className={mc(classes.footerBold)}>Browse OSIRIS</div>
                                    <div className={mc(classes.footerDefault)}>Jobs</div>
                                    <div className={mc(classes.footerDefault)}>Employers</div>
                                    <div className={mc(classes.footerDefault)}>Universities</div>
                                </div>
                                <div style={{flex: 1}}>
                                    <div className={mc(classes.footerBold)}>Community</div>
                                    <div className={mc(classes.footerDefault)}>Community Guidelines</div>
                                    <div className={mc(classes.footerDefault)}>New User Guide</div>
                                </div>
                                <div style={{flex: 1}}>
                                    <div className={mc(classes.footerBold)}>Get in Touch</div>
                                    <div className={mc(classes.footerDefault)}>Contact</div>
                                    <div className={mc(classes.footerDefault)}>Press</div>
                                    <div className={mc(classes.footerDefault)}>Careers</div>
                                </div>
                                <div style={{flex: 1}}>
                                    <div className={mc(classes.footerBold)}>Legal</div>
                                    <div className={mc(classes.footerDefault)}>Privacy Center</div>
                                    <div className={mc(classes.footerDefault)}>Cookie Policy</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            <OnBoardingModal
                open={this.state.showOnBoardingModal}
                onClose={() => (this.setOnBoardingModal(false))}
            />
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(Home)));

