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
        UserLinkService.editUserSmallLink({client, user_link_id, is_hidden: !is_hidden}).then((d) => {
            refetch ? refetch() : null;
        })
    }

    deleteLink() {
        let { client, user_link_id, refetch} = this.props;

        let yes = confirm("Are you sure you want delete this banner link? This action can not be undone!");

        if (yes) {
            UserLinkService.deleteUserLink({client, user_link_id}).then((data) => {
                console.log("Removed", data);
                refetch ? refetch() : null;
            })
        }
    }

    render() {
        let { classes, link, url, is_hidden, link_name, portfolioLinkRef, currentHeight, onEdit} = this.props;

        let maxWidth = link_name && link_name.length && link_name.length > 60 ? 400 : 500;

        return (
            <div style={{ opacity: is_hidden ? 0.5 : 1}}>
                <div className={mc(classes.linkContainer)} style={{height: currentHeight ? currentHeight : null}} ref={portfolioLinkRef}>
                    <CoverImageHolder url={url}/>

                    <div className={mc(classes.editToggleDeleteFloatingContainer)}>
                        <div className={mc(classes.editToggleDeleteContainer)}>
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

                    <div className={mc(classes.linkText)}>
                        <div style={{display: "flex"}}>
                            <div style={{flex: 1}}>
                                <div style={{maxWidth}}>
                                    {link_name}
                                </div>
                            </div>
                            <div className={mc(classes.centerAlignContainer)} style={{flex: "0 0 20px"}}>
                                <i className={mc("fa-solid fa-link", classes.centerAlignObject)}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default withApollo(withRouter(injectSheet(Styles)(SmallLink)));

