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
    badgeStyle: (props) => {
        return ({
            marginRight: "5px",
            // marginTop: "5.5px",
            ...COMMON.FONTS.H100,
            padding: "2px 4px",
            background: props.background || COMMON.COLORS.N100,
            color: props.color || COMMON.COLORS.N700,
            display: "inline-block",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            textTransform: "uppercase"
        })
    },
    defaultIcon: {
        fontSize: "10px"
    }
};

class StandardBadge extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, style, label, icon, iconStyle, iconLeft } = this.props;

        return (<div style={style} className={classes.badgeStyle}>
            {icon && iconLeft ? <span style={{marginRight: "4.25px"}}><i style={iconStyle} className={mc(icon,classes.defaultIcon)}/></span> : null}{label}{icon && !iconLeft ? <span style={{marginLeft: "4.25px"}}><i style={iconStyle} className={mc(icon,classes.defaultIcon)}/></span> : null}
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(StandardBadge)));

