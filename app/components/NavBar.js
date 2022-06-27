import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';

import {COLOR_BLACK, COLOR_BORDER_GREY, COLOR_GOLD, COLOR_GREEN, COLOR_WHITE} from "../common/colors";
import {FONT_BODY_BOLD, FONT_SUBHEADER_BOLD, FONT_TITLE_2_BOLD} from "../common/fonts";

const NAV_HEIGHT = 65;

const Styles = {
    container: {
        padding: "0px 50px",
        height: `${NAV_HEIGHT}px`,
        '@media (max-width: 768px)': {
            padding: "0 20px",
        },
        background: COLOR_WHITE
    },
    logoStyle: {
        ...FONT_TITLE_2_BOLD,
        color: COLOR_GREEN,
        lineHeight: `${NAV_HEIGHT}px`,
    },
    linkStyle: {
        ...FONT_SUBHEADER_BOLD,
        color: COLOR_BLACK,
        lineHeight: `${NAV_HEIGHT}px`,
        position: "relative",
        width: "fit-content",
        marginLeft: "auto",
        cursor: "pointer"
    },
    selectedLink: {
        position: "absolute",
        width: "100%",
        height: "4px",
        bottom: 0,
        background: COLOR_GREEN,
        borderRadius: "2px 2px 0 0"
    },
    profileContainer: {
        marginTop: "12.5px",
        height: "40px",
        width: "40px",
        borderRadius: "100%",
        border: `2px solid ${COLOR_BORDER_GREY}`
    }
};

class NavBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: true
        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, client, match: { params } } = this.props;

        return (<div className={classes.container}>
            <div style={{display: "flex"}}>
                <div style={{flex: 1}} className={classes.logoStyle}>
                    <Link to={"/"} style={{color: COLOR_GREEN}}>
                        OSIRIS
                    </Link>
                </div>
                <div style={{flex: 1, textAlign: "right", paddingRight: "20px"}}>
                    <div className={classes.linkStyle} style={{color: this.state.selected ? COLOR_GREEN : null}}>
                        Jobs
                        {this.state.selected && <div className={classes.selectedLink}/>}
                    </div>
                </div>
                <div style={{flex: "0 0 40px"}}>
                    <div  className={classes.profileContainer}>
                        <img src="/img/profile.png" width={"100%"}/>
                    </div>
                </div>
            </div>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(NavBar)));

