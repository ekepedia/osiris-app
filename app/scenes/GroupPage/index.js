import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link, useHistory} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';
import {COLOR_WHITE, PIE_CHART_WHITE} from "../../common/colors";
import COMMON from "../../common";
import { PieChart } from 'react-minimal-pie-chart';
import CompanyDemographicService from "../../services/CompanyDemographicService";
import {formatLargeNumber, mc} from "../../common/helpers";
import GroupHeader from "./components/GroupHeader";
import NavBar from "../../components/NavBar";
import RacePieChart from "../../components/charts/RacePieChart";
import GenderPieChart from "../../components/charts/GenderPieChart";
import StandardBadge from "../../components/StandardBadge";
import JobsService from "../../services/JobsService";
import CoverImageHolder from "../../components/CoverImageHolder";
import GroupService from "../../services/GroupService";
import GroupSearchBar from "./components/GroupSearchBar";
import CompanyHeader from "../CompanyPage/components/CompanyHeader";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0 20px",
        },
    },
    jobCardContainer: {height: "68px", cursor: "pointer", borderRadius: "4px", border: `1px solid ${COMMON.COLORS.N400}`, padding: "15px"},
    jobCardImgContainer: {
        flex: "0 0 38px", overflow: "hidden", height: "38px", marginRight: "8px", borderRadius: "4px", border: `1px solid ${COMMON.COLORS.N400}`
    },
    jobCardTitle: {
        ...COMMON.FONTS.H400,
        color: COMMON.COLORS.N900,
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
    },
    jobCardCompany: {
        ...COMMON.FONTS.P100,
        color: COMMON.COLORS.N700,
        marginTop: "-2px"
    },
    ...COMMON.STYLES.GENERAL.NavigationStyles,
    ...COMMON.STYLES.GROUP.GroupPageStyles,
    ...COMMON.STYLES.GROUP.GroupProfilePageStyles,
    racePieChartHolder: {
        marginTop: "20px"
    }
};


class GroupPage extends React.Component {


    constructor(props) {
        console.log("4");
        super(props);
        console.log("5");
        this.state = {
            selectedState: 1,
        };
    }

    componentDidMount() {
        console.log("1");
        this.loadGroups();
        console.log("2");
        this.loadGroupJobs();
        console.log("3");
    }

    loadGroups() {
        console.log("6");
        let { client, match: { params } } = this.props;

        GroupService.getGroups({
            client,
            group_id: params.group_id
        }).then((groups) => {
            console.log("LOADED GROUP", groups);

            let group = null;

            if (groups && groups.length) {
                group = groups[0]
            }

            this.setState({
                group
            })
        })
    }

    loadGroupJobs() {
        let { client, match: { params } } = this.props;

        GroupService.getGroups({
            client,
            group_id: params.group_id,
            is_user_submitted: false
        }).then((groups) => {
            console.log("LOADED GROUPS", groups);

            this.setState({
                groups: groups || []
            })
        })
    }

    render() {
        console.log("7");
        let { classes, client, match: { params }, history } = this.props;

        let { group, selectedState, groups } = this.state;

        group = group || {};


        const {
            group_id
        } = group;


        return (

            <div className={classes.masterContainer}>
                <div className={classes.masterNavContainer}>
                    <NavBar />
                </div>
                <div className={classes.masterBodyContainer}>
                    <div className={classes.container}>

                        <div className={classes.mainContainer}>

                            <div className={mc(classes.headerContainer)}>
                                <GroupHeader {...{group, selectedState: this.state.selectedState}} setSelectedState={(selectedState) => {
                                    this.setState({selectedState})
                                }}/>
                            </div>

                            <div style={{display: selectedState === 1 ? null : "none"}} className={mc(classes.sectionContainer)}>
                                <GroupSearchBar style={{width: "100%"}}/>
                            </div>


                            <div  style={{display: selectedState === 2 ? null : "none"}} className={mc(classes.sectionContainer)}>
                                <div className={mc(classes.sectionMainTitle)}>Overview</div>
                                <div className={mc(classes.sectionSubHeader)}>Identified by OSIRIS from {group.group_name}</div>
                                <div className={mc(classes.aboutBody)}>{group.group_about}</div>
                                <div className={mc(classes.sectionSubtitle)}>Website</div>
                                <div className={mc(classes.groupWebsite)}><a target={"_blank"} href={group.group_website}>{group.group_website}</a></div>
                                <div className={mc(classes.sectionSubtitle)}>Industry</div>
                                <div className={mc(classes.overviewSection)}>{group.group_industry_affiliation}</div>
                                {group.group_size ? <div>
                                    <div className={mc(classes.sectionSubtitle)}>Group Size</div>
                                    <div className={mc(classes.overviewSection)}>{formatLargeNumber(group.group_size)} members</div>
                                </div> : null}

                                <div className={mc(classes.sectionSubtitle)}>Founded</div>
                                <div className={mc(classes.overviewSection)}>{group.group_founded_year || "--"}</div>

                                <div className={mc(classes.sectionSubtitle)}>Specialties</div>
                                <div className={mc(classes.overviewSection)}>
                                    <StandardBadge style={{marginTop: "15px"}} label={group.group_industry_affiliation}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(GroupPage)));