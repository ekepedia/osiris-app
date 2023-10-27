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
        width:"100%"
    },
    inputStyle: {
        height: "32px",
        padding: "12px 8px",
        ...COMMON.FONTS.P100,
        borderRadius: "4px",
        border: `1px solid ${COMMON.COLORS.N400}`,
        outline: "none",
        width: "100%",
        background: "none",
        "&:hover": {
            borderColor: COMMON.COLORS.N600,
        },
        color: COMMON.COLORS.N800
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
        let { classes, value, update, placeholder, style, type, subLabel} = this.props;

        update = update || (() => {});

        return (<div className={classes.container}>
            {type === "textarea" ?
                <textarea style={style} placeholder={placeholder} className={classes.inputStyle} value={value} onChange={(e) => (update(e.target.value))}/>
                :
                <input type={type} style={style} placeholder={placeholder} className={classes.inputStyle} value={value} onChange={(e) => (update(e.target.value))}/>

            }
            {subLabel && subLabel.length ? <div style={{marginTop: "5px", ...COMMON.FONTS.P100, color: COMMON.COLORS.N700}}>{subLabel}</div> : null}
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(StandardInput)));

