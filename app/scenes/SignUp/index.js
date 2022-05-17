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
    heading: {
        fontSize: "30px",
        marginBottom: "10px",
        fontWeight: "600"
    },
    osirisPill: {
        background: "#1F3D3B",
        display: "inline-block",
        color: "#F2EFEC",
        padding: "3px 9px",
        fontWeight: 600,
        fontSize: "12px",
        borderRadius: "15px",
        marginRight: "5px"
    },
    submitButtom: {
        background: "#1F3D3B",
        padding: "10px 20px",
        color: "#F2EFEC",
        fontWeight: 600,
        borderRadius: "7px",
        width: "100px",
        margin: "auto"
    }
};

class SohoApplication extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            full_name: "",
            email: "",
            race: "",
            state: 1,
            type: null,
        };

        this.timeouts = {};

        this.changeState = this.changeState.bind(this);
    }

    changeState(state) {
        this.setState({state})
    }

    componentDidMount() {

    }

    renderInput(application_id, field, data, label, updateFunction, refetch, type) {
        let { client, match: { params } } = this.props;
        const user_id = params ? params.user_id : null;

        const update = (e) => {
            this.setState({
                [field]: e.target.value
            });

            let payload = {
                client,
                user_id,
                application_id
            };

            payload[field] = e.target.value;

            clearTimeout(this.timeouts[field]);

            this.timeouts[field] = setTimeout(() => {
                if (updateFunction) updateFunction(payload).then(() => {
                    if (refetch) refetch();
                })

            }, 400);
        }

        return (<div>
            <div style={{
                fontSize: "15px",
                marginBottom: "5px"
            }}>{label}</div>

            {type && type === "textarea" ?
                <textarea
                    style={{
                        width: "100%",
                        marginBottom: "30px",
                        marginTop: "10px",
                        height: "300px",
                        padding: "20px",

                        background: "#F5F4F4",
                        border: "1px solid #EBE3D6"
                    }}
                    onChange={(e) => { update(e) }}
                    value={this.state[field] === undefined ? data[field] : this.state[field]}
                />
                :
                <input
                    style={{
                        width: "100%",
                        height: "50px",
                        marginBottom: "30px",
                        lineHeight: "50px",
                        fontSize: "15px",
                        padding: "0 10px",
                        background: "#F5F4F4",
                        border: "1px solid #EBE3D6"
                    }}
                    onChange={(e) => { update(e) }}
                    value={this.state[field] === undefined ? data[field] : this.state[field]}
                />}

        </div>)
    }


    render() {
        let { classes, client, match: { params } } = this.props;
        const user_id = params ? params.user_id : null;

        const login = window.location.pathname === "/sign-in";

        const WHITE = "#F2EFEC";

        return (<div className={classes.container}>

            <div>

                    <div>
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
                                            <div style={{fontSize: "17px", marginTop: "13px"}}>OSIRIS x Soho House</div>
                                        </div>
                                    </div>

                                    <div>
                                        <Link to={"/sign-up"}>
                                            <div style={{display: "flex", textDecoration: "none", color: WHITE, padding: "15px 17px", background: !login ? "#627775" : "", borderRadius: "7px", marginBottom: "10px", cursor: "pointer"}}>
                                                <div style={{flex: "0 0 40px", textAlign: "center"}}>
                                                    <div style={{paddingTop: "4px", fontSize: "13px"}}>
                                                        <i className="fa-solid fa-file"></i>
                                                    </div>
                                                </div>
                                                <div style={{flex: 1, fontSize: "15px"}}>
                                                    <div>Start New Application</div>
                                                </div>
                                            </div>
                                        </Link>

                                        <Link to={"/sign-in"}>
                                            <div style={{display: "flex", textDecoration: "none", color: WHITE, padding: "15px 17px", background: login ? "#627775" : "", borderRadius: "7px", marginBottom: "10px", cursor: "pointer"}}>
                                                <div style={{flex: "0 0 40px", textAlign: "center"}}>
                                                    <div style={{paddingTop: "4px", fontSize: "13px"}}>
                                                        <i className="fa-solid fa-file"></i>
                                                    </div>
                                                </div>
                                                <div style={{flex: 1, fontSize: "15px"}}>
                                                    <div>Continue Application</div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>


                                </div>
                            </div>


                            <div style={{flex: 14, padding: "40px 40px", overflow: "scroll", textAlign: "center", background: WHITE, height: "100%"}}>

                                <div>
                                    <div style={{border: "2px solid #CDD8D5", padding: "30px 20px", borderRadius: "10px", width: "40%", margin: "auto", marginTop: "50px"}}>
                                        <div style={{fontSize: "25px"}} className={classes.sectionHeading}>{login ? "Continue" : "Begin"} Your Application</div>

                                        <div>
                                            <div style={{fontSize: "15px", margin: "30px 0"}}>
                                                {login ? "Welcome back! Let's pick up where you left off." : "Let's get started with your application! Create an account to being your application process"}

                                            </div>
                                            <div style={{fontSize: "15px", marginBottom: "10px", fontWeight: 600}}>
                                                Email Address
                                            </div>
                                            <input style={{
                                                width: "100%",
                                                height: "50px",
                                                marginBottom: "30px",
                                                lineHeight: "50px",
                                                fontSize: "15px",
                                                padding: "0 10px",
                                                background: "#F5F4F4",
                                                border: "1px solid #EBE3D6",
                                                textAlign:"center"
                                            }}
                                                   value={this.state.email_address}
                                                   onChange={(e) => {
                                                       this.setState({email_address: e.target.value})
                                                   }}
                                            />
                                            <div style={{fontSize: "15px", marginBottom: "10px", fontWeight: 600}}>
                                                Password
                                            </div>
                                            <input style={{
                                                width: "100%",
                                                height: "50px",
                                                marginBottom: "30px",
                                                lineHeight: "50px",
                                                fontSize: "15px",
                                                padding: "0 10px",
                                                background: "#F5F4F4",
                                                border: "1px solid #EBE3D6",
                                                textAlign:"center"
                                            }}
                                                   type={"password"}
                                                   value={this.state.password}
                                                   onChange={(e) => {
                                                       this.setState({password: e.target.value})
                                                   }}
                                            />
                                        </div>

                                        <div>

                                            <Query query={SignUpQuery} fetchPolicy={"network-only"} variables={{email_address: this.state.email_address}}>
                                                {({ loading, error, data, refetch }) => {


                                                    const renderFunc = (user) => {




                                                        return (<div>
                                                            {user && user.user_id ?
                                                                <Link to={`soho-application/${user.user_id}`} onClick={() => {
                                                                    localStorage.user_id = user.user_id;
                                                                    DataService.trackEvent({client, user_id: user.user_id, type: "2"}).then((a) => {
                                                                        console.log(a)
                                                                    })
                                                                }}>
                                                                    <div className={classes.submitButtom}>Continue</div>
                                                                </Link>
                                                                :
                                                                <div onClick={() => {
                                                                    DataService.createUser({client, email_address: this.state.email_address}).then((user_id) => {
                                                                        DataService.createApplication({client, user_id}).then((application_id) => {
                                                                            console.log(user_id, application_id);
                                                                            window.location = `/soho-application/${user_id}`;
                                                                            localStorage.user_id = user.user_id;

                                                                            DataService.trackEvent({client, user_id: user_id.toString(), type: "1", custom_1: this.state.email_address});
                                                                        })
                                                                    })

                                                                }}>
                                                                    <div className={classes.submitButtom}>Continue</div>
                                                                </div>

                                                            }
                                                        </div>)
                                                    }



                                                    if (loading) return renderFunc({});
                                                    if (error) return <p>Error Loading User</p>;

                                                    const user = data.demo_users && data.demo_users.length ? data.demo_users[0] : {};
                                                    return renderFunc(user)
                                                }}
                                            </Query>

                                        </div>
                                    </div>



                                </div>


                            </div>


                        </div>
                    </div>
            </div>


        </div>)
    }

}

const SignUpQuery = gql`
    query SignUpQuery($email_address: String) {
        demo_users(input: {email_address: $email_address}) {
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
    }
`;

export default withApollo(withRouter(injectSheet(Styles)(SohoApplication)));

