import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';
import { COLOR_WHITE } from "../../common/colors";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    }
};

class TemplateScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {

    }


    render() {
        let { classes, client, match: { params } } = this.props;

        return (<div className={classes.container}>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(TemplateScene)));

