import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import {Mutation, Query} from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';
import DataService from '../../services/DataService';


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
};

class GodViewUser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            full_name: "",
            email: "",
            race: "",
            state: 1,
            type: null,
        };

    }

    componentDidMount() {
        let { classes, client, match: { params } } = this.props;
        const user_id = params ? params.user_id : null;

        let openTime = new Date().getTime().toString();

        DataService.openPageSession({client, user_id, page: window.location.pathname}).then((tracking_id) =>{
            console.log("Opened page session", tracking_id)

            this.pageSessionPing = setInterval(() => {
                const custom_1 = (new Date().getTime() - openTime).toString();

                DataService.updatePageSession({client, tracking_id, custom_1}).then(() => {
                })
            }, 1000);
        });
    }

    componentWillUnmount() {
        clearInterval(this.pageSessionPing)
    }

    render() {
        let { classes, client, match: { params } } = this.props;
        const user_id = params ? params.user_id : null;

        const WHITE = "#F2EFEC";

        const summary = [1];

        return (<div className={classes.container}>

            <Query query={GodViewUserQuery} fetchPolicy={"network-only"}
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

                    demo_trackings = _.reverse(_.sortBy(demo_trackings, 'timestamp', true));

                    let created = demo_trackings[demo_trackings.length - 1] || {};

                    demo_trackings.forEach((demo_tracking, i) => {
                        if ((demo_tracking.type === "2" || demo_tracking.type === "1" ) && !last_login.timestamp) {
                            login_total++;
                            last_login = demo_tracking;
                        }

                        if ((demo_tracking.type === "2" || demo_tracking.type === "1" ) ) {
                            login_total++;
                        }
                    })

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
                                            <div style={{fontSize: "17px", marginTop: "5px"}}>OSIRIS Works</div>
                                            <div style={{fontSize: "12px", color: "#B8965E"}}>Admin</div>
                                        </div>
                                    </div>

                                    <div>
                                        <Link to={"/soho-review/3"}>
                                            <div style={{display: "none", color: WHITE, textDecoration: "none", padding: "15px 17px", background: "", borderRadius: "7px", marginBottom: "10px", cursor: "pointer"}}>
                                                <div style={{flex: "0 0 40px", textAlign: "center"}}>
                                                    O
                                                </div>
                                                <div style={{flex: 1, fontSize: "15px"}}>
                                                    <div>Soho Applications</div>
                                                </div>
                                            </div>
                                        </Link>
                                        <Link to={"/god-view/3"}>
                                            <div style={{display: "flex", color: WHITE, textDecoration: "none", padding: "15px 17px", background: "#627775", borderRadius: "7px", marginBottom: "15px", cursor: "pointer"}}>
                                                <div style={{flex: "0 0 40px", textAlign: "center"}}>
                                                    <div style={{paddingTop: "4px", fontSize: "13px"}}>
                                                        <i className="fa-solid fa-database"></i>
                                                    </div>
                                                </div>
                                                <div style={{flex: 1, fontSize: "15px"}}>
                                                    <div>God View</div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>

                                    <div style={{display: "flex", padding: "0 15px", position: "absolute", bottom: "0"}}>
                                        <div style={{flex: "0 0 50px", paddingRight: "10px"}}>
                                            <div style={{width: "50px", height: "50px", lineHeight: "50px", fontSize: "20px", background: "#B8965E", color: WHITE, borderRadius: "11px", textAlign: "center"}}>
                                                {initial}
                                            </div>
                                        </div>
                                        <div style={{flex: 1}}>
                                            <div style={{fontSize: "17px", marginTop: "5px", textTransform: "capitalize"}}>{user.first_name} {user.last_name}</div>
                                            <div style={{fontSize: "12px", color: "#B8965E", textTransform: "lowercase"}}>{user.email_address}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div style={{flex: 10, padding: "40px 40px", background: WHITE, height: "100%", overflowY: "scroll"}}>
                                <div style={{marginBottom: "40px",display:"none", width: "100%", overflowX: "scroll", height: "100px",}}>
                                    {summary.map((s) => {
                                        return (<div key={s} style={{display: "inline-block", whiteSpace: "normal", background: "#F5F4F4", padding: "20px", height: "100px", width: "200px", border: "1px solid #EBE3D6", marginRight: "20px"}}>
                                            <div>Total Logins</div>
                                            <div>{login_total}</div>
                                        </div>);
                                    })}
                                </div>
                                <div style={{marginBottom: "40px"}}>
                                    <div className={classes.sectionHeading} style={{marginBottom: "20px"}}>
                                        Member Activity
                                    </div>
                                    <div>

                                        {demo_trackings.map((demo_tracking) => {

                                            return (<div key={demo_tracking.tracking_id} style={{display: "flex", padding: "10px", background: demo_tracking.type === "2" ? "#1F3D3B" : (demo_tracking.type === "1" ? "#B8965E" : ""), borderRadius: "10px", color: demo_tracking.type === "2" || demo_tracking.type === "1" ? WHITE : "#1F3D3B", border: "1px solid #EBE3D6", marginBottom: "10px"}}>
                                                <div style={{flex: 1}}>
                                                    {demo_tracking.type === "2" ? "Login" : (demo_tracking.type === "4" ? "Site Session" : (demo_tracking.type === "1" ? "Sign Up" : "Page Session"))}
                                                </div>
                                                <div style={{flex: 1}}>
                                                    {moment(parseFloat(demo_tracking.timestamp)).format('M/DD H:mm a')}
                                                </div>
                                                <div style={{flex: 1}}>
                                                    {demo_tracking.custom_1 && demo_tracking.type !== "1" ? moment.utc(moment.duration(demo_tracking.custom_1).as('milliseconds')).format('mm:ss'): ""}
                                                </div>
                                                <div style={{flex: 1}}>
                                                    {demo_tracking.custom_3}
                                                </div>
                                            </div>);


                                        })}
                                    </div>
                                </div>
                            </div>


                            <div style={{flex: 5, padding: "40px 40px", background: "#F1EEE9", height: "100%", borderLeft: "1px solid #EBE3D6"}}>
                                <div style={{marginBottom: "40px"}}>
                                    <div style={{fontSize: "15px", textAlign: "center", marginBottom: "10px", fontWeight: 600}}>
                                        Member
                                    </div>
                                    <div style={{border: "2px solid #1F3D3B", borderRadius: "7px", background: "#E9E7E2", padding: "20px"}}>
                                        <div>
                                            <div style={{display: "flex"}}>
                                                <div style={{flex: "0 0 50px", paddingRight: "10px"}}>
                                                    <div style={{width: "50px", height: "50px", lineHeight: "50px", fontSize: "20px", background: "#B8965E", color: WHITE, borderRadius: "11px", textAlign: "center"}}>
                                                        {initial}
                                                    </div>
                                                </div>
                                                <div style={{flex: 1}}>
                                                    <Link to={`/god-view/${user.user_id}`}>
                                                        <div style={{fontSize: "17px", fontWeight: 600, marginTop: "0", textDecoration: "none", color: "#1F3D3B", textTransform: "capitalize"}}>{user.first_name} {user.last_name}</div>
                                                    </Link>
                                                    <div style={{fontSize: "12px", textTransform: "lowercase"}}>{user.email_address}</div>
                                                    <div style={{fontSize: "12px", textTransform: "lowercase"}}>Account Level: {status}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div style={{marginBottom: "40px"}}>
                                    <div style={{fontSize: "15px", marginBottom: "10px", textAlign: "center", fontWeight: 600}}>
                                        Created
                                    </div>
                                    <div style={{border: "1px solid #CDD8D5", textAlign: "center", fontSize: "20px", borderRadius: "7px", background: "#E9E7E2", padding: "20px"}}>
                                        <div>
                                            <div style={{display: "flex"}}>
                                                <div style={{flex: 1}}>
                                                    {moment(parseFloat(created.timestamp)).format('M/DD H:mm a')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{marginBottom: "40px"}}>
                                    <div style={{fontSize: "15px", marginBottom: "10px", textAlign: "center", fontWeight: 600}}>
                                        Last Login
                                    </div>
                                    <div style={{border: "1px solid #CDD8D5", textAlign: "center", fontSize: "20px", borderRadius: "7px", background: "#E9E7E2", padding: "20px"}}>
                                        <div>
                                            <div style={{display: "flex"}}>
                                                <div style={{flex: 1}}>
                                                    {moment(parseFloat(last_login.timestamp)).format('M/DD H:mm a')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{marginBottom: "40px"}}>
                                    <div style={{fontSize: "15px", marginBottom: "10px", textAlign: "center", fontWeight: 600}}>
                                        Total Logins
                                    </div>
                                    <div style={{border: "1px solid #CDD8D5", textAlign: "center", fontSize: "30px", borderRadius: "7px", background: "#E9E7E2", padding: "20px"}}>
                                        <div>
                                            <div style={{display: "flex"}}>
                                                <div style={{flex: 1}}>
                                                    {login_total}
                                                </div>
                                            </div>
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

const GodViewUserQuery = gql`
    query GodViewUserQuery($user_id: String) {
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


export default withApollo(withRouter(injectSheet(Styles)(GodViewUser)));

