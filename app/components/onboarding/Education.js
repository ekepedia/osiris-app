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
import UserUniversityService from "../../services/UserUniversityService";

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

class Education extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user_universities: []
        };
    }

    componentDidMount() {
        this.syncWithAPI();
    }

    syncWithAPI() {
        const { client } = this.props;
        AuthService.getCurrentUserId().then((user_id) => {
            UserUniversityService.getUserUniversity({client, user_id}).then((user_universities) => {
                console.log("Loaded from API", user_universities);
                user_universities = user_universities || [];
                this.setState({
                    user_universities,
                });
            })
        });

    }

    addUserUniversity({university_id}) {
        const { client } = this.props;
        university_id = university_id ? university_id + "" : university_id;
        AuthService.getCurrentUserId().then((user_id) => {
            UserUniversityService.createUserUniversity({client, user_id, university_id}).then((user_university_id) => {
                console.log("Created new user university", user_university_id);
                this.syncWithAPI();
            })
        });
    }

    removeUserUniversity({user_university_id}) {
        const { client } = this.props;
        user_university_id = user_university_id ? user_university_id + "" : user_university_id;
        UserUniversityService.removeUserUniversity({client, user_university_id}).then((user_university_id) => {
            console.log("Removed user university", user_university_id);
            this.syncWithAPI();
        })
    }

    compareUserUniversity(ids) {
        let { user_universities } = this.state;

        user_universities = user_universities || [];

        ids.forEach((university_id) => {
            let found = false;
            user_universities.forEach((user_university) => {
                if ((user_university.university_id + "") === (university_id + ""))
                    found = true
            });

            if (!found) {
                this.addUserUniversity({university_id});
            }
        });

        user_universities.forEach((user_university) => {
            let found = false;
            ids.forEach((university_id) => {
                if ((user_university.university_id + "") === (university_id + ""))
                    found = true
            });

            if (!found) {
                this.removeUserUniversity({user_university_id: user_university.user_university_id});
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
        const { user_universities } = this.state;

        return (<div className={classes.container}>
            <div className={mc(classes.headerIcon)}>
                <img className={mc(classes.headerIconImg)} src={"/img/education-icon.png"}/>
            </div>
            <div className={mc(classes.headerTitle)}>Educational Background</div>
            <div className={mc(classes.headerSubTitle)}>Where did you go to school?</div>

            <div>
                <div style={{display: "flex"}}>
                    <div style={{flex: 1, paddingRight: "5px"}}>
                        <StandardMultiSelect
                            max={100}
                            placeholder={"Select your school"}
                            value={(user_universities || []).map((user_university) => ({
                                value: user_university.university_id,
                                label: (COMMON.CONSTS.UNIVERSITIES_MAP[user_university.university_id] || {}).label
                            }))}
                            options={COMMON.CONSTS.UNIVERSITIES}
                            onChange={(ids) => {
                                console.log("ids", ids);
                                this.compareUserUniversity(ids);
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

export default withApollo(withRouter(injectSheet(Styles)(Education)));

