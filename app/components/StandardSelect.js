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
    inputStyle: {
        height: "31px",
        padding: "6px 8px",
        ...COMMON.FONTS.P100,
        borderRadius: "4px",
        border: `1px solid ${COMMON.COLORS.N400}`,
        color: COMMON.COLORS.N800,
        outline: "none",
        width: "100%",
        "mozAppearance": "none",
        "webkitAppearance": "none",
        "appearance": "none",
        background: "url('/img/custom-select-caret.png')",
        "&:hover": {
            borderColor: COMMON.COLORS.N600,
        },
        "backgroundRepeat": "no-repeat",
        "backgroundPositionX": "calc(100% - 11px)",
        "backgroundPositionY": "5px",
        "backgroundSize": "20px auto"
        // TODO "&:focus-visible": {
        //
        // }
    }
};

class StandardSelect extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, style, value, options, update, color, background, disableCustom, placeholder} = this.props;

        style = style || {};
        options = options || [];
        update = update || (() => {});

        let width = null;

        if (options && options.length && value) {
            options.forEach((option) => {
                // console.log(option.value, value, option.width)
                if (!disableCustom && option && option.value && (option.value + "" === value + "")) {

                    if (option.width)
                        width = option.width

                    if (option.color)
                        color = option.color

                    if (option.background)
                        background = option.background

                }
            })
        }

        let selectStyle = {...style, color: color ? color : null, background: background ? background : null};

        if (width) {
            console.log("we found width");
            selectStyle.width = width;
            console.log(selectStyle);
        } else {
            console.log("nope!")
        }

        return (<div className={classes.container}>
            <select placeholder={placeholder} className={classes.inputStyle} style={selectStyle} value={value} onChange={(e) => (update(e.target.value))}>
                {placeholder ? <option selected="true" disabled="disabled">{placeholder}</option> : null}
                {options.map((option) => {
                    return (<option key={option.label} value={option.value}>{option.label}</option>)
                })}
            </select>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(StandardSelect)));

