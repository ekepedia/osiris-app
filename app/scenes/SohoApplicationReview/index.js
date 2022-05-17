import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import {Mutation, Query} from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        }
    },
};

class SohoApplicationReview extends React.Component {

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

    }

    render() {
        let { classes } = this.props;

        const WHITE = "#F2EFEC";

        const activity = [1,2,3,4,5,];
        const summary = [1,2,3,];

        return (<div className={classes.container}>
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
                                <div style={{display: "flex", color: WHITE, textDecoration: "none", padding: "15px 17px", background: "", borderRadius: "7px", marginBottom: "10px", cursor: "pointer"}}>
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
                                        O
                                    </div>
                                    <div style={{flex: 1, fontSize: "15px"}}>
                                        <div>God View</div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div style={{display: "flex", padding: "0 15px", position: "absolute", bottom: "0"}}>
                            <div style={{flex: "0 0 50px", paddingRight: "10px"}}>
                                <div style={{width: "50px", height: "50px", lineHeight: "50px", fontSize: "30px", background: "#B8965E", color: WHITE, borderRadius: "11px", textAlign: "center"}}>
                                    M
                                </div>
                            </div>
                            <div style={{flex: 1}}>
                                <div style={{fontSize: "17px", marginTop: "5px"}}>Miles Weddle</div>
                                <div style={{fontSize: "12px", color: "#B8965E"}}>miles@osiris.works</div>
                            </div>
                        </div>


                    </div>
                </div>


                <div style={{flex: 10, padding: "40px 40px", background: WHITE, height: "100%"}}>


                    <div style={{marginBottom: "40px"}}>
                        <div style={{marginBottom: "20px"}}>
                            Company
                        </div>
                        <div>
                            <div style={{display: "flex", padding: "10px", background: "#F5F4F4", border: "1px solid #EBE3D6", marginBottom: "10px"}}>
                                <div style={{flex: 1}}>
                                    $300K in Funding
                                </div>
                                <div style={{flex: 1}}>
                                    23 Employees
                                </div>
                                <div style={{flex: 1}}>
                                    Engineering
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{marginBottom: "40px"}}>
                        <div style={{display: "flex",}}>
                            <div style={{flex: 1}}>
                                <div style={{marginBottom: "5px"}}>Elevator Pitch</div>
                                <div>blach blach</div>
                            </div>
                            <div style={{flex: 1}}>
                                <div style={{marginBottom: "5px"}}>Pitch Deck</div>
                                <div>Download ICON</div>
                            </div>
                        </div>
                    </div>


                    <div style={{marginBottom: "40px"}}>
                        <div style={{marginBottom: "5px"}}>
                            Essay 1
                        </div>
                        <div>
                            blach blach
                        </div>
                    </div>


                    <div style={{marginBottom: "40px"}}>
                        <div style={{marginBottom: "5px"}}>
                            Essay 2
                        </div>
                        <div>
                            blach blach
                        </div>
                    </div>
                </div>


                <div style={{flex: 5, padding: "40px 40px", background: "#F1EEE9", height: "100%", borderLeft: "1px solid #EBE3D6"}}>
                    <div style={{marginBottom: "60px"}}>
                        <div>
                            Founder
                        </div>
                        <div style={{border: "1px solid #1F3D3B", background: "#E9E7E2", padding: "20px"}}>
                            <div>
                                <div style={{display: "flex"}}>
                                    <div style={{flex: "0 0 50px"}}>
                                        M
                                    </div>
                                    <div style={{flex: 1}}>
                                        <div>Miles Weddle</div>
                                        <div>miles@osiris.works</div>
                                        <div>Account Level: 1</div>
                                    </div>
                                </div>
                                <div>
                                    <div>INFO 1</div>
                                    <div>INFO 2</div>
                                    <div>INFO 3</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{marginBottom: "60px"}}>
                        <div>
                            Application Created
                        </div>
                        <div style={{border: "1px solid #1F3D3B", background: "#E9E7E2", padding: "20px"}}>
                            <div>
                                <div style={{display: "flex"}}>
                                    <div style={{flex: 1}}>
                                        April 2, 2022
                                    </div>
                                    <div style={{flex: 1}}>
                                        <div>12:30</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{marginBottom: "60px"}}>
                        <div>
                            Application Submitted
                        </div>
                        <div style={{border: "1px solid #1F3D3B", background: "#E9E7E2", padding: "20px"}}>
                            <div>
                                <div style={{display: "flex"}}>
                                    <div style={{flex: 1}}>
                                        April 2, 2022
                                    </div>
                                    <div style={{flex: 1}}>
                                        <div>12:30</div>
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

export default withApollo(withRouter(injectSheet(Styles)(SohoApplicationReview)));

