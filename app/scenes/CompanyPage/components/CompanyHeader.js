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

        console.log("RESIZED HEADER", node.clientWidth, currentHeight, node.clientHeight, "ratio:", RATIO)

        this.setState({
            currentWidth,
            currentHeight
        });
    }

    render() {
        let { classes, company, selectedState, setSelectedState} = this.props;

        company = company || {};

        return (<div className={classes.container}>
            <div className={classes.superContainer}>
                <div className={classes.profileCover} ref={this.portfolioLinkRef} style={{height: this.state.currentHeight ? this.state.currentHeight : null}}>
                    <CoverImageHolder url={"https://i.imgur.com/tM97NWQ.png"}/>
                </div>
                <div className={classes.profileHeaderContainer} style={{paddingBottom: 0}}>
                    <div className={classes.profileImageContainer}>
                        <div className={classes.profileImage} style={{overflow: "hidden"}}>
                            <CoverImageHolder url={company.company_logo_url}/>
                        </div>
                    </div>
                    <div className={classes.editHeaderButtonContainer}>
                        <div className={classes.editHeaderButton}>
                            <a target={"_blank"} href={company.company_website}>
                                <StandardButton label={"Learn More"} outline={false}/>
                            </a>
                        </div>
                    </div>
                    <div className={classes.profileHeaderName}>{company.company_name}</div>
                    <div className={classes.profileHeaderBio}>{company.company_city || "Boston"}, {company.company_state || "MA"}</div>
                    <div style={{
                        height: "45px",
                        lineHeight: "45px",
                        marginTop: "25px",
                        borderTop: `1px solid ${COMMON.COLORS.LIGHT_GREY}`
                    }}>
                        <div className={mc(classes.companyMenuContainer)} onClick={() => {setSelectedState ? setSelectedState(1) : null}}>
                            Home
                            {selectedState === 1 ? <div className={classes.companyMenuSelectBar}/> : null}
                        </div>
                        <div className={mc(classes.companyMenuContainer)} onClick={() => {setSelectedState ? setSelectedState(2) : null}}>
                            About
                            {selectedState === 2 ? <div className={classes.companyMenuSelectBar}/> : null}
                        </div>
                        <div className={mc(classes.companyMenuContainer)} onClick={() => {setSelectedState ? setSelectedState(3) : null}}>
                            DE&I
                            {selectedState === 3 ? <div className={classes.companyMenuSelectBar}/> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(PortfolioHeader)));

