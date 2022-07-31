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
    ...COMMON.STYLES.GENERAL.alignmentStyles,
    ...COMMON.STYLES.PORTFOLIO.StandardCardStyles,
    ...COMMON.STYLES.PORTFOLIO.PortfolioPageStyles,
};

class SmallLink extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, link, url, link_name, portfolioLinkRef, currentHeight} = this.props;

        let maxWidth = link_name && link_name.length && link_name.length > 60 ? 400 : 500;

        return (
            <a style={{cursor: "pointer"}} href={link} target={"_blank"} >
                <div className={mc(classes.linkContainer)} style={{height: currentHeight ? currentHeight : null}} ref={portfolioLinkRef}>
                    <CoverImageHolder url={url}/>

                    <div className={mc(classes.linkText)}>
                        <div style={{display: "flex"}}>
                            <div style={{flex: 1}}>
                                <div style={{maxWidth}}>
                                    {link_name}
                                </div>
                            </div>
                            <div className={mc(classes.centerAlignContainer)} style={{flex: "0 0 20px"}}>
                                <i className={mc("fa-solid fa-link", classes.centerAlignObject)}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(SmallLink)));

