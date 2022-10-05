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
        },
    },
    pieChartHolder: {
        flex: "0 0 125px",
        marginRight: "20px"
    },
    pieChartLabelContainer: {
        flex: "0 0 187px",
        marginTop: "39px",
        color: COMMON.COLORS.N700
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

class RacePieChart extends React.Component {

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

        const cleanValue = (value) => {
            if (!value) return value;
            return value < 1 ? 1 : value;
        }
        return (<div className={classes.container}>
            <div className={mc(classes.pieChartHolder)}>
                <div style={{height: "140px", width: "140px"}}>
                    <PieChart
                        lineWidth={20}
                        startAngle={0}
                        data={[
                            { title: 'Asian', value: company_demographics.employees_asian, color: COMMON.COLORS.CHART_YELLOW },
                            { title: '--', value: spacing, color: COMMON.COLORS.N0 },
                            { title: 'Black', value: company_demographics.employees_black, color: COMMON.COLORS.CHART_VIOLET },
                            { title: '--', value: spacing, color: COMMON.COLORS.N0 },
                            { title: 'Latinx', value: cleanValue(company_demographics.employees_latinx), color: COMMON.COLORS.CHART_TEAL },
                            { title: '--', value: spacing, color: COMMON.COLORS.N0 },
                            { title: 'Native American', value: cleanValue(company_demographics.employees_indigenous), color: COMMON.COLORS.CHART_PINK },
                            { title: '--', value: spacing, color: COMMON.COLORS.N0 },
                            { title: 'Hawaiian', value: cleanValue(company_demographics.employees_hawaiian), color: COMMON.COLORS.B400 },
                            { title: '--', value: spacing, color: COMMON.COLORS.N0 },
                            { title: 'Multi', value: cleanValue(company_demographics.employees_multi), color: COMMON.COLORS.CHART_ORANGE },
                            { title: '--', value: spacing, color: COMMON.COLORS.N0 },
                            { title: 'White', value: company_demographics.employees_white, color: COMMON.COLORS.N400 },
                            { title: '--', value: spacing, color: COMMON.COLORS.N0 },
                        ]}
                    />
                </div>
            </div>
            <div className={mc(classes.pieChartLabelContainer)}>
                <div className={mc(classes.pieChartLabelHolder)}>
                    <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.CHART_YELLOW}}/>
                    <div className={mc(classes.pieChartLabelName)}>Asian</div>
                    <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_asian}%</div>
                </div>

                <div className={mc(classes.pieChartLabelHolder)}>
                    <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.CHART_VIOLET}}/>
                    <div className={mc(classes.pieChartLabelName)}>Black</div>
                    <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_black}%</div>
                </div>

                <div className={mc(classes.pieChartLabelHolder)}>
                    <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.CHART_TEAL}}/>
                    <div className={mc(classes.pieChartLabelName)}>Hispanic/Latinx</div>
                    <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_latinx}%</div>
                </div>

            </div>
            <div className={mc(classes.pieChartLabelContainer)} style={{marginTop: "26px"}}>
                <div className={mc(classes.pieChartLabelHolder)}>
                    <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.CHART_PINK}}/>
                    <div className={mc(classes.pieChartLabelName)}>Indigenous</div>
                    <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_indigenous || "—"}{company_demographics.employees_indigenous ? "%" : ""}</div>
                </div>
                <div className={mc(classes.pieChartLabelHolder)}>
                    <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.B400}}/>
                    <div className={mc(classes.pieChartLabelName)}>Native Hawaiian</div>
                    <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_hawaiian || "—"}{company_demographics.employees_hawaiian ? "%" : ""}</div>
                </div>
                <div className={mc(classes.pieChartLabelHolder)}>
                    <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.CHART_ORANGE}}/>
                    <div className={mc(classes.pieChartLabelName)}>Multiracial</div>
                    <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_multi || "—"}{company_demographics.employees_multi ? "%" : ""}</div>
                </div>
                <div className={mc(classes.pieChartLabelHolder)}>
                    <div className={mc(classes.pieChartLabelColor)} style={{background: COMMON.COLORS.N400}}/>
                    <div className={mc(classes.pieChartLabelName)}>White</div>
                    <div className={mc(classes.pieChartLabelPercentage)}>{company_demographics.employees_white}%</div>
                </div>
            </div>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(RacePieChart)));

