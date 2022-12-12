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
import UserRaceService from "../../services/UserRaceService";
import StandardCheckbox from "../StandardCheckbox";

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

class Race extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gender_id: null,
            user_races: []
        };
    }

    componentDidMount() {
        this.syncWithAPI();
    }

    syncWithAPI() {
        const { client } = this.props;
        AuthService.getCurrentUserId().then((user_id) => {
            UserRaceService.getUserRace({client, user_id}).then((user_races) => {
                console.log("Loaded from API", user_races);
                user_races = user_races || [];
                this.setState({
                    user_races,
                });
            })
        });

    }

    addUserRace({race_id}) {
        const { client } = this.props;
        race_id = race_id ? race_id + "" : race_id;
        AuthService.getCurrentUserId().then((user_id) => {
            UserRaceService.createUserRace({client, user_id, race_id}).then((user_race_id) => {
                console.log("Created new user race", user_race_id);
                this.syncWithAPI();
            })
        });
    }

    removeUserRace({user_race_id}) {
        const { client } = this.props;
        user_race_id = user_race_id ? user_race_id + "" : user_race_id;
        UserRaceService.removeUserRace({client, user_race_id}).then((user_race_id) => {
            console.log("Removed user race", user_race_id);
            this.syncWithAPI();
        })
    }

    compareUserRace(ids) {
        let { user_races } = this.state;

        user_races = user_races || [];

        ids.forEach((race_id) => {
            let found = false;
            user_races.forEach((user_race) => {
                if ((user_race.race_id + "") === (race_id + ""))
                    found = true
            });

            if (!found) {
                this.addUserRace({race_id});
            }
        });

        user_races.forEach((user_race) => {
            let found = false;
            ids.forEach((race_id) => {
                if ((user_race.race_id + "") === (race_id + ""))
                    found = true
            });

            if (!found) {
                this.removeUserRace({user_race_id: user_race.user_race_id});
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
        const { gender_id, user_races } = this.state;

        return (<div className={classes.container}>
            <div className={mc(classes.headerIcon)}>
                <img className={mc(classes.headerIconImg)} src={"/img/race-icon.png"}/>
            </div>
            <div className={mc(classes.headerTitle)}>Ethnicity</div>
            <div className={mc(classes.headerSubTitle)}>What is your ethnicity?</div>

            <div>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1, paddingRight: "5px"}}>
                        <StandardMultiSelect
                            placeholder={"Select your ethnicity"}
                            value={(user_races || []).map((user_race) => ({
                                value: user_race.race_id,
                                label: (COMMON.CONSTS.RACES_MAP[user_race.race_id] || {}).label
                            }))}
                            options={COMMON.CONSTS.RACES}
                            onChange={(ids) => {
                                console.log("ids", ids);
                                this.compareUserRace(ids);
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

export default withApollo(withRouter(injectSheet(Styles)(Race)));

