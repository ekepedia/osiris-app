import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';

import {COLOR_GOLD, COLOR_WHITE} from "../common/colors";
import {FONT_FOOTNOTE, FONT_FOOTNOTE_BOLD} from "../common/fonts";

const Styles = {
    container: {
        padding: "0",
        height: "44px",
        background: COLOR_GOLD,
        color: COLOR_WHITE,
        textAlign: "center",
        lineHeight: "44px",
        overflow: "hidden",
        position: "relative",
        ...FONT_FOOTNOTE,
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },

};

class Template extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, onSignUp, onDismiss } = this.props;

        return (<div className={classes.container} >

            <div style={{width: "420px", margin: "auto"}}>
                <div style={{display: "flex"}}>
                    <div style={{flex: "0 0 20px", fontSize: "20px", marginRight: "7"}}>
                        <i style={{lineHeight: "44px"}} className="fa-solid fa-bell"></i>
                    </div>
                    <div style={{flex: 1, textAlign: "left"}}>
                        Be the first to hear about new opportunities
                    </div>
                    <div style={{flex: "0 0 125px", textAlign: "left", marginLeft: "15px", ...FONT_FOOTNOTE_BOLD}}>
                        <span style={{cursor: "pointer", padding: "6px 8px", borderRadius: "6px", background: COLOR_WHITE, color: COLOR_GOLD}} onClick={onSignUp}>Sign Up For Alerts</span>
                    </div>
                </div>
            </div>

            <span style={{position: "absolute", right: "50px", top: "15px"}}
                  onClick={onDismiss}>
                                        <i style={{cursor: "pointer", lineHeight: "14px", fontSize: "14px"}} className="fa-solid fa-x"></i>

            </span>


        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(Template)));

