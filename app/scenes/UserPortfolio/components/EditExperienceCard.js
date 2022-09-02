import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import COMMON from "../../../common/index";
import { mc } from "../../../common/helpers";
import CoverImageHolder from "../../../components/CoverImageHolder";
import UserExperienceService from "../../../services/UserExperienceService";
import UserEducationService from "../../../services/UserEducationService";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    ...COMMON.STYLES.GENERAL.alignmentStyles,
    ...COMMON.STYLES.PORTFOLIO.StandardCardStyles,
    ...COMMON.STYLES.PORTFOLIO.EditToggleDeleteStyles,
};

class SmallLink extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {

    }

    toggleActive() {
        let { client, user_experience_id, is_hidden, refetch} = this.props;
        UserExperienceService.editUserExperience({client, user_experience_id, is_hidden: !is_hidden}).then((data) => {
            console.log("Toggled User Experience", data);
            refetch ? refetch() : null;
        })
    }

    deleteExperience() {
        let { client, user_experience_id, refetch} = this.props;

        let yes = confirm("Are you sure you want delete this experience? This action can not be undone!");

        if (yes) {
            UserExperienceService.deleteUserExperience({client, user_experience_id}).then((data) => {
                console.log("Removed Experience", data);
                refetch ? refetch() : null;
            })
        }
    }

    render() {
        let { classes, time, is_hidden, company_name, role_name, company_logo_url, timeElapsed, onEdit} = this.props;

        return (
            <div className={mc(classes.cardContainer)} style={{opacity: is_hidden ? 0.5 : 1}}>
                <div style={{display: "flex"}}>
                    <div className={mc(classes.cardImageContainer)}>
                        <CoverImageHolder url={company_logo_url}/>
                    </div>
                    <div style={{flex: 1}}>
                        <div className={mc(classes.cardTitle)}>{role_name}</div>
                        <div className={mc(classes.cardBody)}><span>{company_name}</span> • <span>{timeElapsed}</span> • <span>{time}</span></div>
                    </div>
                    <div className={mc(classes.centerAlignContainer, classes.editToggleDeleteSuperContainer)}>
                        <div className={mc(classes.centerAlignObject, classes.editToggleDeleteContainer)}>
                            <div className={mc(classes.editToggleDeleteEdit)} onClick={() => {onEdit ? onEdit() : null}}>
                                <i className={mc("fa-solid fa-pen")}/>
                            </div>
                            <div className={mc(classes.editToggleDeleteToggle)} onClick={() => (this.toggleActive())}>
                                <i className={`fa-solid fa-toggle-${is_hidden ? "off" : "on"}`}/>
                            </div>
                            <div className={mc(classes.editToggleDeleteDelete)} onClick={() => (this.deleteExperience())}>
                                <i className="fa-solid fa-xmark"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(SmallLink)));

