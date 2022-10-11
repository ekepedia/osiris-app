import React from "react";
import _ from "lodash";
import moment from "moment";


import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import COMMON from "../../../common/index";
import {httpSafeLink, mc} from "../../../common/helpers";
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
    ...COMMON.STYLES.PORTFOLIO.PortfolioHeaderStyles,
    ...COMMON.STYLES.COMPANY.CompanyHeaderStyles,
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

        if (currentWidth < 500) {
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
        let { classes, company, selectedState, setSelectedState, has_demographics} = this.props;

        company = company || {};

        return (<div className={classes.container}>
            <div className={classes.superContainer}>
                <div className={classes.profileCover} ref={this.portfolioLinkRef} style={{height: this.state.currentHeight ? this.state.currentHeight : null}}>
                    <CoverImageHolder url={company.cover_photo_url || "https://i.imgur.com/tM97NWQ.png"}/>
                </div>
                <div className={classes.profileHeaderContainer} style={{paddingBottom: 0}}>
                    <div className={classes.profileImageContainer}>
                        <div className={classes.profileImage} style={{overflow: "hidden"}}>
                            <CoverImageHolder url={company.company_logo_url}/>
                        </div>
                    </div>
                    <div className={classes.editHeaderButtonContainer}>
                        <div className={classes.editHeaderButton}>
                            <a target={"_blank"} href={httpSafeLink(company.company_website)}>
                                <StandardButton label={"Learn More"} outline={false} icon={"fa-solid fa-compass"}/>
                            </a>
                        </div>
                    </div>
                    <div className={classes.profileHeaderName}>{company.company_name}</div>
                    <div className={classes.profileHeaderBio}>{company.company_city || ""}{company.company_city && company.company_state ? "," : ""} {company.company_state || ""}</div>
                    <div className={classes.companyTabs}>
                        <div className={mc(classes.companyMenuContainer)} onClick={() => {setSelectedState ? setSelectedState(1) : null}}>
                            <span style={{color: selectedState === 1 ? COMMON.COLORS.B400 : null}}>Home</span>
                            {selectedState === 1 ? <div className={classes.companyMenuSelectBar}/> : null}
                        </div>
                        <div className={mc(classes.companyMenuContainer)} onClick={() => {setSelectedState ? setSelectedState(2) : null}}>
                            <span style={{color: selectedState === 2 ? COMMON.COLORS.B400 : null}}>About</span>
                            {selectedState === 2 ? <div className={classes.companyMenuSelectBar}/> : null}
                        </div>
                        <div style={{display: has_demographics ? null : "none"}} className={mc(classes.companyMenuContainer)} onClick={() => {setSelectedState ? setSelectedState(3) : null}}>
                            <span style={{color: selectedState === 3 ? COMMON.COLORS.B400 : null}}>DE&I</span>
                            {selectedState === 3 ? <div className={classes.companyMenuSelectBar}/> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(PortfolioHeader)));

