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

const setHeight = (props) => {
    return "32px"
}

const setFont = (props) => {
    return COMMON.FONTS.H300;
}

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    buttonStyle: (props) => {
        const font = setFont(props);

        return ({
            height: setHeight(props),
            padding: "8px 10px",
            background: COMMON.COLORS.B400,
            border: `1px solid ${COMMON.COLORS.B400}`,
            borderRadius: "4px",
            color: COMMON.COLORS.COLOR_WHITE,
            ...font,
        })
    },
    secondaryButton: (props) => {
        const font = setFont(props);

        return ({
            height: setHeight(props),
            padding: "8px 10px",
            background: COMMON.COLORS.N0,
            border: `1px solid ${COMMON.COLORS.N400}`,
            borderRadius: "4px",
            color: COMMON.COLORS.N700,
            ...font,
        })
    },
    defaultIcon: {
        fontSize: "11.5px"
    }
};

class StandardButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, label, secondary, onClick, fullWidth, icon, iconStyle } = this.props;

        return (<div className={classes.container}>

            <button style={{width: fullWidth ? "100%" : null}} className={secondary ? mc(classes.secondaryButton) : classes.buttonStyle} onClick={() => {
                onClick ? onClick() : null;
            }}>{label}{icon && <span style={{marginLeft: label && label.length ? "8px" : "0px"}}><i style={iconStyle} className={mc(icon,classes.defaultIcon)}/></span>}</button>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(StandardButton)));

