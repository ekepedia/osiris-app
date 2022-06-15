import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';

import {COLOR_GOLD, COLOR_GREEN, COLOR_WHITE} from "../common/colors";
import { FONT_BODY_BOLD } from "../common/fonts";
import {DateRange} from "react-date-range";


import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
};

class DatePicker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, client, match: { params }, updateDates, start, end } = this.props;

        return (<div className={classes.container}>

            <DateRange
                editableDateInputs={true}
                onChange={(item) => {

                    // this.setState({
                    //     start: item.selection.startDate,
                    //     end: item.selection.endDate,
                    // });

                    console.log([item.selection]);

                    if (item.selection) {

                        const start = moment(item.selection.startDate.getTime()).format("M/DD/YYYY");
                        const end = moment(item.selection.endDate.getTime()).format("M/DD/YYYY");

                        console.log("START:", start);
                        console.log("END:", end);
                        updateDates(start, end);
                    }
                }}
                moveRangeOnFirstSelection={false}
                showMonthAndYearPickers={false}
                rangeColors={[COLOR_GOLD]}
                maxDate={new Date()}
                scroll={{
                    enabled: true
                }}
                ranges={[{
                    startDate: new Date(start),
                    endDate: new Date(end),
                    key: 'selection'
                }]}
            />
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(DatePicker)));

