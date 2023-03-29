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
import TrackingService from "../services/TrackingService";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    mobileFilterBar: {

        padding: "0 20px",

        background: COMMON.COLORS.B400,
        whiteSpace: "nowrap",
        color: COMMON.COLORS.N0,
        overflow: "scroll",
        textTransform: "uppercase"
    },
    mobileFilterBarOption: {
        display: "inline-block",
        marginRight: "12px",
        ...COMMON.FONTS.H200,
        lineHeight: "40px",
        cursor: "pointer",
        opacity: 0.5
    },
};

class MobileFilterBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, client, match: { params }, PAYLOADS, state, update, state_payload, mobile_expanded } = this.props;

        update = update || (() => {});
        state_payload = state_payload || {};
        state = state || {};



        return (<div className={classes.mobileFilterBar}>
            {PAYLOADS.map((payload) => {

                let num = "";
                if (state[payload.selectedOptions] && state[payload.selectedOptions].length) {
                    num = ` (${state[payload.selectedOptions].length})`;
                }

                return (
                    <div style={{opacity: mobile_expanded && (payload.options === state_payload.options) ? 1 : null}}
                         className={classes.mobileFilterBarOption}>
                        <div onClick={() => {
                            update(payload)
                            TrackingService.trackClick({page: "job-board", sub_page: "job-mobile-filter-bar", value: payload.label});

                        }}>
                            {payload.label}{num}
                        </div>
                    </div>
                );
            })}
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(MobileFilterBar)));

