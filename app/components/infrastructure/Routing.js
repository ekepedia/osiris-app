import React from "react";
import { Switch, Route } from 'react-router-dom';

import Jobs from "../../scenes/Jobs/index";
import Home from "../../scenes/Home/index";
import UserPortfolio from "../../scenes/UserPortfolio/index";
import PublicPortfolio from "../../scenes/PublicPortfolio/index";
import Login from "../../scenes/Login/index";
import ClaimPortfolio from "../../scenes/ClaimPortfolio/index";

import {withApollo} from "react-apollo";

class Routing extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <main>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/login' component={Login}/>
                    <Route exact path='/claim/:user_id' component={ClaimPortfolio}/>
                    <Route exact path='/jobs' component={Jobs}/>
                    <Route exact path='/edit/:user_id' component={UserPortfolio}/>
                    <Route exact path='/u/:username' component={PublicPortfolio}/>
                </Switch>
            </main>
        );
    }
}

export default withApollo(Routing)