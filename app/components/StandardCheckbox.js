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


const height = "16.25px";
const heightContainer = "21.25px";

const Styles = {
    container: {
        padding: "0",
        color: COMMON.COLORS.DARK_GREY,
        ...COMMON.FONTS.FONT_SUBHEADER,
        height: height,
        overflow: "hidden",
        lineHeight: height,
        margin: "15px 0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    inputStyle: {
        height: height,
        width: height,
        padding: "6px 8px",
        borderRadius: "8px",
        border: `1px solid ${COMMON.COLORS.COLOR_BORDER_GREY}`,
        outline: "none",
        background: "none",
        margin: "0",
        // TODO "&:focus-visible": {
        //
        // }
    }
};

class StandardCheckbox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, value, update, label} = this.props;

        update = update || (() => {});

        return (<div className={classes.container}>

            <div style={{display: "flex"}}>
                <div style={{flex: `0 0 ${heightContainer}`}}>
                    <input style={{margin: 0}} type={"checkbox"} className={classes.inputStyle} checked={value} onChange={(e) => {
                        console.log("CHECKED:", e.target.checked, value)
                        update(e.target.checked)
                    }}/>
                </div>
                <div style={{flex: 1}}>
                    {label}
                </div>
            </div>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(StandardCheckbox)));

