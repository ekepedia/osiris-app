import React from "react";
import { Switch, Route } from 'react-router-dom';

import Jobs from "../../scenes/Jobs/index";
import Home from "../../scenes/Home/index";
import UserPortfolio from "../../scenes/UserPortfolio/index";
import PublicPortfolio from "../../scenes/PublicPortfolio/index";
import Login from "../../scenes/Login/index";
import ClaimPortfolio from "../../scenes/ClaimPortfolio/index";
import CompanyIndex from "../../scenes/CompanyIndex/index";
import CompanyPage from "../../scenes/CompanyPage/index";
import SavedJobs from "../../scenes/SavedJobs/index";
import SignUp from "../../scenes/SignUp/index";
import Settings from "../../scenes/Settings/index";
import ResetPassword from "../../scenes/ResetPassword/index";
import ForgotPassword from "../../scenes/ForgotPassword/index";

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
                    <Route exact path='/forgot-password' component={ForgotPassword}/>
                    <Route exact path='/osiris-onboarding' component={SignUp}/>
                    <Route exact path='/claim/:user_id' component={ClaimPortfolio}/>
                    <Route exact path='/reset-password/:reset_password_code' component={ResetPassword}/>
                    <Route exact path='/jobs' component={Jobs}/>
                    <Route exact path='/edit/:user_id' component={UserPortfolio}/>
                    <Route exact path='/settings/:user_id' component={Settings}/>
                    <Route exact path='/u/:username' component={PublicPortfolio}/>
                    <Route exact path='/ue/:username' component={PublicPortfolio}/>

                    <Route exact path='/saved-jobs/:user_id' component={SavedJobs}/>
                    <Route exact path='/companies' component={CompanyIndex}/>
                    <Route exact path='/companies/:company_id' component={CompanyPage}/>
                </Switch>
            </main>
        );
    }
}

export default withApollo(Routing)