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


const Styles = {
    container: {
        padding: "6px 8px",
        '@media (max-width: 768px)': {
            padding: "0",
        },
        background: COLOR_WHITE,
        border: `1px solid ${COLOR_GREEN}`,
        ...FONT_SUBHEADER_BOLD,
        width: "fit-content",
        height: "31px",
        borderRadius: "6px",
        color: COLOR_GREEN,
        cursor: "pointer",
        position: "relative",
        marginBottom: "25px"
    },
    selectedFilters: {
        height: "18px",
        lineHeight: "18px",
        width: "18px",
        borderRadius: "100%",
        textAlign: "center",
        background: COLOR_WHITE,
        color: COLOR_GREEN ,
        ...FONT_CAPTION_2_BOLD,
    },
    input: {
        ...STYLE_INPUT
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
        let { classes, label, placeholder, options, selectedOptions, onAdd, onRemove, onClear } = this.props;

        selectedOptions = selectedOptions || [];

        return (<div className={classes.container} style={{
            background: selectedOptions.length >= 1 ? COLOR_GREEN : null,
            color: selectedOptions.length >= 1 ? COLOR_WHITE : null,
        }} ref={this.setWrapperRef}>

            <div style={{ height: "100%"}} onClick={() => {this.setState({show: !this.state.show})}}>
                {/*<div style={{display: "inline-block", paddingRight: selectedOptions.length ? "5px" : "25px"}}>{label}</div>*/}

                {/*{(selectedOptions.length >= 1 )&& <div style={{display: "inline-block", paddingRight: "15px"}}>*/}
                {/*    <div className={classes.selectedFilters}>{selectedOptions.length}</div>*/}
                {/*</div>}*/}

                <div style={{display: "inline-block"}}>

                    <div style={{display: "flex"}}>
                        <div style={{flex: 1, paddingRight: selectedOptions.length ? "5px" : "25px"}}>{label}</div>
                        {(selectedOptions.length >= 1 )&& <div style={{flex: 1, paddingRight: "15px"}}>
                            <div className={classes.selectedFilters}>{selectedOptions.length}</div>
                        </div>}
                    </div>
                </div>





                <div style={{display: "inline-block"}} >
                    <div style={{display: "flex"}}>
                        <div style={{flex: "0 0 1px"}}>
                            <div style={{height: "100%", width: "100%", background: selectedOptions.length ? COLOR_WHITE : COLOR_GREEN, borderRadius: "1px"}}/>
                        </div>
                        <div style={{flex: "0 0 15px", paddingLeft: "5px"}}>
                            <i className="fa-solid fa-angle-down"></i>
                        </div>
                    </div>
                </div>

            </div>



            { this.state.show && <div style={{
                position: "absolute",
                top: 40,
                left: 0,
                zIndex: 1,
                background: COLOR_WHITE,
                color: COLOR_GREEN,
                border: `1px solid ${COLOR_BORDER_GREY}`,
                borderRadius: "6px",
                width: "250px",
                height: "280px",
                paddingTop: "15px"
            }}>
                <div style={{display: "flex", height: "100%", flexDirection: "column"}}>
                    <div style={{flex: "0 0 45px", padding: "0 15px"}}>
                        <div style={{display: "flex"}}>
                            <div style={{flex: 1}}>
                                <input className={classes.input} placeholder={placeholder} value={this.state.filter} onChange={(e) => (this.setState({filter: e.target.value}))}/>
                            </div>
                            <div style={{flex: "0 0 25px", textAlign: "center", display: this.state.filter && this.state.filter.length ? null : "none" }} onClick={() => (this.setState({filter: ""}))}>
                                <i style={{fontSize: "12px", lineHeight: "25px"}} className="fa-solid fa-x"/>
                            </div>
                        </div>
                    </div>
                    <div style={{flex: 1, padding: "0 15px", overflowY: "scroll"}}>

                        {options.map((option) => {
                            const { filter } = this.state;

                            const selected = selectedOptions && selectedOptions.indexOf(option.id) !== -1;

                            if (filter && filter.length) {
                                let label = (option.label || "").toLowerCase();

                                if (label.indexOf(filter.toLowerCase()) === -1) {
                                    return null;
                                }
                            }

                            return (
                                <div key={option.id}>
                                    <div style={{display: "flex", marginBottom: "10px"}} onClick={() => {
                                        selected ? onRemove(option.id) :  onAdd(option.id)
                                    }}>
                                        <div style={{flex: "0 0 14px",
                                            height: "15px",
                                            textAlign: "center",
                                            border: `1px solid ${COLOR_GREEN}`,
                                            borderRadius: "3px",
                                            marginRight: "10px",
                                            background: selected ? COLOR_GREEN : COLOR_WHITE
                                        }}>
                                            {selected && <i style={{fontSize: "10px", lineHeight: "15px", color: COLOR_WHITE}} className="fa-solid fa-check"/>}
                                        </div>
                                        <div style={{flex: 1, lineHeight: "15px", ...FONT_FOOTNOTE_BOLD}}>
                                            {option.label}
                                        </div>
                                    </div>
                                </div>
                            );

                        })}
                    </div>
                    <div style={{flex: "0 0 50px"}}>
                        <div style={{...STYLE_BORDER_LINE, marginBottom: "9px"}}/>

                        <div style={{padding: "0 15px", textAlign: "right", ...FONT_FOOTNOTE_BOLD}}>
                            <div onClick={onClear} style={{display: "inline-block", marginRight: "10px", ...STYLE_BUTTON_FOOTNOTE_OUTLINE}}>Clear All</div>
                            <div onClick={() =>{
                                this.setState({show: false})
                            }} style={{display: "inline-block", marginRight: "10px", ...STYLE_BUTTON_FOOTNOTE}}>Apply</div>
                        </div>

                    </div>
                </div>
            </div>}
        </div>)
    }

}

export default withApollo(withRouter(injectSheet(Styles)(FilterDropdown)));

