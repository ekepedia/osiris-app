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
import RatingFilter from "./RatingFilter";

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
    },
    ratingsContainer: {
        marginBottom: "8px"
    },
    ratingsLabel: {
        ...COMMON.FONTS.P100,
        marginBottom: "8px",
        color: COMMON.COLORS.N800,

    }
};

class FilterDropdown extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
            checked: false,
            filter: ""
        };

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({show: false})
        }
    }

    render() {
        let { classes, label, placeholder, update,
            glassdoor_overall, glassdoor_work_life, glassdoor_culture, glassdoor_compensation,
            options, selectedOptions, onAdd, onRemove, onClear, disableSearch
        } = this.props;

        selectedOptions = selectedOptions || [];

        let hasSelected = selectedOptions.length >= 1;

        return (<div className={classes.container} style={{
            border: hasSelected ? `1px solid ${COMMON.COLORS.N600}` : null,
            color: hasSelected ? COMMON.COLORS.N800 : null,
        }} ref={this.setWrapperRef}>

            <div style={{ height: "100%", position: "relative"}} onClick={() => {this.setState({show: !this.state.show})}}>
                <div>
                    <div>
                        <div style={{paddingRight: hasSelected ? "32px" : "32px"}}>{label}{hasSelected && <div style={{display: "inline-block"}}>
                            <div className={classes.selectedFilters}>{selectedOptions.length}</div>
                        </div>}</div>

                    </div>
                </div>

                <div style={{position: "absolute", top: 5, right: 0}}>
                    <img src={"/img/custom-select-caret.png"} style={{height: "20px", width: "20px"}}/>
                </div>
            </div>



            { this.state.show && <div style={{
                position: "absolute",
                top: 36,
                left: 0,
                zIndex: 1,
                background: COMMON.COLORS.N0,
                border: `1px solid ${COMMON.COLORS.N300}`,
                borderRadius: "4px",
                width: "240px",
                maxHeight: "215px",
                paddingTop: "0",
                overflow: "hidden"
            }}>
                <div style={{display: "flex", height: "100%", flexDirection: "column"}}>
                    <div style={{flex: "0 0 32px", padding: "0", position: "relative", display: disableSearch ? "none" : null}}>

                        <div style={{position: "absolute", left: 12, top: 10}}>
                            <i className="fa-solid fa-magnifying-glass" style={{fontSize: "12px", color: COMMON.COLORS.N600}}/>
                        </div>

                        <input className={classes.input} placeholder={placeholder} value={this.state.filter} onChange={(e) => (this.setState({filter: e.target.value}))}/>
                    </div>

                    <div style={{flex: 1, padding: "8px 12px", overflowY: "scroll", maxHeight: "183px"}}>
                        <div className={classes.ratingsContainer}>
                            <div className={classes.ratingsLabel}>Overall</div>
                            <RatingFilter value={glassdoor_overall} update={(val) => update("glassdoor_overall", val)} />
                        </div>
                        <div className={classes.ratingsContainer}>
                            <div className={classes.ratingsLabel}>Pay</div>
                            <RatingFilter value={glassdoor_compensation} update={(val) => update("glassdoor_compensation", val)} />
                        </div>
                        <div className={classes.ratingsContainer}>
                            <div className={classes.ratingsLabel}>Work Life</div>
                            <RatingFilter value={glassdoor_work_life} update={(val) => update("glassdoor_work_life", val)} />
                        </div>
                        <div className={classes.ratingsContainer}>
                            <div className={classes.ratingsLabel}>Culture</div>
                            <RatingFilter value={glassdoor_culture} update={(val) => update("glassdoor_culture", val)} />
                        </div>
                    </div>
                </div>
            </div>}
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(FilterDropdown)));

