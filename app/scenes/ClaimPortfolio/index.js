import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';
import { COLOR_WHITE } from "../../common/colors";
import COMMON from "../../common/index";
import axios from "axios";
import UserService from "../../services/UserService";
import CoverImageHolder from "../../components/CoverImageHolder";
import NavBar from "../../components/NavBar";
import {mc} from "../../common/helpers";
import ClaimModal from "./components/ClaimModal";
import StandardButton from "../../components/StandardButton";

const Styles = {
    container: {
        padding: "0",
        height: "100%",
        overflow: "hidden",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    ...COMMON.STYLES.PORTFOLIO.ClaimPortfolioStyles,
    ...COMMON.STYLES.GENERAL.AlignmentStyles,
};

class ClaimPortfolio extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {},
            openClaimModal: false
        };
    }

    componentDidMount() {
        let { client } = this.props;
        let {  match: { params } } = this.props;


        UserService.getUser({client, user_id: params.user_id}).then((user) => {
            console.log("user,", user);
            user = user || {};
            this.setState({
                user,
                loading_user: false,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
            });
        })

    }

    signup() {
        const {  password} = this.state;
        let {  match: { params } } = this.props;

        axios.post("/api/sign-up", {user_id: params.user_id, password}).then((data) => {
            console.log(data.data)

            if (data.data.success) {
                window.location.pathname = `/edit/${data.data.data.user_id}`;
                localStorage.user_id = data.data.data.user_id;
            }
        })
    }

    render() {
        let { classes, client, match: { params } } = this.props;

        const { username, password, user } = this.state;

        return (<div className={classes.container}>
            <NavBar />
            <div style={{height: "calc(100% - 65px)"}}>

                <div className={mc(classes.subContainer)}>
                    <div style={{display: "flex", height: "fit-content"}} >
                        <div style={{flex: 0.44}} >

                            <div className={mc(classes.centerAlignContainer)} style={{height:"100%", width: "100%"}}>
                                <div className={mc(classes.verticalAlignObject)}>
                                    <div className={mc(classes.headerTitle)}>Welcome to OSIRIS, {user.first_name} 👋🏾</div>

                                    <div className={mc(classes.bodyText)}>
                                        <span>You're one of the first people to get access to our platform!</span> We're building a professional network for the multi-hyphenate generation.<br/>
                                        <br/>
                                        <span>We've created a unique OSIRIS Portfolio for you that serves as your user profile on OSIRIS and is a shareable link in bio tool.</span> We'd love to have you on our platform.<br/>
                                        <br/>
                                        Best,<br/>
                                        <div>
                                            <img className={mc(classes.imageSignature)} src={"/img/Miles & Eke.png"}/>
                                        </div>
                                    </div>

                                    <div className={mc(classes.buttonContainer)}>
                                        <StandardButton label={"Claim Portfolio →"} onClick={() => (this.setState({openClaimModal: true}))}/>
                                    </div>
                                </div>
                            </div>



                            <ClaimModal onClose={() => {this.setState({openClaimModal: false})}} onSubmit={() => {this.signup(); this.setState({openClaimModal: false})}} open={this.state.openClaimModal} {...{username, password}} onUpdate={(field, v) => {
                                this.setState({[field]: v});
                            }}/>

                        </div>
                        <div style={{flex: 0.56, height: "fit-content"}}>
                            <div className={mc(classes.iframeSuperContainer)}>
                                <div className={mc(classes.iframeContainer)}>
                                    <iframe  className={mc(classes.iframe)} src={"/ue/" + user.username} />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(ClaimPortfolio)));

