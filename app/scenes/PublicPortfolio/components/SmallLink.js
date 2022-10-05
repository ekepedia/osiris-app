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
    ...COMMON.STYLES.PORTFOLIO.StandardCardStyles
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
        let { classes, user, link, url, link_name} = this.props;

        link = link || "";

        let clean_link = link.replace("http://" ,"").replace("https://" ,"")

        return (
            <a style={{cursor: "pointer", textDecoration: "none"}} href={link} target={"_blank"} >

                <div className={mc(classes.cardContainer)} style={{color: COMMON.COLORS.DARK_GREY, textDecoration: "none"}}>
                    <div style={{display: "flex"}}>
                        <div className={mc(classes.cardImageContainer)}>
                            <CoverImageHolder url={url}/>
                        </div>
                        <div style={{flex: 1, overflow: "hidden", paddingRight: "5px"}}>
                            <div>
                                <div className={mc(classes.cardSmallLinkTitle)}>{link_name}</div>
                                <div className={mc(classes.cardSubTitle)}>{clean_link}</div>
                            </div>
                        </div>
                        <div style={{flex: "0 0 20px", fontSize: "13px"}} className={mc(classes.centerAlignContainer)}>
                            <i className={mc("fa-solid fa-arrow-right", classes.centerAlignObject)}/>
                        </div>
                    </div>

                </div>
            </a>
        )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(SmallLink)));

