import React from "react";
import _ from "lodash";
import moment from "moment";

import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import COMMON from "../../../common/index";
import StandardButton from "../../../components/StandardButton";
import StandardInput from "../../../components/StandardInput";
import CoverImageHolder from "../../../components/CoverImageHolder";

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

class EditSavedJobModalHeader extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        let { title, onClose, job, company_map, } = this.props;

        return (<div style={{...COMMON.STYLES.EDIT_PORTFOLIO_MODAL.MODAL_HEADER}}>
            <div style={{display: "flex"}}>
                <div style={{flex: 1}}>
                    <div style={{display: "flex"}}>
                        <div style={{flex: "0 0 40px", marginRight: "15px", height: "40px", border: `1px solid ${COMMON.COLORS.LIGHT_GREY}`, borderRadius: "6px", overflow: "hidden"}}>
                            
                        <Link to={`/companies/${(company_map[job.company_id] || {}).company_id}`}><CoverImageHolder url={(company_map[job.company_id] || {}).company_logo_url}/></Link>
                        </div>
                        <div style={{flex: 1}}>
                            <div style={{...COMMON.FONTS.FONT_HEADLINE_BOLD, lineHeight: "21px"}}>{job.job_title}</div>
                            <div style={{...COMMON.FONTS.FONT_SUBHEADER, color: COMMON.COLORS.DARK_GREY, lineHeight: "19px"}}>{(company_map[job.company_id] || {}).company_name}</div>
                        </div>
                    </div>
                </div>
                <div style={{flex: "0 0 8px", marginLeft: "10px"}} onClick={onClose}>
                    <i style={{cursor: "pointer",  fontSize: "16px", lineHeight: "22.85px"}} className="fa-solid fa-xmark"/>
                </div>
            </div>
        </div>);
    }

}

export default withApollo(withRouter(injectSheet(Styles)(EditSavedJobModalHeader)));

