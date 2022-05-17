import React from "react";
import { Switch, Route } from 'react-router-dom';

import DataService from "../../services/DataService";

import Home from "../../scenes/Home/index";
import SignUp from "../../scenes/SignUp/index";
import Feedback from "../../scenes/Feedback/index";
import Jobs from "../../scenes/Jobs/index";
import Apply from "../../scenes/Apply/index";
import GodViewUser from "../../scenes/GodViewUser/index";
import SohoApplicationReview from "../../scenes/SohoApplicationReview/index";
import SohoApplication from "../../scenes/SohoApplication/index";
import DenimTearsAnalyticsHome from "../../scenes/DenimTearsAnalyticsHome/index";

import {withApollo} from "react-apollo";

class Routing extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let { classes, client } = this.props;

        // const user_id = localStorage.user_id;
        //
        // let openTime = new Date().getTime().toString();
        //
        // DataService.openPageSession({client, user_id, site: true,}).then((tracking_id) =>{
        //     console.log("Opened site session", tracking_id)
        //
        //     this.siteSessionPing = setInterval(() => {
        //         const custom_1 = (new Date().getTime() - openTime).toString();
        //
        //         DataService.updatePageSession({client, tracking_id, custom_1}).then(() => {
        //         })
        //     }, 1000);
        // });
    }

    componentWillUnmount() {
        clearInterval(this.siteSessionPing)
    }

    render() {
        return (
            <main>
                <Switch>
                    <Route exact path='/' component={Jobs}/>
                    <Route exact path='/jobs' component={Jobs}/>
                    {/*<Route exact path='/' component={Home}/>*/}
                    {/*<Route exact path='/apply' component={Apply}/>*/}

                    {/*<Route exact path='/sign-up' component={SignUp}/>*/}
                    {/*<Route exact path='/feedback' component={Feedback}/>*/}
                    {/*<Route exact path='/join' component={SignUp}/>*/}
                    {/*<Route exact path='/sign-in' component={SignUp}/>*/}

                    {/*<Route exact path='/soho-application/:user_id' component={SohoApplication}/>*/}
                    {/*<Route exact path='/soho-review/:user_id' component={SohoApplicationReview}/>*/}

                    {/*<Route exact path='/god-view/:user_id' component={GodViewUser}/>*/}

                    {/*<Route exact path='/dashboard/analytics' component={DenimTearsAnalyticsHome}/>*/}
                </Switch>
            </main>
        );
    }
}

export default withApollo(Routing)