import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';
import { COLOR_WHITE } from "../../common/colors";

import STYLES from "../../common/index";


import ModalTemplate from "../../components/ModalTemplate"

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    }
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

            <div style={{color: STYLES.COLORS.COLOR_GREEN}} onClick={() => (this.setOnBoardingModal(true))}>HIII</div>
            New Home

            <ModalTemplate
                open={this.state.showOnBoardingModal}
                onClose={() => (this.setOnBoardingModal(false))}
            />
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(Home)));

