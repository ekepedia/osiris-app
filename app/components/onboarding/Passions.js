import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../../services/DataService';

import COMMON from "../../common/index";
import { mc } from "../../common/helpers";
import StandardButton from "../StandardButton";
import StandardSelect from "../StandardSelect";
import UserService from "../../services/UserService";
import AuthService from "../../services/AuthService";
import StandardMultiSelect from "../StandardMultiSelect";
import StandardCheckbox from "../StandardCheckbox";
import UserPreferenceService from "../../services/UserPreferenceService";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    headerIcon: {
        height: "60px",
        width: "60px",
        marginBottom: "15px",
    },
    headerIconImg: {
        width: "100%",
    },
    headerTitle: {
        ...COMMON.FONTS.H500,
        color: COMMON.COLORS.N900
    },
    headerSubTitle: {
        ...COMMON.FONTS.H300,
        color: COMMON.COLORS.N700,
        marginBottom: "20px"
    },
    headerLabel: {
        extend: 'headerSubTitle',
        marginBottom: "5px"
    },
    buttonContainer: {
        marginTop: "20px"
    },
    backButton: {
        ...COMMON.FONTS.H300,
        color: COMMON.COLORS.N700,
        height: "32px",
        lineHeight: "32px",
        marginRight: "10px",
        display: "inline-block",
        cursor: "pointer"
    }
};

class Passions extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user_preferences: []
        };
    }

    componentDidMount() {
        this.syncWithAPI();
    }

    syncWithAPI() {
        const { client } = this.props;
        AuthService.getCurrentUserId().then((user_id) => {
            UserPreferenceService.getUserPreference({client, user_id, type_id: COMMON.CONSTS.PREFERENCE_TYPES.PASSIONS}).then((user_preferences) => {
                console.log("Loaded from API", user_preferences);
                user_preferences = user_preferences || [];
                this.setState({
                    user_preferences,
                });
            })
        });
    }

    addUserPreference({preference_id}) {
        const { client } = this.props;
        preference_id = preference_id ? preference_id + "" : preference_id;
        AuthService.getCurrentUserId().then((user_id) => {
            UserPreferenceService.createUserPreference({client, user_id, preference_id, type_id: COMMON.CONSTS.PREFERENCE_TYPES.PASSIONS}).then((user_preference_id) => {
                console.log("Created new user preference", user_preference_id);
                this.syncWithAPI();
            })
        });
    }

    removeUserPreference({user_preference_id}) {
        const { client } = this.props;
        user_preference_id = user_preference_id ? user_preference_id + "" : user_preference_id;
        UserPreferenceService.removeUserPreference({client, user_preference_id}).then((user_preference_id) => {
            console.log("Removed user preference", user_preference_id);
            this.syncWithAPI();
        })
    }

    compareUserPreferences(ids) {
        let { user_preferences } = this.state;

        user_preferences = user_preferences || [];

        ids.forEach((preference_id) => {
            let found = false;
            user_preferences.forEach((user_preference) => {
                if ((user_preference.preference_id + "") === (preference_id + ""))
                    found = true
            });

            if (!found) {
                this.addUserPreference({preference_id});
            }
        });

        user_preferences.forEach((user_preference) => {
            let found = false;
            ids.forEach((preference_id) => {
                if ((user_preference.preference_id + "") === (preference_id + ""))
                    found = true
            });

            if (!found) {
                this.removeUserPreference({user_preference_id: user_preference.user_preference_id});
            }
        });
    }

    handleBack() {
        let { back } = this.props;
        back = back || (() => {});
        back();
    }

    handleNext() {
        let { next } = this.props;
        next = next || (() => {});
        next();
    }

    render() {
        let { classes, client, match: { params } } = this.props;
        const { user_preferences } = this.state;

        return (<div className={classes.container}>
            <div className={mc(classes.headerIcon)}>
                <img className={mc(classes.headerIconImg)} src={"/img/passions-icon.png"}/>
            </div>
            <div className={mc(classes.headerTitle)}>Your Passions</div>
            <div className={mc(classes.headerSubTitle)}>What’re you passionate about? We’ll identify opportunities that meet your career goals and in areas you care about</div>

            <div>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1, paddingRight: "5px"}}>
                        <StandardMultiSelect
                            placeholder={"Select your passions"}
                            value={(user_preferences || []).map((user_preference) => ({
                                value: user_preference.preference_id,
                                label: (COMMON.CONSTS.PASSIONS_MAP[user_preference.preference_id] || {}).label
                            }))}
                            options={COMMON.CONSTS.PASSIONS}
                            onChange={(ids) => {
                                console.log("ids", ids);
                                this.compareUserPreferences(ids);
                            }}
                            hideIndicator={true}
                        />
                    </div>
                </div>
            </div>

            <div>
                <div className={mc(classes.buttonContainer)}>
                    <div className={mc(classes.backButton)} onClick={() => (this.handleBack())}>Back</div>
                    <div style={{display: "inline-block"}}>
                        <StandardButton label={"Next"} fullWidth={false} onClick={() => (this.handleNext())}/>
                    </div>
                </div>
            </div>

        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(Passions)));

