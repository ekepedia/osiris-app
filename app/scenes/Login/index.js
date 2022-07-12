import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';
import { COLOR_WHITE } from "../../common/colors";
import axios from "axios";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    }
};

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {

    }

    login() {
        const { username, password } = this.state;

        axios.post("/api/login", {username, password}).then((data) => {
            console.log("LOGIN", data.data);

            if (data.data.success) {
                window.location.pathname = `/edit/${data.data.data.user_login.user_id}`;
            }
        })
    }

    render() {
        let { classes, client, match: { params } } = this.props;

        const { username, password } = this.state;

        return (<div className={classes.container}>
            <div>LOGIN PAGE</div>

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
                this.login();
            }}>LOGIN</button>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(Login)));

