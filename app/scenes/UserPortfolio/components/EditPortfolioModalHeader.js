import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import COMMON from "../../../common/index";
import StandardButton from "../../../components/StandardButton";
import StandardInput from "../../../components/StandardInput";

const Styles = {
    container: {
        padding: "0",
        '@media (max-width: 768px)': {
            padding: "0",
        },
    },
    sectionLabel: {
        color: COMMON.COLORS.DARK_GREY,
        marginBottom: "15px",
        ...COMMON.FONTS.FONT_HEADLINE_BOLD
    },
    inputLabel: {
        color: COMMON.COLORS.DARK_GREY,
        marginBottom: "6px",
        ...COMMON.FONTS.FONT_FOOTNOTE
    }
};

class EditPortfolioModalHeader extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        let { title, onClose } = this.props;

        return (<div style={COMMON.STYLES.EDIT_PORTFOLIO_MODAL.MODAL_HEADER}>
            <div style={{display: "flex"}}>
                <div style={{flex: 1}}>
                    {title}
                </div>
                <div style={{flex: "0 0 15px", marginLeft: "10px"}} onClick={onClose}>
                    <i style={{cursor: "pointer",  fontSize: "11px", lineHeight: "22.85px"}} className="fa-solid fa-x"/>
                </div>
            </div>
        </div>);
    }

}

export default withApollo(withRouter(injectSheet(Styles)(EditPortfolioModalHeader)));

