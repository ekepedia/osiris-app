import React from "react";
import _ from "lodash";
import moment from "moment";

import { gql } from 'apollo-boost';
import { Query } from '@apollo/react-components';
import { withApollo } from 'react-apollo';
import { withRouter, Link} from 'react-router-dom';

import injectSheet from 'react-jss';

import DataService from '../services/DataService';

import {COLOR_GREEN, COLOR_WHITE, COLOR_BORDER_GREY} from "../common/colors";
import {STYLE_BORDER_LINE, STYLE_BUTTON_FOOTNOTE, STYLE_BUTTON_FOOTNOTE_OUTLINE, STYLE_INPUT} from "../common/styles";
import {
    FONT_CAPTION_2_BOLD,
    FONT_SUBHEADER_BOLD,
    FONT_FOOTNOTE_BOLD
} from "../common/fonts";

import COMMON from "../common/index";
import { mc } from "../common/helpers";
import CONSTS from "../common/consts";
import StandardSelect from "./StandardSelect";

const Styles = {
    container: {
        padding: "0 12px",
        '@media (max-width: 768px)': {
            padding: "0",
        },
        background: COMMON.COLORS.N0,
        border: `1px solid ${COMMON.COLORS.N300}`,
        ...COMMON.FONTS.P100,
        width: "fit-content",
        height: "32px",
        lineHeight: "32px",
        borderRadius: "4px",
        color: COMMON.COLORS.N600,
        cursor: "pointer",
        position: "relative",
        marginBottom: "25px"
    },
    selectedFilters: {
        ...COMMON.FONTS.H100,
        height: "20px",
        lineHeight: "20px",
        width: "20px",
        borderRadius: "100%",
        textAlign: "center",
        background: COMMON.COLORS.N100,
        color: COMMON.COLORS.N800,
        border: `1px solid ${COMMON.COLORS.N600}`,
        marginLeft: "8px"
    },
    input: {
        height: "100%",
        border: "none",
        width: "100%",
        outline: "none",
        paddingLeft: "32px",
        background: COMMON.COLORS.N50,
        color: COMMON.COLORS.N700
    },
    selectOption: {
        borderTop: `1px solid ${COMMON.COLORS.N300}`,
        padding: "8px 12px",
        color: COMMON.COLORS.N800,
        borderLeft: `1px solid ${COMMON.COLORS.N0}`,
        transition: "all 0.1s",
        ...COMMON.FONTS.P100,
    }
};

class PostCategoryDropdown extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            privacy_options: COMMON.CONSTS.PRIVACY
        }
    }

    componentDidMount() {

    }

    render() {
        let privacy_options = this.state;

        return (<div>
            <div style={{display: "flex"}}>
                <div style={{flex: 1, paddingRight: "5px"}}>
                    <StandardSelect
                        placeholder={"Privacy"}
                        options={COMMON.CONSTS.PRIVACY}
                        onChange={(ids) => {
                            console.log("ids", ids);
                        }}
                        hideIndicator={true}
                    />
                    <StandardSelect
                        placeholder={"Topic"}
                        options={COMMON.CONSTS.QUESTION_TOPICS}
                        onChange={(ids) => {
                            console.log("ids", ids);
                        }}
                        hideIndicator={true}
                    />
                </div>
            </div>
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(PostCategoryDropdown)));
