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
        let { classes, value, options, update} = this.props;

        update = update || (() => {});

        return (<div className={classes.container}>
            <select className={classes.inputStyle} value={value} onChange={(e) => (update(e.target.value))}>
                {options.map((option) => {
                    return (<option value={option.value}>{option.label}</option>)
                })}
            </select>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(StandardInput)));

