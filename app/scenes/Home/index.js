import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';
import { COLOR_WHITE } from "../../common/colors";

import COMMON from "../../common/index";
import { mc } from "../../common/helpers";


import OnBoardingModal from "../../components/OnBoardingModal"
import {FONT_LARGE_TITLE_BOLD} from "../../common/fonts";
import NavBar from "../../components/NavBar";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    section: {
        padding: "180px",
        '@media (max-width: 768px)': {
            padding: "180px",
        },
    },
    sectionLeftPadding: {
        paddingLeft: "180px"
    },
    sectionWidthWide: {
        maxWidth: "415px"
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
        marginBottom: "15px"
    },
    sectionBody: {
        ...COMMON.FONTS.FONT_BODY,
        marginBottom: "15px"
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
        marginTop: "10px"
    },
    featureBio: {
        ...COMMON.FONTS.FONT_CAPTION_1,
        marginTop: "2px"
    },
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
                        <div style={{height: "100%"}}>
                            <div style={{display: "flex", height: "100%"}}>
                                <div style={{flex: 1}} className={mc(classes.sectionLeftPadding)}>
                                    <div style={{maxWidth: "454px", marginTop: "220px"}}>
                                        <div style={{...COMMON.FONTS.FONT_LARGE_TITLE_BOLD, marginBottom: "15px"}}>The professional network built for the multi-hyphenate generation</div>
                                        <div style={{...COMMON.FONTS.FONT_TITLE_3}}>OSIRIS is redefining what a social and career network can and should be by redefining the professional for today’s generation</div>
                                        <div style={{marginTop: "25px"}}>
                                            <div style={{...COMMON.STYLES.STYLE_BUTTON_HEADLINE}} onClick={() => (this.setOnBoardingModal(true))}>Claim your profile</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{flex: 1}}>
                                    <div style={{width: "100%", textAlign: "center"}}>
                                        <img style={{height: "100%", width: "100%"}} src={"/img/landing-hero.png"}/>

                                    </div>
                                </div>

                            </div>

                        </div>




                        <div style={{ width: "calc(100% - 30px)", maxWidth: "950px", margin: "auto",}}>
                            <div style={{display: "flex"}}>
                                <div style={{flex: 1}}>
                                    <div style={{
                                        maxWidth: "370px",
                                        background: "pink"
                                    }}>
                                        SECTION 1
                                    </div>
                                </div>
                                <div style={{flex: 1}}>
                                    <div style={{
                                        maxWidth: "370px",
                                        textAlign: "right",
                                        marginLeft: "auto",
                                        background: "purple"

                                    }}>
                                        SECTION 2
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{display: "flex"}}>
                            <div style={{flex: 1}}>
                                <div style={{
                                    paddingLeft: "calc(100% - 950px/2)",
                                    background: "blue",
                                }}>
                                    SECTION 1
                                </div>
                            </div>
                            <div style={{flex: 1}}>
                                <div style={{
                                    background: "red"
                                }}>
                                    SECTION 2
                                </div>
                            </div>
                        </div>

                        <div style={{paddingTop: "50px"}}>
                            <div className={mc(classes.sectionLeftPadding)}>
                                <div className={mc(classes.sectionWidthWide)}>
                                    <div className={mc(classes.sectionHeader)}>Community</div>
                                    <div className={mc(classes.sectionTitle)}>Connect with a diverse and inclusive community</div>
                                    <div className={mc(classes.sectionBody)}>OSIRIS connects you with your peers, companies, and mentors across industries irrespective of your background</div>
                                </div>
                            </div>
                        </div>
                        <div style={{paddingTop: "50px", marginBottom: "100px"}}>
                            <div style={{width: "100%", overflow: "scroll"}}>
                                <div className={mc(classes.sectionLeftPadding)} style={{width: "fit-content", whiteSpace: "nowrap"}}>
                                    <div className={mc(classes.featureContainer)}>
                                        <div className={mc(classes.featureImage)}/>
                                        <div className={mc(classes.featureName)}>Jason Mayden</div>
                                        <div className={mc(classes.featureBio)}>President Fear of God Athletics & Founder Trillicon Vally</div>
                                    </div>
                                    <div className={mc(classes.featureContainer)}>
                                        <div className={mc(classes.featureImageTall)}/>
                                        <div className={mc(classes.featureName)}>Jason Mayden</div>
                                        <div className={mc(classes.featureBio)}>President Fear of God Athletics & Founder Trillicon Vally</div>
                                    </div>
                                    <div className={mc(classes.featureContainer)}>
                                        <div className={mc(classes.featureImage)}/>
                                        <div className={mc(classes.featureName)}>Jason Mayden</div>
                                        <div className={mc(classes.featureBio)}>President Fear of God Athletics & Founder Trillicon Vally</div>
                                    </div>
                                    <div className={mc(classes.featureContainer)}>
                                        <div className={mc(classes.featureImageTall)}/>
                                        <div className={mc(classes.featureName)}>Jason Mayden</div>
                                        <div className={mc(classes.featureBio)}>President Fear of God Athletics & Founder Trillicon Vally</div>
                                    </div>
                                    <div className={mc(classes.featureContainerWide)}>
                                        <div className={mc(classes.featureImage)}/>
                                        <div className={mc(classes.featureName)}>Jason Mayden</div>
                                        <div className={mc(classes.featureBio)}>President Fear of God Athletics & Founder Trillicon Vally</div>
                                    </div>
                                    <div className={mc(classes.featureContainer)}>
                                        <div className={mc(classes.featureImageTall)}/>
                                        <div className={mc(classes.featureName)}>Jason Mayden</div>
                                        <div className={mc(classes.featureBio)}>President Fear of God Athletics & Founder Trillicon Vally</div>
                                    </div>
                                    <div className={mc(classes.featureContainer)}>
                                        <div className={mc(classes.featureImage)}/>
                                        <div className={mc(classes.featureName)}>Jason Mayden</div>
                                        <div className={mc(classes.featureBio)}>President Fear of God Athletics & Founder Trillicon Vally</div>
                                    </div>
                                    <div className={mc(classes.featureContainer)}>
                                        <div className={mc(classes.featureImageTall)}/>
                                        <div className={mc(classes.featureName)}>Jason Mayden</div>
                                        <div className={mc(classes.featureBio)}>President Fear of God Athletics & Founder Trillicon Vally</div>
                                    </div>
                                    <div className={mc(classes.featureContainerWide)}>
                                        <div className={mc(classes.featureImage)}/>
                                        <div className={mc(classes.featureName)}>Jason Mayden</div>
                                        <div className={mc(classes.featureBio)}>President Fear of God Athletics & Founder Trillicon Vally</div>
                                    </div>

                                </div>

                            </div>


                        </div>

                        <div style={{paddingTop: "50px", marginBottom: "100px"}}>
                            <div style={{display: "flex"}}>
                                <div style={{flex: 1}}>
                                    <div style={{paddingTop: "243px"}}>
                                        <div className={mc(classes.sectionLeftPadding)}>
                                            <div className={mc(classes.sectionWidthWide)}>
                                                <div className={mc(classes.sectionHeader)}>User Profile</div>
                                                <div className={mc(classes.sectionTitle)}>Create your portfolio link in minutes</div>
                                                <div className={mc(classes.sectionBody)}>Your portfolio is as unique as you are. Connect your socials, website, store, videos, music, podcast, events, and more. Even share it, helping people find all your information in one place.</div>
                                                <div className={mc(classes.sectionCTA)}>Design Your Portfolio <span><i className="fa-solid fa-arrow-right"></i></span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{flex: 1}}>
                                    <div style={{width: "100%", textAlign: "center"}}>
                                        <img style={{width: "100%", maxWidth: "666px", margin: "auto"}} src={"/img/profile-hero.png"}/>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div style={{paddingTop: "50px", paddingBottom: "100px", background: COMMON.COLORS.OSIRIS_GREEN, color: COMMON.COLORS.COLOR_WHITE}}>
                            <div style={{display: "flex"}}>
                                <div style={{flex: 1}}>
                                    <div style={{width: "100%", textAlign: "center"}}>
                                        <img style={{width: "100%", maxWidth: "666px", margin: "auto"}} src={"/img/question-hero.png"}/>
                                    </div>
                                </div>
                                <div style={{flex: 1}}>
                                    <div style={{paddingTop: "243px"}}>
                                        <div className={mc(classes.sectionLeftPadding)}>
                                            <div className={mc(classes.sectionWidthWide)}>
                                                <div className={mc(classes.sectionHeader)}>PEER & MENTOR SUPPORT</div>
                                                <div className={mc(classes.sectionTitle)}>Connect with your community</div>
                                                <div className={mc(classes.sectionBody)}>We verify every user before allowing them to join OSIRIS. As a result, users can post questions anonymously, allowing for authentic insights, feedback, and advice from community members</div>
                                                <div className={mc(classes.sectionCTA)}>Ask a question <span><i className="fa-solid fa-arrow-right"></i></span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div style={{paddingTop: "100px", marginBottom: "100px"}}>
                            <div style={{display: "flex"}}>
                                <div style={{flex: 1}}>
                                    <div style={{paddingTop: "93px"}}>
                                        <div className={mc(classes.sectionLeftPadding)}>
                                            <div className={mc(classes.sectionWidthWide)}>
                                                <div className={mc(classes.sectionHeader)}>ACCESS TO JOBS</div>
                                                <div className={mc(classes.sectionTitle)}>Find a job that represents you</div>
                                                <div className={mc(classes.sectionBody)}>OSIRIS allows you to find opportunities with companies that represent you. Use 10+ unique filters to sort through roles and get access to DE&I stats before applying</div>
                                                <div className={mc(classes.sectionCTA)}>Find A Job <span><i className="fa-solid fa-arrow-right"></i></span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{flex: 1}}>
                                    <div style={{width: "100%", textAlign: "center"}}>
                                        <img style={{width: "100%", maxWidth: "666px", margin: "auto"}} src={"/img/jobs-hero.png"}/>
                                    </div>
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

