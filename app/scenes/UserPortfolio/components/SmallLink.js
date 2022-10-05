import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import COMMON from "../../../common/index";
import { mc } from "../../../common/helpers";
import CoverImageHolder from "../../../components/CoverImageHolder";
import UserLinkService from "../../../services/UserLinkService";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    ...COMMON.STYLES.GENERAL.alignmentStyles,
    ...COMMON.STYLES.PORTFOLIO.StandardCardStyles,
    ...COMMON.STYLES.PORTFOLIO.PortfolioPageStyles,
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
        let { client, user_link_id, is_hidden, refetch} = this.props;
        UserLinkService.editUserSmallLink({client, user_link_id, is_hidden: !is_hidden}).then((data) => {
            console.log("Delete Small Link", data);
            refetch ? refetch() : null;
        })
    }

    deleteLink() {
        let { client, user_link_id, refetch} = this.props;

        let yes = confirm("Are you sure you want delete this link? This action can not be undone!");

        if (yes) {
            UserLinkService.deleteUserLink({client, user_link_id}).then((data) => {
                console.log("Removed small link", data);
                refetch ? refetch() : null;
            })
        }
    }


    render() {
        let { classes, user, is_hidden, link, url, link_name, onEdit} = this.props;

        link = link || "";

        let clean_link = link.replace("http://" ,"").replace("https://" ,"")

        return (
            <div style={{opacity: is_hidden ? 0.5 : 1}}>
                <div className={mc(classes.cardContainer)} style={{color: COMMON.COLORS.DARK_GREY, textDecoration: "none"}}>
                    <div style={{display: "flex"}}>
                        <div className={mc(classes.cardImageContainer)}>
                            <CoverImageHolder url={url}/>
                        </div>
                        <div style={{flex: 1, overflow: "hidden", paddingRight: "5px"}}>
                            <div>
                                <div className={mc(classes.cardSmallLinkTitle)}>{link_name}</div>
                                <div className={mc(classes.cardSubTitle)}>{clean_link}</div>
                            </div>
                        </div>
                        <div className={mc(classes.centerAlignContainer, classes.editToggleDeleteSuperContainer)}>
                            <div className={mc(classes.centerAlignObject, classes.editToggleDeleteContainer)}>
                                <div className={mc(classes.editToggleDeleteEdit)} onClick={() => {onEdit ? onEdit() : null}}>
                                    <i className={mc("fa-solid fa-pen")}/>
                                </div>
                                <div className={mc(classes.editToggleDeleteToggle)} onClick={() => (this.toggleActive())}>
                                    <i className={`fa-solid fa-toggle-${is_hidden ? "off" : "on"}`}/>
                                </div>
                                <div className={mc(classes.editToggleDeleteDelete)} onClick={() => (this.deleteLink())}>
                                    <i className="fa-solid fa-xmark"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(SmallLink)));

