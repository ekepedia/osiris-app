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
};

class PortfolioPortfolio extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, user} = this.props;

        user = user || {};

        let {

        } = user;

        return (<div className={classes.container}>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(PortfolioPortfolio)));

