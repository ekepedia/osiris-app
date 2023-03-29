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
import MobileFilterBar from "./MobileFilterBar";
import MobileSelectArea from "./MobileSelectArea";
import TrackingService from "../services/TrackingService";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
            height: "100%",
            overflow: "hidden"
        },
    },
};

class MobileFilters extends React.Component {

    constructor(props) {
        super(props);

        let PAYLOADS =  props.PAYLOADS || [{}];
        this.state = {
            payload: PAYLOADS[0],
        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, client, match: { params } ,
            PAYLOADS,
            state,
            addToField,
            removeFromField,
            update,
            mobile_expanded
        } = this.props;

        return (<div className={classes.container}>
            <div style={{display: "flex", height: "100%", overflow: "hidden", flexDirection: "column"}}>
                <div style={{
                    flex: "0 0 30px",
                    background: "black",
                    textAlign: "center",
                    color: "white",
                    lineHeight: "30px",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.25px",
                    fontWeight: 600
                }} onClick={() => {
                    update("mobile_expanded", !mobile_expanded);
                    TrackingService.trackClick({page: "job-board", sub_page: "job-mobile-filter-expand", value: !mobile_expanded});

                }}>
                    {mobile_expanded ? "Apply" : "Expand"} Filters
                </div>
                <div style={{flex: "0 0 40px", lineHeight: "40px",}} className={classes.mobileFilterBar}>
                    <MobileFilterBar mobile_expanded={mobile_expanded} PAYLOADS={PAYLOADS} state={state} state_payload={this.state.payload} update={(payload) => {
                        this.setState({payload});
                        update("mobile_expanded", true);
                    }}/>
                </div>
                {mobile_expanded ? <div style={{flex: 1, padding: "0 20px", paddingTop: "0px", overflow: "scroll"}}>
                    <MobileSelectArea
                        payload={this.state.payload}
                        addToField={addToField}
                        removeFromField={removeFromField}
                        mobile_expanded={mobile_expanded}

                        update={(name, value) => {
                            this.setState({
                                [name]: value
                            });
                            setTimeout(() => {
                                this.reloadJobs();
                            }, 100)
                        }}

                        state={state}
                        disableSearch={false}

                    />
                </div> : null}
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(MobileFilters)));

