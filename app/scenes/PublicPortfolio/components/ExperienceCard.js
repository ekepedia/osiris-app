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
        let { classes, time, company_name, role_name, company_logo_url, timeElapsed} = this.props;

        return (
            <div className={mc(classes.cardContainer)}>
                <div style={{display: "flex"}}>
                    <div className={mc(classes.cardImageContainer)}>
                        <CoverImageHolder url={company_logo_url}/>
                    </div>
                    <div style={{flex: 1}}>
                        <div className={mc(classes.cardTitle)}>{role_name}</div>
                        <div className={mc(classes.cardBody)}><span>{company_name}</span> • <span>{timeElapsed}</span> • <span>{time}</span></div>
                    </div>
                </div>
            </div>
        )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(SmallLink)));

