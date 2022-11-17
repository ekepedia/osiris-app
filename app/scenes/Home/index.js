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
import TrackingService from "../../services/TrackingService";


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
        maxWidth: "450px",
    },
    sectionSubTitle: {
        ...COMMON.FONTS.H200,
        color: COMMON.COLORS.B400,
        textTransform: "uppercase",
        marginBottom: "2px",
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.H100,
        },
    },
    sectionTitle: {
        ...COMMON.FONTS.H800,
        color: COMMON.COLORS.N900,
        marginBottom: "15px",
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.H600,
        },
    },
    sectionBody: {
        ...COMMON.FONTS.P300,
        color: COMMON.COLORS.N800,
        marginBottom: "50px",
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.P200,
            marginBottom: "0px",

        },
    },
    sectionPointContainer: {
        display: "flex"
    },
    sectionPoint: {
        ...COMMON.FONTS.P200,
        color: COMMON.COLORS.N800,
        marginBottom: "0px",
        '& span div': {
            marginBottom: "8px",
            fontSize: "16px"
        },
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.P200,
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
        background: "none",
        borderRadius: "6px"
    },
    featureImageTall: {
        height: "300px",

        width: "100%",
        background: "none",
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
        marginRight: "25px",
        marginBottom: "50px",
        '@media (max-width: 768px)': {
            marginRight: "10px",
        },
    },
    footerProfileImgContainer: {
        flex: "0 0 50px",
        marginRight: "10px",
        borderRadius: "4px",
        overflow: "hidden",
        textAlign: "left"
    },
    footerProfileTitle: {
        textAlign: "left",
        marginTop: "11px", ...COMMON.FONTS.FONT_FOOTNOTE_BOLD
    },
    footerProfileBody: {
        textAlign: "left",
        whiteSpace: "nowrap",
        marginTop: "0",
        ...COMMON.FONTS.FONT_CAPTION_2,
        color: COMMON.COLORS.DARK_GREY
    },
    landingContainer: {
        height: "100%",
        background: "url('/img/hero-background.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        '@media (max-width: 768px)': {
            height: "516px",
            backgroundImage: "url('/img/hero-background-mobile.png')",
            backgroundSize: "contain",
            margin: "25px 20px",
        },
    },
    landingHeroText: {
        maxWidth: "370px",
        margin: "auto",
        marginTop: "calc(50vh - 130px)",
        textAlign: "center",
        '@media (max-width: 768px)': {
            marginTop: "161px",
            maxWidth: "270px",

        },
    },
    landingHeroTitle: {
        ...COMMON.FONTS.H900,
        marginBottom: "15px",
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.H800,
            marginBottom: "15px"
        },
    },
    landingHeroBody: {
        ...COMMON.FONTS.P300,
        '@media (max-width: 768px)': {
            ...COMMON.FONTS.P200,
        },
    },
    profileHighlights: {
        paddingTop: "0px",
        marginBottom: "50px",
        '@media (max-width: 768px)': {
            marginBottom: "50px",
            paddingTop: "50px",
        },
    },
    userProfileSectionContainer: {
        paddingTop: "100px",
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
        paddingTop: "100px",
        paddingBottom: "50px",
        '@media (max-width: 768px)': {
            paddingBottom: "0",
        },
    },
    peerSupportSection: {
        marginLeft: "auto",
        // paddingTop: "50px",
        '@media (max-width: 768px)': {
            marginLeft: "0",
            paddingTop: "0",
        },
    },
    findAJobSectionContainer: {
        paddingTop: "100px",
        marginBottom: "50px",
        '@media (max-width: 768px)': {
            paddingTop: "50px",
            marginBottom: "0px",
        },
    },
    findAJobSection: {
        paddingTop: "0",
        '@media (max-width: 768px)': {
            paddingTop: "0",
        },
    },
    applySectionContainer: {
        paddingTop: "100px",
        marginBottom: "50px",
        '@media (max-width: 768px)': {
            padding: "0 10px",
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
    ...COMMON.STYLES.GENERAL.NavigationStyles,
    ...COMMON.STYLES.GENERAL.AlignmentStyles
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
                                                        <StandardButton label={"Request Invite"} fullWidth={false} onClick={() => {
                                                            window.open("https://osiris-works.typeform.com/sign-up", "_blank");
                                                            TrackingService.trackClick({page: "home", sub_page: "hero", value: "Request Invite"});
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
                                            <div className={mc(classes.sectionSubTitle)}>COMMUNITY - coming soon</div>
                                            <div className={mc(classes.sectionTitle)}>Join an inclusive community</div>
                                            <div className={mc(classes.sectionBody)}>OSIRIS connects you with your peers, companies, and mentors across industries</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={mc(classes.profileHighlights)}>
                                    <div style={{width: "100%", overflow: "scroll"}}>
                                        <div className={mc(classes.marginLeftDefault)} style={{width: "fit-content", whiteSpace: "nowrap"}}>


                                            <div className={mc(classes.featureContainerWide)}>
                                                <div className={mc(classes.featureImage)}>
                                                    <CoverImageHolder url={"/img/cami-hero.png"}/>
                                                </div>
                                                <div className={mc(classes.featureName)}>Cami Á.</div>
                                                <div className={mc(classes.featureBio)}>Founder & Entrepreneur</div>
                                            </div>
                                            <div className={mc(classes.featureContainer)}>
                                                <div className={mc(classes.featureImageTall)}>
                                                    <CoverImageHolder url={"/img/alex-hero.png"}/>
                                                </div>
                                                <div className={mc(classes.featureName)}>Alexandra K.</div>
                                                <div className={mc(classes.featureBio)}>Associate Strategy Officer</div>
                                            </div>

                                            <div className={mc(classes.featureContainerWide)}>
                                                <div className={mc(classes.featureImage)}>
                                                    <CoverImageHolder url={"/img/tatum-hero.png"}/>
                                                </div>
                                                <div className={mc(classes.featureName)}>Tatum D.</div>
                                                <div className={mc(classes.featureBio)}>Brand Experience Manager</div>
                                            </div>
                                            <div className={mc(classes.featureContainer)}>
                                                <div className={mc(classes.featureImageTall)}>
                                                    <CoverImageHolder url={"/img/will-hero.png"}/>
                                                </div>
                                                <div className={mc(classes.featureName)}>Will D.</div>
                                                <div className={mc(classes.featureBio)}>Art Director Lev Diamond Studio & Designer Media Monks</div>
                                            </div>

                                            <div className={mc(classes.featureContainerWide)}>
                                                <div className={mc(classes.featureImage)}>
                                                    <CoverImageHolder url={"/img/melisa-hero.png"}/>
                                                </div>
                                                <div className={mc(classes.featureName)}>Melisa S.</div>
                                                <div className={mc(classes.featureBio)}>Product Marketing Manager</div>
                                            </div>
                                            <div className={mc(classes.featureContainer)}>
                                                <div className={mc(classes.featureImageTall)}>
                                                    <CoverImageHolder url={"/img/josh-hero.png"}/>
                                                </div>
                                                <div className={mc(classes.featureName)}>Josh C.</div>
                                                <div className={mc(classes.featureBio)}>Cinematographer & Photographer</div>
                                            </div>
                                            <div className={mc(classes.featureContainer)} style={{display: "none"}}>
                                                <div className={mc(classes.featureImageTall)}>
                                                    <CoverImageHolder url={"/img/kara-hero.png"}/>
                                                </div>
                                                <div className={mc(classes.featureName)}>Kara S.</div>
                                                <div className={mc(classes.featureBio)}>Associate Blackstone</div>
                                            </div>


                                            <div className={mc(classes.featureContainerWide)}>
                                                <div className={mc(classes.featureImage)}>
                                                    <CoverImageHolder url={"/img/eden-hero.png"}/>
                                                </div>
                                                <div className={mc(classes.featureName)}>Eden B.</div>
                                                <div className={mc(classes.featureBio)}>Digital Marketing Specialist</div>
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
                                                        <div className={mc(classes.sectionSubTitle)}>Jobs</div>
                                                        <div className={mc(classes.sectionTitle)}>Stop guessing. Understand the job before you apply</div>
                                                        <div className={mc(classes.sectionBody)}>OSIRIS helps you find exciting job opportunities, from fast-growing early-stage startups to nonprofits to the major corporations you know and love</div>
                                                        <div className={mc(classes.hideOnMobile, classes.sectionPointContainer)}>
                                                            <div style={{flex: 1, paddingRight: "25px"}}>
                                                                <div className={mc(classes.sectionPoint)}>
                                                                    <span>
                                                                        <div>
                                                                            <i className="fa-solid fa-magnifying-glass"/>
                                                                        </div>
                                                                    </span>
                                                                    <div>Recommendations based on your profile and priorities</div>
                                                                </div>
                                                            </div>
                                                            <div style={{flex: 1, paddingRight: "25px"}}>
                                                                <div className={mc(classes.sectionPoint)}>
                                                                    <span>
                                                                        <div>
                                                                            <i className="fa-solid fa-briefcase"/>
                                                                        </div>
                                                                    </span>
                                                                    <div>Insights into the actual day-to-day job experience</div>
                                                                </div>
                                                            </div>
                                                            <div style={{flex: 1, paddingRight: "0px"}}>
                                                                <div className={mc(classes.sectionPoint)}>
                                                                    <span>
                                                                        <div>
                                                                            <i className="fa-solid fa-dollar-sign"/>
                                                                        </div>
                                                                    </span>
                                                                    <div>Salary estimates before you even apply to a job</div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={mc(classes.mobileImageContainer)}>
                                                <img className={mc(classes.mobileImage)} src={"/img/jobs-hero-2.png"}/>
                                            </div>
                                        </div>
                                        <div style={{flex: 1.2}} className={mc(classes.hideOnMobile)}>
                                            <div style={{width: "100%", maxWidth: "559px", marginLeft: "auto"}} className={mc(classes.marginRightDefault)}>
                                                <div className={classes.centerAlignContainerFill}>
                                                    <div className={classes.centerAlignObject} style={{width: "100%", maxWidth: "377px",}}>
                                                        <img style={{width: "100%", maxWidth: "377px", borderRadius: "7px", margin: "auto", boxShadow: "#E5E5E5 0px 31px 60px"}} src={"/img/jobs-hero-2.png"}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={mc(classes.peerSupportSectionContainer)}>
                                    <div style={{display: "flex"}}>
                                        <div style={{flex: 1}} className={mc(classes.hideOnMobile)}>
                                            <div style={{width: "100%", maxWidth: "432px"}} className={mc(classes.marginLeftDefault)}>
                                                <div className={classes.centerAlignContainerFill}>
                                                    <div className={classes.centerAlignObject} style={{width: "100%", maxWidth: "432px",}}>
                                                        <img style={{width: "100%", maxWidth: "432px", margin: "auto"}} src={"/img/chart-hero.png"}/>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div style={{flex: 1}}>
                                            <div>
                                                <div className={mc(classes.marginRightDefault)}>
                                                    <div className={mc(classes.sectionWidthWide, classes.peerSupportSection)}>
                                                        <div className={mc(classes.sectionSubTitle)}>Companies</div>
                                                        <div className={mc(classes.sectionTitle)}>Don’t settle. Find a company that reflects you and your values</div>
                                                        <div className={mc(classes.sectionBody)}>Osiris provides the tools and information you need to ensure that you join a company that embodies what you care about most</div>
                                                        <div className={mc(classes.hideOnMobile, classes.sectionPointContainer)}>
                                                            <div style={{flex: 1, paddingRight: "25px"}}>
                                                                <div className={mc(classes.sectionPoint)}>
                                                                    <span>
                                                                        <div>
                                                                            <i className="fa-solid fa-chart-pie"/>
                                                                        </div>
                                                                    </span>
                                                                    <div>Accurate ethnic representation data for each company</div>
                                                                </div>
                                                            </div>
                                                            <div style={{flex: 1, paddingRight: "25px"}}>
                                                                <div className={mc(classes.sectionPoint)}>
                                                                    <span>
                                                                        <div>
                                                                            <i className="fa-solid fa-user-group"/>
                                                                        </div>
                                                                    </span>
                                                                    <div>Understand company gender representation</div>
                                                                </div>
                                                            </div>
                                                            <div style={{flex: 1, paddingRight: "0px"}}>
                                                                <div className={mc(classes.sectionPoint)}>
                                                                    <span>
                                                                        <div>
                                                                            <i className="fa-solid fa-award"/>
                                                                        </div>
                                                                    </span>
                                                                    <div>Benchmark each company against one another</div>
                                                                </div>

                                                            </div>
                                                        </div>

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
                                                        <div className={mc(classes.sectionSubTitle)}>OSIRIS profile</div>
                                                        <div className={mc(classes.sectionTitle)}>A professional profile that actually represents you and your work</div>
                                                        <div className={mc(classes.sectionBody)}>Showcase your work on your OSIRIS profile. As you build your profile it will be easier to find peers and jobs</div>
                                                        <div className={mc(classes.hideOnMobile, classes.sectionPointContainer)}>
                                                            <div style={{flex: 1, paddingRight: "25px"}}>
                                                                <div className={mc(classes.sectionPoint)}>
                                                                    <span>
                                                                        <div>
                                                                            <i className="fa-solid fa-user"/>
                                                                        </div>
                                                                    </span>
                                                                    <div>Aggregate all your work into a single portfolio</div>
                                                                </div>
                                                            </div>
                                                            <div style={{flex: 1, paddingRight: "25px"}}>
                                                                <div className={mc(classes.sectionPoint)}>
                                                                    <span>
                                                                        <div>
                                                                            <i className="fa-solid fa-link"/>
                                                                        </div>
                                                                    </span>
                                                                    <div>Share you profile across platforms with a unique link</div>
                                                                </div>
                                                            </div>
                                                            <div style={{flex: 1, paddingRight: "0px"}}>
                                                                <div className={mc(classes.sectionPoint)}>
                                                                    <span>
                                                                        <div>
                                                                            <i className="fa-brands fa-linkedin"/>
                                                                        </div>
                                                                    </span>
                                                                    <div>Import your data directly from LinkedIn</div>
                                                                </div>

                                                            </div>
                                                        </div>

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

                                <div className={mc(classes.userProfileSectionContainer)} style={{paddingTop: 0}}>
                                    <div style={{display: "flex"}}>

                                        <div style={{flex: 1.2}} className={mc(classes.hideOnMobile)}>
                                            <div style={{width: "100%", maxWidth: "490px"}} className={mc(classes.marginLeftDefault)}>
                                                <div className={classes.centerAlignContainerFill}>
                                                    <div className={classes.centerAlignObject} style={{width: "100%", maxWidth: "490px",}}>
                                                        <img style={{width: "100%", maxWidth: "490px", margin: "auto"}} src={"/img/saved-hero.png"}/>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*<div className={mc(classes.marginLeftDefault)} style={{maxWidth: "637px"}}>*/}
                                            {/*    <div style={{width: "100%", textAlign: "center"}}>*/}
                                            {/*        <img style={{width: "100%", maxWidth: "666px", margin: "auto"}} src={"/img/saved-hero.png"}/>*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                        </div>
                                        <div style={{flex: 1}}>
                                            <div className={mc(classes.userProfileSection)} style={{paddingTop: 0}}>
                                                <div className={mc(classes.marginRightDefault, classes.sectionWidthWide,)}>
                                                    <div>
                                                        <div className={mc(classes.sectionSubTitle)}>JOB SEARCH TRACKER</div>
                                                        <div className={mc(classes.sectionTitle)}>No more spreadsheets. Organize your search to find your dream job</div>
                                                        <div className={mc(classes.sectionBody)}>OSIRIS helps you organize your job search. We keep track of the details that matter most to you so that you don’t have to rely on messy spreadsheets</div>
                                                        <div className={mc(classes.hideOnMobile, classes.sectionPointContainer)}>
                                                            <div style={{flex: 1, paddingRight: "25px"}}>
                                                                <div className={mc(classes.sectionPoint)}>
                                                                    <span>
                                                                        <div>
                                                                            <i className="fa-solid fa-bookmark"/>
                                                                        </div>
                                                                    </span>
                                                                    <div>Save jobs from our job board and across the web</div>
                                                                </div>
                                                            </div>
                                                            <div style={{flex: 1, paddingRight: "25px"}}>
                                                                <div className={mc(classes.sectionPoint)}>
                                                                    <span>
                                                                        <div>
                                                                            <i className="fa-solid fa-square-pen"/>
                                                                        </div>
                                                                    </span>
                                                                    <div>Keep track of notes and tasks for each saved opportunity</div>
                                                                </div>
                                                            </div>
                                                            <div style={{flex: 1, paddingRight: "0px"}}>
                                                                <div className={mc(classes.sectionPoint)}>
                                                                    <span>
                                                                        <div>
                                                                            <i className="fa-solid fa-envelope"/>
                                                                        </div>
                                                                    </span>
                                                                    <div>Receive reminders and never miss another deadline</div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={mc(classes.mobileImageContainer)}>
                                                <img className={mc(classes.mobileImage)} src={"/img/saved-hero.png"}/>
                                            </div>

                                        </div>
                                    </div>
                                </div>




                                <div className={mc(classes.applySectionContainer)}>
                                    <div style={{textAlign: "center"}}>
                                        <div style={{maxWidth: "301px", margin: "auto"}}>
                                            <div className={mc(classes.sectionTitle)}>Join the OSIRIS community today</div>
                                        </div>
                                        <div style={{marginTop: "50px",}}>
                                            <div className={classes.footerProfileContainer}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/cami-hero.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Cami Á.</div>
                                                        <div className={classes.footerProfileBody}>Entrepreneur</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={classes.footerProfileContainer}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/alex-hero.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Alexandra K.</div>
                                                        <div className={classes.footerProfileBody}>Strategy Officer</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={classes.footerProfileContainer}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/will-hero.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Will D.</div>
                                                        <div className={classes.footerProfileBody}>Art Director</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={classes.footerProfileContainer} style={{marginRight: 0}}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/tatum-hero.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Tatum D.</div>
                                                        <div className={classes.footerProfileBody}>Brand Manager</div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                        <div style={{marginBottom: "0px"}}>
                                            <div className={classes.footerProfileContainer}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/melisa-hero.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Melisa S.</div>
                                                        <div className={classes.footerProfileBody}>Marketing Manager</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={classes.footerProfileContainer} style={{display: "none"}}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/kara-hero.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Kara S.</div>
                                                        <div className={classes.footerProfileBody}>Associate Blackstone</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={classes.footerProfileContainer} >
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/eden-hero.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Eden B.</div>
                                                        <div className={classes.footerProfileBody}>Marketing Specialist</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={classes.footerProfileContainer} style={{marginRight: 0}}>
                                                <div style={{display: "flex", height: "100%"}}>
                                                    <div className={classes.footerProfileImgContainer}>
                                                        <CoverImageHolder url={"/img/josh-hero.png"}/>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                        <div className={classes.footerProfileTitle}>Josh C.</div>
                                                        <div className={classes.footerProfileBody}>Cinematographer</div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div style={{marginBottom: "100px"}}>
                                            <StandardButton label={"Request Invite"} fullWidth={false} onClick={() => {
                                                TrackingService.trackClick({page: "home", sub_page: "footer", value: "Request Invite"});
                                                window.open("https://osiris-works.typeform.com/sign-up", "_blank");
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

