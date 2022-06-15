import React from "react";
import { Switch, Route } from 'react-router-dom';

import Jobs from "../../scenes/Jobs/index";
import Home from "../../scenes/Home/index";

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
                    <Route exact path='/jobs' component={Jobs}/>
                </Switch>
            </main>
        );
    }
}

export default withApollo(Routing)