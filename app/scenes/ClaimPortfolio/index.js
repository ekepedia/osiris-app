import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';
import { COLOR_WHITE } from "../../common/colors";
import axios from "axios";
import UserService from "../../services/UserService";
import CoverImageHolder from "../../components/CoverImageHolder";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    }
};

class ClaimPortfolio extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {}
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
                last_name: user.last_name
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
            }
        })
    }

    render() {
        let { classes, client, match: { params } } = this.props;

        const { username, password, user } = this.state;

        return (<div className={classes.container}>
            <div style={{display: "flex"}}>
                <div>CLAIM PAGE</div>

                <div style={{flex: 1}}>
                    <div>Username</div>
                    <input value={username} onChange={(e) => {
                        this.setState({username: e.target.value})
                    }}/>
                    <div>Password</div>
                    <input value={password} onChange={(e) => {
                        this.setState({password: e.target.value})
                    }}/>

                    <div>{username}, {password}</div>
                    <button onClick={() => {
                        this.signup();
                    }}>CLAIM</button>
                </div>
                <div style={{flex: 1}}>
                    <div>USER CLAIMED</div>
                    <div>{user.first_name} {user.last_name}</div>
                    <div style={{height: "100px", width: "100px"}}>
                        <CoverImageHolder url={user.profile_photo_url}/>
                    </div>
                </div>
            </div>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(ClaimPortfolio)));

