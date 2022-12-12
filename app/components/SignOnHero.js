import React from "react";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import COMMON from "../common/index";
import {mc} from "../common/helpers";
import CoverImageHolder from "./CoverImageHolder";

const Styles = {
    container: {
        padding: "0",
        background: COMMON.COLORS.N0,
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    ...COMMON.STYLES.GENERAL.InputStyles,
    headerTitle: {
        ...COMMON.FONTS.FONT_TITLE_2_BOLD,
        marginBottom: "20px",
        textAlign: "center",
        color: COMMON.COLORS.OSIRIS_GREEN
    },
    subContainer: {
        maxWidth: "330px",
        margin: "auto",
    },
    buttonContainer: {
        marginTop: "20px"
    },
    disclaimer: {
        ...COMMON.FONTS.FONT_CAPTION_2,
        color: COMMON.COLORS.DARK_GREY,
        maxWidth: "241px",
        margin: "auto",
        marginTop: "20px",
        textAlign: "center"
    },
    disclaimerBold: {
        extend: "disclaimer",
        ...COMMON.FONTS.FONT_CAPTION_2_BOLD,
    },
    companyProfileContainer: {
        height: "40px",
        marginRight: "25px",
        color: COMMON.COLORS.N0,
        marginBottom: "25px"
    },
    companyProfileImgContainer: {
        flex: "0 0 40px",
        marginRight: "10px",
        borderRadius: "4px",
        textAlign: "left"
    },
    companyProfileTitle: {
        marginTop: "0",
        ...COMMON.FONTS.H500
    },
    companyProfileBody: {
        marginTop: "0",
        ...COMMON.FONTS.H300,
    },
    ...COMMON.STYLES.GENERAL.NavigationStyles,
    ...COMMON.STYLES.GENERAL.AlignmentStyles,

};

let companies = [
    {
        company: "Google",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png",
        role: "Software Engineer"
    },
    {
        company: "Apple",
        logo: "/img/apple-logo.png",
        role: "UX Designer"
    }
];

let urls = [
    "/img/google-hero.png",
    "/img/apple-hero.png",
    // "https://images.unsplash.com/photo-1588741068086-caf60b2ff8ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
    // "/img/airbnb-hero.png",
]

class SignOnHero extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            index: 0
        };
    }

    componentDidMount() {

    }

    setNext() {
        if (this.state.index >= urls.length -1) {
            this.setState({
                index: 0
            });
        } else {
            this.setState({
                index: this.state.index + 1
            });
        }
    }

    setBack() {
        if (this.state.index <= 0) {
            this.setState({
                index: urls.length -1
            });
        } else {
            this.setState({
                index: this.state.index - 1
            });
        }
    }

    render() {
        let { classes, client, match: { params } } = this.props;



        return (
            <div style={{
                position: "relative",
                backgroundImage: `url('${urls[this.state.index]}')`,
                backgroundPosition: "center",
                height: "100%",
                width: "100%",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                transition: "all 0.25s"
            }}>
                <div style={{position: "absolute", width: "100%", padding: "35px", bottom: "0", textShadow: "black 1px 1px 3px"}}>
                    <div style={{display: "flex"}}>
                        <div style={{flex: 1}}>
                            <div className={classes.companyProfileContainer}>
                                <div style={{display: "flex", height: "100%"}}>
                                    <div className={classes.companyProfileImgContainer}>
                                        <CoverImageHolder url={companies[this.state.index].logo}/>
                                    </div>
                                    <div style={{flex: 1}}>
                                        <div className={classes.companyProfileTitle}>{companies[this.state.index].company}</div>
                                        <div className={classes.companyProfileBody}>{companies[this.state.index].role}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{flex: 1}}>
                            <div style={{paddingRight: "0", textAlign: "right"}}>
                                <div onClick={() => {this.setBack()}} style={{cursor: "pointer", display: "inline-block", marginRight: "10px", color: COMMON.COLORS.N0, height: "46px", width: "46px", borderRadius: "100%", border: `1px solid ${COMMON.COLORS.N0}`}}>
                                    <div className={classes.centerAlignContainerFill}>
                                        <div className={classes.centerAlignObject} style={{fontSize: "14px"}}>
                                            <i className="fa-solid fa-arrow-left"/>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={() => {this.setNext()}}  style={{cursor: "pointer", display: "inline-block", color: COMMON.COLORS.N0, height: "46px", width: "46px", borderRadius: "100%", border: `1px solid ${COMMON.COLORS.N0}`}}>
                                    <div className={classes.centerAlignContainerFill}>
                                        <div className={classes.centerAlignObject} style={{fontSize: "14px"}}>
                                            <i className="fa-solid fa-arrow-right"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*<div style={{...COMMON.FONTS.H800, color: COMMON.COLORS.N0, paddingRight: "35px", marginBottom: "50px", display: "none"}}>*/}
                    {/*    Google's software engineers develop the next-generation technologies that change how billions of users connect, explore, and interact with information and one another.                    */}
                    {/*</div>*/}
                </div>

            </div>
        )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(SignOnHero)));

