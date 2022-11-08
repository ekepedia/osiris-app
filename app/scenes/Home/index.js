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
import StandardButton from "../../components/StandardButton";


const HERO_MAX_WIDTH = 400;
// const HERO_MAX_WIDTH = 454;
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

    sectionWidthWide: {
        maxWidth: "325px",

    },
    sectionTitle: {
        ...COMMON.FONTS.H800,
        color: COMMON.COLORS.N900,
        marginBottom: "8px",
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.FONT_TITLE_3_BOLD,
        },
    },
    sectionBody: {
        ...COMMON.FONTS.P300,
        color: COMMON.COLORS.N800,
        marginBottom: "15px",
        '@media (max-width: 768px)': {
            marginBottom: "0px",

        },
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
        ...COMMON.FONTS.H500,
        marginTop: "10px",
        color: COMMON.COLORS.N900
    },
    featureBio: {
        ...COMMON.FONTS.P100,
        marginTop: "0",
        color: COMMON.COLORS.N800
    },
    footerDefault: {
        ...COMMON.FONTS.FONT_BODY,
        marginBottom: "5px"
    },
    footerBold: {
        ...COMMON.FONTS.FONT_BODY_BOLD,
        marginBottom: "5px"
    },
    footerProfileContainer: {
        display: "inline-block",
        width: "160",
        height: "50px",
        marginRight: "25px"
    },
    footerProfileImgContainer: {
        flex: "0 0 50px", marginRight: "10px", borderRadius: "4px",
        textAlign: "left"
    },
    footerProfileTitle: {
        marginTop: "11px", ...COMMON.FONTS.FONT_FOOTNOTE_BOLD
    },
    footerProfileBody: {
        marginTop: "0", ...COMMON.FONTS.FONT_CAPTION_2, color: COMMON.COLORS.DARK_GREY
    },
    landingContainer: {
        height: "100%",
        background: "url('/img/hero-background.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        '@media (max-width: 768px)': {
            height: "fit-content",
            marginBottom: "65px"
        },
    },
    landingHeroText: {
        maxWidth: "370px",
        margin: "auto",
        marginTop: "calc(50vh - 130px)",
        textAlign: "center",
        '@media (max-width: 768px)': {
            marginTop: "65px",
        },
    },
    landingHeroTitle: {
        ...COMMON.FONTS.H900,
        marginBottom: "15px",
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.FONT_TITLE_2_BOLD,
            marginBottom: "10px"
        },
    },
    landingHeroBody: {
        ...COMMON.FONTS.P300,
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.FONT_FOOTNOTE,
        },
    },
    profileHighlights: {
        paddingTop: "50px",
        marginBottom: "50px",
        '@media (max-width: 768px)': {
            marginBottom: "50px",
        },
    },
    userProfileSectionContainer: {
        paddingTop: "50px",
        marginBottom: "50px",
        '@media (max-width: 768px)': {
            marginBottom: "50px",
        },
    },
    userProfileSection: {
        paddingTop: "50px",
        '@media (max-width: 768px)': {
            paddingTop: "0",
        },
    },
    peerSupportSectionContainer: {
        paddingTop: "50px",
        paddingBottom: "50px",
        '@media (max-width: 768px)': {
            paddingBottom: "50px",
        },
    },
    peerSupportSection: {
        marginLeft: "auto",
        paddingTop: "50px",
        '@media (max-width: 768px)': {
            marginLeft: "0",
            paddingTop: "0",
        },
    },
    findAJobSectionContainer: {
        paddingTop: "50px",
        marginBottom: "50px",
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
        paddingTop: "50px",
        marginBottom: "50px",
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
    },
    ...COMMON.STYLES.GENERAL.NavigationStyles
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

        return (

            <div className={classes.masterContainer}>
                <div className={classes.masterNavContainer}>
                    <NavBar />
                </div>
                <div className={classes.masterBodyContainer}>


                    <div style={{flexDirection: "column", background: COMMON.COLORS.N0}}>
                        <div style={{flex: 1, overflow: "scroll"}}>
                            <div>
                                <div style={{display: "none"}} className={mc(classes.landingContainer)}>
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

                                <div className={mc(classes.landingContainer)} style={{}}>
                                    <div style={{display: "flex", height: "100%"}}>
                                        <div style={{flex: 1}}>
                                            <div>
                                                <div className={mc(classes.marginLeftDefault, classes.landingHeroText)}>
                                                    <div className={mc(classes.landingHeroTitle)}>Finding your dream job doesn’t have to suck</div>
                                                    <div className={mc(classes.landingHeroBody)}>OSIRIS provides you with the community, tools, and data to make better career decisions</div>
                                                    <div style={{marginTop: "25px"}}>
                                                        <StandardButton label={"Join Now"} fullWidth={false} onClick={() => {
                                                            window.location.pathname = `/sign-up`;
                                                        }}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{paddingTop: "50px"}}>
                                    <div className={mc(classes.marginLeftDefault, classes.sectionWidthWide, )}>
                                        <div>
                                            <div className={mc(classes.sectionTitle)}>Connect with a diverse and inclusive community</div>
                                            <div className={mc(classes.sectionBody)}>OSIRIS connects you with your peers, companies, and mentors across industries</div>
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

                                <div className={mc(classes.findAJobSectionContainer)}>
                                    <div style={{display: "flex"}}>
                                        <div style={{flex: 1}}>
                                            <div className={mc(classes.findAJobSection)}>
                                                <div className={mc(classes.paddingLeftDefault)}>
                                                    <div className={mc(classes.sectionWidthWide)}>
                                                        <div className={mc(classes.sectionTitle)}>All the information you need in one place</div>
                                                        <div className={mc(classes.sectionBody)}>Autem quas voluptatem distinctio perferendis repellendus perspiciatis non non quaerat. Mollitia nihil in cupiditate quidem eos quae. Dolorum est ipsum minima ratione rerum est et sint.</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={mc(classes.mobileImageContainer)}>
                                                <img className={mc(classes.mobileImage)} src={"/img/jobs-hero-2.png"}/>
                                            </div>
                                        </div>
                                        <div style={{flex: 1.2}} className={mc(classes.hideOnMobile)}>
                                            <div style={{width: "100%", maxWidth: "559px", marginLeft: "auto"}} className={mc(classes.marginRightDefault)}>
                                                <img style={{width: "100%", }} src={"/img/jobs-hero-2.png"}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={mc(classes.peerSupportSectionContainer)}>
                                    <div style={{display: "flex"}}>
                                        <div style={{flex: 1}} className={mc(classes.hideOnMobile)}>
                                            <div style={{width: "100%",}}>
                                                <img style={{width: "100%", maxWidth: "666px"}} className={mc(classes.marginLeftDefault)} src={"/img/chart-hero.png"}/>
                                            </div>
                                        </div>
                                        <div style={{flex: 1}}>
                                            <div>
                                                <div className={mc(classes.marginRightDefault)}>
                                                    <div className={mc(classes.sectionWidthWide, classes.peerSupportSection)}>
                                                        <div className={mc(classes.sectionTitle)}>Find companies that reflect you and your values</div>
                                                        <div className={mc(classes.sectionBody)}>Autem quas voluptatem distinctio perferendis repellendus perspiciatis non non quaerat. Mollitia nihil in cupiditate quidem eos quae. Dolorum est ipsum minima ratione rerum est et sint.</div>
                                                    </div>
                                                </div>
                                                <div className={mc(classes.mobileImageContainer)}>
                                                    <img className={mc(classes.mobileImage)} src={"/img/chart-hero.png"}/>
                                                </div>
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
                                                        <div className={mc(classes.sectionTitle)}>A profile that actually represents you</div>
                                                        <div className={mc(classes.sectionBody)}>Autem quas voluptatem distinctio perferendis repellendus perspiciatis non non quaerat. Mollitia nihil in cupiditate quidem eos quae. Dolorum est ipsum minima ratione rerum est et sint.</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={mc(classes.mobileImageContainer)}>
                                                <img className={mc(classes.mobileImage)} src={"/img/profile-hero-2.png"}/>
                                            </div>
                                        </div>
                                        <div style={{flex: 1.2}} className={mc(classes.hideOnMobile)}>
                                            <div className={mc(classes.marginRightDefault)} style={{maxWidth: "637px"}}>
                                                <div style={{width: "100%", textAlign: "center"}}>
                                                    <img style={{width: "100%", maxWidth: "666px", margin: "auto"}} src={"/img/profile-hero-2.png"}/>
                                                </div>
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
                                                        <div className={mc(classes.sectionTitle)}>No more spreadsheets. Organize your job search</div>
                                                        <div className={mc(classes.sectionBody)}>Autem quas voluptatem distinctio perferendis repellendus perspiciatis non non quaerat. Mollitia nihil in cupiditate quidem eos quae. Dolorum est ipsum minima ratione rerum est et sint.</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={mc(classes.mobileImageContainer)}>
                                                <img className={mc(classes.mobileImage)} src={"/img/saved-hero.png"}/>
                                            </div>
                                        </div>
                                        <div style={{flex: 1.2}} className={mc(classes.hideOnMobile)}>
                                            <div className={mc(classes.marginRightDefault)} style={{maxWidth: "637px"}}>
                                                <div style={{width: "100%", textAlign: "center"}}>
                                                    <img style={{width: "100%", maxWidth: "666px", margin: "auto"}} src={"/img/saved-hero.png"}/>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>




                                <div className={mc(classes.applySectionContainer)}>
                                    <div style={{textAlign: "center"}}>
                                        <div style={{maxWidth: "301px", margin: "auto"}}>
                                            <div className={mc(classes.landingHeroTitle)}>Join the OSIRIS community today</div>
                                        </div>
                                        <div style={{marginTop: "50px", marginBottom: "50px"}}>
                                            <div className={classes.footerProfileContainer}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/Instagram post - 1.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Kara Hermiston</div>
                                                        <div className={classes.footerProfileBody}>Bachelor’s Degree</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={classes.footerProfileContainer}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/Instagram post - 2.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Kara Hermiston</div>
                                                        <div className={classes.footerProfileBody}>Bachelor’s Degree</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={classes.footerProfileContainer}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/Instagram story - 3.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Kara Hermiston</div>
                                                        <div className={classes.footerProfileBody}>Bachelor’s Degree</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={classes.footerProfileContainer}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/Instagram story - 4.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Kara Hermiston</div>
                                                        <div className={classes.footerProfileBody}>Bachelor’s Degree</div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div style={{marginBottom: "50px"}}>
                                            <div className={classes.footerProfileContainer}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/Instagram story - 3.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Kara Hermiston</div>
                                                        <div className={classes.footerProfileBody}>Bachelor’s Degree</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={classes.footerProfileContainer}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/Instagram story - 5.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Kara Hermiston</div>
                                                        <div className={classes.footerProfileBody}>Bachelor’s Degree</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={classes.footerProfileContainer}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/Instagram story - 6.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Kara Hermiston</div>
                                                        <div className={classes.footerProfileBody}>Bachelor’s Degree</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={classes.footerProfileContainer}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/Instagram post - 2.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Kara Hermiston</div>
                                                        <div className={classes.footerProfileBody}>Bachelor’s Degree</div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div style={{marginBottom: "100px"}}>
                                            <StandardButton label={"Join Now"} fullWidth={false} onClick={() => {
                                                window.location.pathname = `/sign-up`;
                                            }}/>
                                        </div>
                                    </div>
                                </div>


                                <div style={{display: "none", background: COMMON.COLORS.OSIRIS_BLACK, paddingTop: "75px", paddingBottom: "75px", color: COMMON.COLORS.COLOR_WHITE, ...COMMON.FONTS.FONT_BODY}} className={mc(classes.paddingLeftDefault, classes.paddingRightDefault, classes.hideOnMobile)}>
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
                </div>
            </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(Home)));

