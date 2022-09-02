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
        ...COMMON.FONTS.FONT_SUBHEADER,
        borderRadius: "8px",
        border: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`,
        outline: "none",
        width: "100%",
        "mozAppearance": "none",
        "webkitAppearance": "none",
        "appearance": "none",
        background: "url('/img/select-down.png')",
        "backgroundRepeat": "no-repeat",
        "backgroundPositionX": "calc(100% - 10.5px)",
        "backgroundPositionY": "11.5px",
        "backgroundSize": "10px auto"
        // TODO "&:focus-visible": {
        //
        // }
    }
};

class StandardInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, style, value, options, update, color, background} = this.props;

        style = style || {};
        update = update || (() => {});

        let width = null;

        if (options && options.length && value) {
            options.forEach((option) => {
                console.log(option.value, value, option.width)
                if (option && option.value && (option.value + "" === value + "")) {

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
            <select className={classes.inputStyle} style={selectStyle} value={value} onChange={(e) => (update(e.target.value))}>
                {options.map((option) => {
                    return (<option value={option.value}>{option.label}</option>)
                })}
            </select>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(StandardInput)));

