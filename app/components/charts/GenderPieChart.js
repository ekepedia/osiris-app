import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';

import COMMON from "../../common/index";
import { mc } from "../../common/helpers";
import {PieChart} from "react-minimal-pie-chart";
import {COLOR_GOLD} from "../../common/colors";

const Styles = {
    container: {
        display: "flex",
        justifyContent: "space-between",
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
            flexDirection: "column"
        },
    },
    pieChartHolder: {
        flex: "0 0 125px",
        marginRight: "20px",
        '@media (max-width: 768px)': {
            marginBottom: "20px",
        },
    },
    pieChartLabelContainer: {
        flex: "0 0 187px",
        marginTop: "63px",
        color: COMMON.COLORS.N700,
        '@media (max-width: 768px)': {
            flex: 1,
            marginTop: "0px",
        },
    },
    pieChartLabelHolder: {
        display: "flex",
        lineHeight: "20px",
        marginBottom: "7px"
    },
    pieChartLabelColor: {
        height: "14px",
        width: "14px",
        flex: "0 0 14px",
        background: COLOR_GOLD,
        borderRadius: "4px",
        marginTop: "1px"
    },
    pieChartLabelName: {
        flex: 1,
        paddingLeft: "8px",
        ...COMMON.FONTS.H300,
    },
    pieChartLabelPercentage: {
        ...COMMON.FONTS.H200,
        flex: "0 0 32px",
    },
};

class GenderPieChart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let { classes, client, match: { params }, company_demographics } = this.props;

        company_demographics = company_demographics || {};
        const spacing = 0.75;

        return (<div className={classes.container}>
            <div className={mc(classes.pieChartHolder)}>
                <div style={{height: "140px", width: "140px"}}>
                    <PieChart
                        lineWidth={20}
                        startAngle={0}
                        data={[
                            { title: 'Male', value: company_demographics.employees_male, color: COMMON.COLORS.CHART_YELLOW },
                            { title: '--', value: spacing, color: COMMON.COLORS.N0 },
                            { title: 'Female', value: company_demographics.employees_female, color: COMMON.COLORS.CHART_VIOLET },
                            { title: '--', value: spacing, color: COMMON.COLORS.N0 },
                        ]}
                    />
                </div>
            </div>
            <div className={mc(classes.pieChartLabelContainer)}>
                <div className={mc(classes.pieChartLabelHolder)}>
                    <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.CHART_YELLOW}}/>
                    <div className={mc(classes.pieChartLabelName)}>Male</div>
                    <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_male}%</div>
                </div>
            </div>
            <div className={mc(classes.pieChartLabelContainer)}>
                <div className={mc(classes.pieChartLabelHolder)}>
                    <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.CHART_VIOLET}}/>
                    <div className={mc(classes.pieChartLabelName)}>Female</div>
                    <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_female}%</div>
                </div>
            </div>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(GenderPieChart)));

