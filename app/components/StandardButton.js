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

    let height = "31px";
    if (!props || !props.size)
        return height;

    const { size } = props;

    if (size === "S") {
        height = "28px"
    }

    return height
}

const setFont = (props) => {

    let font = COMMON.FONTS.FONT_SUBHEADER_BOLD;

    if (!props || !props.size)
        return font;

    const { size } = props;

    if (size === "S") {
        font = COMMON.FONTS.FONT_FOOTNOTE_BOLD
    }

    return font
}

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    buttonStyle: (props) => {
        const font = setFont(props) || COMMON.FONTS.FONT_SUBHEADER_BOLD;

        return ({
            height: setHeight(props),
            padding: "6px 8px",
            background: COMMON.COLORS.OSIRIS_GREEN,
            border: `1px solid ${COMMON.COLORS.OSIRIS_GREEN}`,
            borderRadius: "6px",
            color: COMMON.COLORS.COLOR_WHITE,
            ...font,
        })
    },
    outlineButton: (props) => {
        const font = setFont(props) || COMMON.FONTS.FONT_SUBHEADER_BOLD;

        return ({
            height: setHeight(props),
            padding: "6px 8px",
            borderRadius: "6px",
            background: "none",
            border: `1px solid ${COMMON.COLORS.OSIRIS_GREEN}`,
            color: COMMON.COLORS.OSIRIS_GREEN,
            ...font,
        })
    },
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
        let { classes, label, outline, onClick, fullWidth } = this.props;

        return (<div className={classes.container}>

            <button style={{width: fullWidth ? "100%" : null}} className={outline ? mc(classes.outlineButton) : classes.buttonStyle} onClick={() => {
                onClick ? onClick() : null;
            }}>{label}</button>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(StandardButton)));

