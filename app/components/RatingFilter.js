import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';

import COMMON from "../common/index";
import { mc } from "../common/helpers";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
};

class RatingFilter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, client, match: { params }, value, update } = this.props;

        return (<div className={classes.container}>
            <div style={{display: "inline-block", lineHeight: "16px", fontSize: "15px", position: "relative"}}>
                <i onClick={() => {update(value === 1 ? null : 1)}} style={{color: value > 0 ? COMMON.COLORS.Y400 : COMMON.COLORS.N200, marginLeft: "2.5px"}} className={`fa-solid fa-star`}/>
                <i onClick={() => {update(value === 2 ? null : 2)}} style={{color: value > 1 ? COMMON.COLORS.Y400 : COMMON.COLORS.N200, marginLeft: "2.5px"}} className={`fa-solid fa-star`}/>
                <i onClick={() => {update(value === 3 ? null : 3)}} style={{color: value > 2 ? COMMON.COLORS.Y400 : COMMON.COLORS.N200, marginLeft: "2.5px"}} className={`fa-solid fa-star`}/>
                <i onClick={() => {update(value === 4 ? null : 4)}} style={{color: value > 3 ? COMMON.COLORS.Y400 : COMMON.COLORS.N200, marginLeft: "2.5px"}} className={`fa-solid fa-star`}/>
                <i onClick={() => {update(value === 5 ? null : 5)}} style={{color: value > 4 ? COMMON.COLORS.Y400 : COMMON.COLORS.N200, marginLeft: "2.5px"}} className={`fa-solid fa-star`}/>
                <span style={{...COMMON.FONTS.P100, marginLeft: "5px", position: "absolute", top: -0.5, width: "40px", color: COMMON.COLORS.N700}}>and up</span>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(RatingFilter)));

