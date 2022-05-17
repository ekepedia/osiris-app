import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import {Mutation, Query} from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';
import DataService from '../../services/DataService';

import DATA from './data';

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        }
    },
    sectionHeading: {
        fontSize: "17px",
        marginBottom: "20px",
        fontWeight: "600"
    },
    sectionSubHeading: {
        marginBottom: "30px",
        fontSize: "15px",
        fontWeight: 500,
    },
    osirisPill: {
        background: "#1F3D3B",
        display: "inline-block",
        color: "#F2EFEC",
        padding: "3px 9px",
        fontWeight: 500,
        fontSize: "12px",
        borderRadius: "15px",
        marginLeft: "10px",
        width: "fit-content",
        position: "absolute",
        bottom: "15px"
    },
    ribbonContainer: {
        width: "fit-content",
        display: "inline-block",
        marginRight: "120px"
    },
    ribbonNumber: {
        fontSize: "40px",
        position: "relative",
        marginTop: "-5px"
    },
    ribbonHeader: {
        fontSize: "14px",
        fontWeight: 500,
    },
    sectionBreak: {
        width: "100%",
        height: "1px",
        background: "#CFBA96",
        margin: "30px 0"
    },
    cardArrowContainer: {
        height: "307px",
        overflow: "hidden",
        margin: "0 15px",
        display: "inline-block",
    },
    cardArrow: {
        lineHeight: "307px",
        width: "fit-content",
        fontSize: "20px"
    },
    cardContainer: {
        display: "inline-block",
        width: "225px",
        border: "1px solid #D9DBD8",
        borderRadius: "12px",
        height: "307px",
        overflow: "hidden"
    },
    cardSubContainer: {
        display: "flex",
        flexDirection: "column",
        height: "265px",
    },
    cardHeader: {
        flex: 1,
        paddingTop: "15px",
        textAlign: "center"
    },
    cardHeaderText: {
        fontSize: "15px",
    },
    cardHeaderNumber: {
        fontSize: "30px",
        marginTop: "5px"
    },
    cardBody: {
        flex: 1,
        background: "#1F3D3B"
    },
    cardFooter: {
        height: "40px",
        textAlign: "center",
        position: "relative",
        marginRight: "60px",
    },
    cardFooterText: {
        display: "inline-block",
        lineHeight: "40px",
        fontSize: "15px"
    },
    trafficContainer: {
        flex: 1,
        // background: "#1F3D3B",
        color: "#F8F8F8",
        height: "230px",
        overflow: "hidden",
        position: "relative"
    },
    trafficLabel: {
        transform: "rotate(90deg)",
        width: "200px",
        position: "absolute",
        top: `${90 + 12}px`,
        left: `${-90 + 2}px`,
        opacity: 1
    },
    trafficNumber: {
        position: "absolute",
        right: "5px",
        bottom: "5px",
        fontSize: "20px",
        opacity: 1
    },
    timeSelect: {
        padding: "5px 10px",
        fontSize: "14px",
        background: "#1F3D3B",
        color: "#F8F8F8",
        borderRadius: "12px",
        fontWeight: 500,
        cursor: "pointer",
    }
};

class DenimTearsAnalyticsHome extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            time: "Past Week"
        };

    }

    componentDidMount() {
        let { classes, client, match: { params } } = this.props;
    }

    componentWillUnmount() {

    }


    processVisitors(visitors) {
        let m = 0;
        let s = 0;

        visitors.forEach((ts) => {
            m = Math.max(ts.value, m)
            s = s + ts.value
        })

        visitors = visitors.map((ts, i) => {

            console.log(ts.name, ts.value , m, )
            return {
                ...ts,
                flex: (Math.round((ts.value/m) * 10)),
                number: (Math.round(ts.value/s * 100)),
                opacity: 1 - (((i + 1) /visitors.length))*0.8 + 0.2,
                length:  (( ts.value / m ) * 0.8 + 0.2)
            }
        })

        // let min = 999999;
        // let max = 0;
        //
        // visitors.forEach((ts) => {
        //     max = Math.max(ts.length, max)
        //     min = Math.min(ts.length, min)
        // })
        //
        // let range = max - min;
        //
        // visitors = visitors.map((ts, i) => {
        //     return {
        //         ...ts,
        //         length: (ts.length - min)/range * 2 + 1
        //     }
        // })

        return visitors
    }

    processTraffic(traffic) {
        let m = 0;
        let s = 0;

        traffic.forEach((ts) => {
            m = Math.max(ts.value, m)
            s = s + ts.value
        })

        traffic = traffic.map((ts, i) => {
            return {
                ...ts,
                flex: (Math.round((ts.value/m) * 10)),
                number: (Math.round(ts.value/s * 100)),
                opacity: (((i + 1) /traffic.length))*0.8 + 0.2
            }
        })

        let min = 999999;
        let max = 0;

        traffic.forEach((ts) => {
            max = Math.max(ts.flex, max)
            min = Math.min(ts.flex, min)
        })

        let range = max - min;

        traffic = traffic.map((ts, i) => {
            return {
                ...ts,
                flex: (ts.flex - min)/range * 2 + 1
            }
        })

        return traffic
    }

    render() {
        let { classes, client, match: { params } } = this.props;
        const user_id = params ? params.user_id : null;

        const WHITE = "#F2EFEC";

        const summary = [1];

        let trafficSources  = DATA[this.state.time].sources;
        let visitors  = DATA[this.state.time].visitors;

        trafficSources = this.processTraffic(trafficSources);
        visitors = this.processVisitors(visitors);

        const renderArrow = () => (
            <div className={classes.cardArrowContainer}>
                <div className={classes.cardArrow}>
                    <span style={{opacity:0, fontSize: "1px"}}>.</span><i className="fa-solid fa-arrow-right-long"></i>
                </div>
            </div>
        );

        return (<div className={classes.container}>

            <Query query={DenimTearsAnalyticsHomeQuery} fetchPolicy={"network-only"}
                   pollInterval={2000} variables={{user_id}}>
                {({ loading, error, data }) => {

                    if (loading) return <p></p>;
                    if (error) return <p>Error Loading Users</p>;

                    const user = data.demo_users && data.demo_users.length ? data.demo_users[0] : {};
                    let demo_trackings = data.demo_trackings && data.demo_trackings.length ? data.demo_trackings : [];

                    const { progress_percent, status } = DataService.getCompletionStatus({user});

                    const initial = DataService.getInitial(user);
                    let last_login = {};

                    let login_total = 0;
                    let sessions = 0;

                    return (<div>
                        <div style={{display: "flex", height: "100%", overflow: "hidden"}}>
                            <div style={{flex: 4, background:"#1F3D3B", height: "100%", padding: "40px 15px"}}>
                                <div style={{height: "100%", position: "relative", color: WHITE}}>
                                    <div style={{display: "flex", marginBottom: "80px", padding: "0 15px"}}>
                                        <div style={{flex: "0 0 50px", paddingRight: "10px"}}>
                                            <div style={{width: "50px", height: "50px", background: "white", borderRadius: "11px", textAlign: "center", padding: "5px"}}>
                                                <div style={{width: "40px", height: "40px", background: "#B8965E", borderRadius: "100%", textAlign: "center", padding: "7px"}}>
                                                    <div style={{width: "26px", height: "26px", background: "#1F3D3B", borderRadius: "100%", textAlign: "center",}}>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{flex: 1}}>
                                            <div style={{fontSize: "17px", marginTop: "5px"}}>Denim Tears</div>
                                            <div style={{fontSize: "12px", color: "#B8965E"}}>Business</div>
                                        </div>
                                    </div>

                                    <div>
                                        <Link to={"/dashboard/analytics"}>
                                            <div style={{display: "flex", color: WHITE, textDecoration: "none", padding: "15px 17px", background: "#627775", borderRadius: "7px", marginBottom: "15px", cursor: "pointer"}}>
                                                <div style={{flex: "0 0 40px", textAlign: "center"}}>
                                                    <div style={{paddingTop: "4px", fontSize: "13px"}}>
                                                        <i className="fa-solid fa-database"></i>
                                                    </div>
                                                </div>
                                                <div style={{flex: 1, fontSize: "15px"}}>
                                                    <div>Google Analytics</div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>

                                    <div style={{display: "flex", padding: "0 15px", position: "absolute", bottom: "0"}}>
                                        <div style={{flex: "0 0 50px", paddingRight: "10px"}}>
                                            <div style={{width: "50px", height: "50px", lineHeight: "50px", fontSize: "20px", background: "#B8965E", color: WHITE, borderRadius: "11px", textAlign: "center"}}>
                                                AS
                                            </div>
                                        </div>
                                        <div style={{flex: 1}}>
                                            <div style={{fontSize: "17px", marginTop: "5px", textTransform: "capitalize"}}>Anthony Specter</div>
                                            <div style={{fontSize: "12px", color: "#B8965E", textTransform: "lowercase"}}>anthony@denimtears.com</div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div style={{flex: 14, padding: "40px 40px", background: WHITE, height: "100%", overflowY: "scroll"}}>
                                <div style={{marginBottom: "40px"}}>
                                    <div className={classes.sectionHeading} style={{marginBottom: "20px"}}>
                                        Dashboard

                                        <div style={{display: "inline-block", float: "right"}}>
                                            <select className={classes.timeSelect} value={this.state.time} onChange={(e) => {this.setState({time: e.target.value})}}>
                                                {Object.keys(DATA).map((k) => {

                                                    if (k !== "Past Week")
                                                        return null

                                                    return (<option value={k}>{k}</option>);
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>


                                <div>

                                    <div className={classes.ribbonContainer}>
                                        <div className={classes.ribbonHeader}>Total Orders</div>
                                        <div>
                                            <div className={classes.ribbonNumber}>126<div style={{background: "#971515"}} className={classes.osirisPill}>65% <i className="fa-solid fa-arrow-trend-down"></i></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={classes.ribbonContainer}>
                                        <div className={classes.ribbonHeader}>Total Sales</div>
                                        <div>
                                            <div className={classes.ribbonNumber}>$17.5K<div style={{background: "#971515"}} className={classes.osirisPill}>82% <i className="fa-solid fa-arrow-trend-down"></i></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={classes.ribbonContainer}>
                                        <div className={classes.ribbonHeader}>Site Visitors</div>
                                        <div>
                                            <div className={classes.ribbonNumber}>17.9K<div className={classes.osirisPill}>5% <i className="fa-solid fa-arrow-trend-up"></i></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={classes.ribbonContainer}>
                                        <div className={classes.ribbonHeader}>New Visitors</div>
                                        <div>
                                            <div className={classes.ribbonNumber}>15.7K<div className={classes.osirisPill}>20% <i className="fa-solid fa-arrow-trend-up"></i></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={classes.ribbonContainer}>
                                        <div className={classes.ribbonHeader}>Return Rate</div>
                                        <div>
                                            <div className={classes.ribbonNumber}>12.2%<div style={{background: "#971515"}} className={classes.osirisPill}>51% <i className="fa-solid fa-arrow-trend-down"></i></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className={classes.sectionBreak}/>

                                <div className={classes.sectionSubHeading}>Sales Funnel</div>

                                <div>


                                    <div className={classes.cardContainer}>
                                        <div className={classes.cardSubContainer}>
                                            <div className={classes.cardHeader}>
                                                <div className={classes.cardHeaderText}>Sessions</div>
                                                <div className={classes.cardHeaderNumber}>22,765</div>
                                            </div>
                                            <div style={{flex: 2}} className={classes.cardBody} />
                                        </div>
                                        <div className={classes.cardFooter}>
                                            <div className={classes.cardFooterText}>100%</div><div style={{background: "#971515", bottom: "9px"}} className={classes.osirisPill}>7% <i className="fa-solid fa-arrow-trend-down"></i></div>
                                        </div>
                                    </div>

                                    {renderArrow()}

                                    <div className={classes.cardContainer}>
                                        <div className={classes.cardSubContainer}>
                                            <div className={classes.cardHeader}>
                                                <div className={classes.cardHeaderText}>Product Views</div>
                                                <div className={classes.cardHeaderNumber}>1,584</div>
                                            </div>
                                            <div style={{flex: 0.5}} className={classes.cardBody} />
                                        </div>
                                        <div className={classes.cardFooter}>
                                            <div className={classes.cardFooterText}>7% <span style={{color: "#A3A3A3"}}>of 22,765</span></div><div style={{background: "#971515", bottom: "9px"}} className={classes.osirisPill}>54% <i className="fa-solid fa-arrow-trend-down"></i></div>
                                        </div>
                                    </div>

                                    {renderArrow()}

                                    <div className={classes.cardContainer}>
                                        <div className={classes.cardSubContainer}>
                                            <div className={classes.cardHeader}>
                                                <div className={classes.cardHeaderText}>Add to Cart</div>
                                                <div className={classes.cardHeaderNumber}>862</div>
                                            </div>
                                            <div style={{flex: 0.25}} className={classes.cardBody} />
                                        </div>
                                        <div className={classes.cardFooter}>
                                            <div className={classes.cardFooterText}>54% <span style={{color: "#A3A3A3"}}>of 1,584</span></div><div style={{background: "#971515", bottom: "9px"}} className={classes.osirisPill}>63% <i className="fa-solid fa-arrow-trend-down"></i></div>
                                        </div>
                                    </div>

                                    {renderArrow()}

                                    <div className={classes.cardContainer}>
                                        <div className={classes.cardSubContainer}>
                                            <div className={classes.cardHeader}>
                                                <div className={classes.cardHeaderText}>Initiate Checkout</div>
                                                <div className={classes.cardHeaderNumber}>196</div>
                                            </div>
                                            <div style={{flex: 0.05}} className={classes.cardBody} />
                                        </div>
                                        <div className={classes.cardFooter}>
                                            <div className={classes.cardFooterText}>23% <span style={{color: "#A3A3A3"}}>of 862</span></div><div style={{background: "#971515", bottom: "9px"}} className={classes.osirisPill}>72% <i className="fa-solid fa-arrow-trend-down"></i></div>
                                        </div>
                                    </div>

                                    {renderArrow()}

                                    <div className={classes.cardContainer}>
                                        <div className={classes.cardSubContainer}>
                                            <div className={classes.cardHeader}>
                                                <div className={classes.cardHeaderText}>Purchase</div>
                                                <div className={classes.cardHeaderNumber}>86</div>
                                            </div>
                                            <div style={{flex: 0.01}} className={classes.cardBody} />
                                        </div>
                                        <div className={classes.cardFooter}>
                                            <div className={classes.cardFooterText}>44% <span style={{color: "#A3A3A3"}}>of 196</span></div><div style={{background: "#971515", bottom: "9px"}} className={classes.osirisPill}>69% <i className="fa-solid fa-arrow-trend-down"></i></div>
                                        </div>
                                    </div>

                                </div>

                                <div className={classes.sectionBreak}/>


                                <div style={{display: "flex"}}>

                                    <div style={{flex: 1, paddingRight: "80px"}}>
                                        <div className={classes.sectionSubHeading}>Visitor Locations</div>
                                        {visitors.map((visitor) => {
                                            return (<div style={{display: "flex", marginBottom: "20px"}}>
                                                <div style={{flex: 2, paddingRight: "10px"}}>{visitor.name}</div>
                                                <div style={{flex: 5, paddingRight: "20px"}}><div style={{
                                                    background: "#1F3D3B",
                                                    width: `${Math.round(visitor.length * 100)}%`,
                                                    borderRadius: "10px",
                                                    height: "20px",
                                                    opacity: visitor.opacity
                                                }}/></div>
                                                <div style={{flex: 0.5, paddingRight: "10px"}}>{visitor.number}%</div>
                                                <div style={{flex: 1}}>{visitor.value}</div>
                                            </div>);
                                        })}
                                    </div>
                                    <div style={{flex: 1}}>
                                        <div className={classes.sectionSubHeading}>Traffic Sources</div>

                                        <div style={{display: "flex"}}>
                                            {trafficSources.map((ts) => {
                                                return (<div key={ts.name} style={{background: `rgba(31, 61, 59, ${ts.opacity})`, color: ts.opacity < 0.4 ? "#1F3D3B": "", flex: ts.flex}} className={classes.trafficContainer}>
                                                    <div className={classes.trafficLabel}>{ts.name}</div>
                                                    <div className={classes.trafficNumber}>{ts.number}%</div>
                                                </div>)
                                            })}
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>);
                }}
            </Query>


        </div>)
    }

}

const DenimTearsAnalyticsHomeQuery = gql`
    query DenimTearsAnalyticsHomeQuery($user_id: String) {
        demo_users(input: {user_id: $user_id}) {
            user_id
            first_name
            last_name
            email_address

            linkedin
            instagram
            phone_number

            gender
            sexual_orientation
        }
        demo_trackings(input:{user_id: $user_id}){
            tracking_id
            user_id
            type
            version
            custom_1
            custom_2
            custom_3
            timestamp
        }
    }
`;


export default withApollo(withRouter(injectSheet(Styles)(DenimTearsAnalyticsHome)));

